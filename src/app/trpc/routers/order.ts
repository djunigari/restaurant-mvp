import { ComandaStatus } from "@/generated/prisma"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { baseProcedure, createTRPCRouter } from "../init"

export const orderRouter = createTRPCRouter({
  getAll: baseProcedure
    .input(
      z
        .object({
          id: z.number().optional(),
          comandaId: z.number().optional(),
          from: z.string().datetime().optional(), // ISO string
          to: z.string().datetime().optional(), // ISO string
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.order.findMany({
        where: {
          ...(input?.id ? { id: input.id } : {}),
          ...(input?.comandaId ? { comandaId: input.comandaId } : {}),
          ...(input?.from || input?.to
            ? {
                createdAt: {
                  ...(input?.from ? { gte: new Date(input.from) } : {}),
                  ...(input?.to ? { lte: new Date(input.to) } : {}),
                },
              }
            : {}),
        },
        include: {
          comanda: true,
        },
        orderBy: { id: "desc" },
      })
    }),

  getAllByComandaId: baseProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return ctx.db.order.findMany({
        where: {
          comandaId: input,
        },
        orderBy: { id: "desc" },
      })
    }),

  getById: baseProcedure.input(z.number()).query(async ({ ctx, input }) => {
    return ctx.db.order.findUnique({
      where: { id: input },
      include: { comanda: true, items: { include: { product: true } } },
    })
  }),

  getCurrentByComandaId: baseProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return ctx.db.order.findFirst({
        where: {
          comandaId: input,
          paidAt: null,
          canceledAt: null,
        },
        include: {
          items: {
            include: { product: true },
          },
        },
        orderBy: { id: "desc" },
      })
    }),

  start: baseProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    const comanda = await ctx.db.comanda.update({
      where: { id: input },
      data: { status: "OCCUPIED" },
    })

    await ctx.db.order.create({
      data: {
        comandaId: comanda.id,
        items: {},
      },
    })

    return comanda
  }),

  paid: baseProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    const order = await ctx.db.order.update({
      where: { id: input },
      data: { paidAt: new Date() },
    })

    await ctx.db.comanda.update({
      where: { id: order.comandaId },
      data: { status: ComandaStatus.OPEN },
    })

    return
  }),

  cancel: baseProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    const order = await ctx.db.order.update({
      where: { id: input },
      data: { canceledAt: new Date() },
    })

    const res = await ctx.db.comanda.update({
      where: { id: order.comandaId },
      data: { status: ComandaStatus.OPEN },
    })

    console.log("Comanda updated after canceling order:", res)
    return
  }),

  addOrderItem: baseProcedure
    .input(
      z.object({
        orderId: z.number(),
        amount: z.number().min(1),
        productId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verifica se o pedido existe
      const order = await ctx.db.order.findUnique({
        where: { id: input.orderId },
      })

      if (!order)
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" })

      // Verifica se o produto existe
      const product = await ctx.db.product.findUnique({
        where: { id: input.productId },
      })

      if (!product)
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" })

      // Verifica se o item já existe na ordem
      const existingItem = await ctx.db.orderItem.findUnique({
        where: {
          orderId_productId: {
            orderId: input.orderId,
            productId: input.productId,
          },
        },
      })

      if (existingItem) {
        // Atualiza a quantidade somando 1
        await ctx.db.orderItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + input.amount },
        })
      } else {
        // Cria o item com quantidade 1
        await ctx.db.orderItem.create({
          data: {
            orderId: input.orderId,
            productId: input.productId,
            quantity: input.amount,
          },
        })
      }
    }),

  removeOrderItem: baseProcedure
    .input(
      z.object({
        orderId: z.number(),
        amount: z.number().min(1),
        productId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingItem = await ctx.db.orderItem.findUnique({
        where: {
          orderId_productId: {
            orderId: input.orderId,
            productId: input.productId,
          },
        },
      })

      if (!existingItem) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" })
      }

      const newQuantity = existingItem.quantity - input.amount

      if (newQuantity <= 0) {
        // Se zerar ou ficar negativo, deleta o item
        await ctx.db.orderItem.delete({
          where: { id: existingItem.id },
        })
        return { removed: true }
      } else {
        // Senão, atualiza com a nova quantidade
        await ctx.db.orderItem.update({
          where: { id: existingItem.id },
          data: { quantity: newQuantity },
        })

        return { removed: false, newQuantity }
      }
    }),
})
