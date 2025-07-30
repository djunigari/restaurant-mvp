import { ComandaStatus } from "@/types/comanda"
import { Order } from "@/types/order"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "../init"

export const orderRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z
        .object({
          id: z.number().optional(),
          comandaId: z.number().optional(),
          from: z.string().datetime().optional(), // ISO string
          to: z.string().datetime().optional(), // ISO string
          pageIndex: z.number().optional().default(0),
          pageSize: z.number().optional().default(10),
          sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const { pageIndex = 0, pageSize = 10, sortOrder = "desc" } = input ?? {}
      console.log("Fetching orders with input:", input)

      const where = {
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
      }

      const [totalCount, items] = await ctx.db.$transaction([
        ctx.db.order.count({ where }),
        ctx.db.order.findMany({
          where,
          skip: pageIndex * pageSize,
          take: pageSize,
          include: {
            comanda: true,
          },
          orderBy: { id: sortOrder },
        }),
      ])

      return { totalCount, items: items as Order[] }
    }),

  getAllByComandaId: protectedProcedure
    .input(
      z
        .object({
          comandaId: z.number(),
          from: z.string().datetime().optional(), // ISO string
          to: z.string().datetime().optional(), // ISO string
          pageIndex: z.number().optional().default(0),
          pageSize: z.number().optional().default(10),
          sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const { pageIndex = 0, pageSize = 10, sortOrder = "desc" } = input ?? {}
      const where = {
        ...(input?.comandaId ? { comandaId: input.comandaId } : {}),
        ...(input?.from || input?.to
          ? {
              createdAt: {
                ...(input?.from ? { gte: new Date(input.from) } : {}),
                ...(input?.to ? { lte: new Date(input.to) } : {}),
              },
            }
          : {}),
      }

      const [totalCount, items] = await ctx.db.$transaction([
        ctx.db.order.count({ where }),
        ctx.db.order.findMany({
          where,
          skip: pageIndex * pageSize,
          take: pageSize,
          orderBy: { id: sortOrder },
        }),
      ])

      return { totalCount, items }
    }),

  getById: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return ctx.db.order.findUnique({
        where: { id: input },
        include: { comanda: true, items: { include: { product: true } } },
      })
    }),

  getCurrentByComandaId: protectedProcedure
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

  start: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
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

  paid: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
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

  cancel: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
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

  addOrderItem: protectedProcedure
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

  removeOrderItem: protectedProcedure
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
