import { Comanda } from "@/types/comanda"
import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "../init"

export const comandaRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z
        .object({
          pageIndex: z.number().optional().default(0),
          pageSize: z.number().optional().default(10),
          filter: z.string().optional().default(""),
          typeFilter: z.enum(["ID", "Status"]).default("ID"),
          sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const {
        pageIndex = 0,
        pageSize = 10,
        filter = "",
        sortOrder = "desc",
      } = input ?? {}
      try {
        const where = {} as any
        if (input?.typeFilter === "ID" && filter && filter.trim() != "") {
          where.id = Number(filter)
        } else if (input?.typeFilter === "Status") {
          const status = filter
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
          if (status.length > 0) {
            where.status = { in: status }
          }
        }

        const [data, totalCount] = await Promise.all([
          ctx.db.comanda.findMany({
            where,
            skip: pageIndex * pageSize,
            take: pageSize,
            orderBy: { id: sortOrder },
          }),
          ctx.db.comanda.count({
            where,
          }),
        ])

        return {
          data: data as Comanda[],
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
          pageIndex,
        }
      } catch (error) {
        console.error("Error fetching comandas:", error)
        throw new Error("Failed to fetch comandas")
      }
    }),

  getById: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return ctx.db.comanda.findUnique({
        where: { id: input },
      })
    }),

  create: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.comanda.create({
        data: {
          id: input,
          status: "OPEN",
        },
      })
    }),

  updateStatus: protectedProcedure
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

  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.comanda.delete({
        where: { id: input },
      })
    }),
})
