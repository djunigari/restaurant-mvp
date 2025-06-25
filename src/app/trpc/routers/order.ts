import { z } from "zod"
import { baseProcedure, createTRPCRouter } from "../init"

export const orderRouter = createTRPCRouter({
  getAll: baseProcedure.query(async ({ ctx }) => {
    return ctx.db.order.findMany({
      include: {
        comanda: true,
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

    ctx.db.comanda.update({
      where: { id: order.comandaId },
      data: { status: "OPEN" },
    })

    return
  }),

  cancel: baseProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    const order = await ctx.db.order.update({
      where: { id: input },
      data: { canceledAt: new Date() },
    })

    ctx.db.comanda.update({
      where: { id: order.comandaId },
      data: { status: "OPEN" },
    })

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

      if (!order) throw new Error("Order not found")

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
        throw new Error("Order item not found")
      }

      const newQuantity = existingItem.quantity - input.amount

      if (newQuantity <= 0) {
        // Se zerar ou ficar negativo, deleta o item
        await ctx.db.orderItem.delete({
          where: { id: existingItem.id },
        })
      } else {
        // Senão, atualiza com a nova quantidade
        await ctx.db.orderItem.update({
          where: { id: existingItem.id },
          data: { quantity: newQuantity },
        })
      }
    }),
})
