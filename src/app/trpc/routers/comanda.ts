import { z } from "zod"
import { baseProcedure, createTRPCRouter } from "../init"

export const comandaRouter = createTRPCRouter({
  getAll: baseProcedure.query(async ({ ctx }) => {
    return ctx.db.comanda.findMany({
      include: {
        orders: true,
      },
      orderBy: { id: "desc" },
    })
  }),

  getById: baseProcedure.input(z.number()).query(async ({ ctx, input }) => {
    return ctx.db.comanda.findUnique({
      where: { id: input },
      include: {
        orders: {
          include: {
            items: true,
          },
        },
      },
    })
  }),

  create: baseProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    return ctx.db.comanda.create({
      data: {
        id: input,
        status: "OPEN",
      },
    })
  }),

  updateStatus: baseProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["OPEN", "OCCUPIED"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.comanda.update({
        where: { id: input.id },
        data: { status: input.status },
      })
    }),

  delete: baseProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    return ctx.db.comanda.delete({
      where: { id: input },
    })
  }),
})
