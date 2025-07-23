import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "../init"

export const productRouter = createTRPCRouter({
  // ✅ Listar todos com paginação, filtro e ordenação
  getAll: protectedProcedure
    .input(
      z
        .object({
          pageIndex: z.number().optional().default(0),
          pageSize: z.number().optional().default(10),
          filter: z.string().optional().default(""),
          typeFilter: z.enum(["ID", "Name"]).optional().default("Name"),
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
        } else {
          where.name = {
            contains: filter,
            // mode: "insensitive", // Uncomment if you want case-insensitive search
          }
        }
        const [data, totalCount] = await Promise.all([
          ctx.db.product.findMany({
            where,
            skip: pageIndex * pageSize,
            take: pageSize,
            orderBy: { id: sortOrder },
          }),
          ctx.db.product.count({
            where,
          }),
        ])

        return {
          data,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
          pageIndex,
        }
      } catch (error) {
        console.error("Error fetching products:", error)
        throw new Error("Failed to fetch products")
      }
    }),

  // ✅ Buscar um por ID
  getById: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return ctx.db.product.findUnique({
        where: { id: input },
      })
    }),

  // ✅ Criar produto
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional().default(""),
        price: z.number(),
        barcode: z.string().optional().default(""),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("Creating product:", input)
      try {
        return ctx.db.product.create({ data: input })
      } catch (error: any) {
        if (error.message.includes("unique constraint")) {
          throw new Error("Produto já existe com esse nome")
        }
      }
    }),

  // ✅ Atualizar produto
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        description: z.string().optional(),
        price: z.number(),
        barcode: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("Updating product:", input)
      return ctx.db.product.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
          price: input.price,
        },
      })
    }),

  // ✅ Deletar produto
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.product.delete({
        where: { id: input },
      })
    }),
})
