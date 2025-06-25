import { z } from "zod"
import { baseProcedure, createTRPCRouter } from "../init"

export const productRouter = createTRPCRouter({
  // ✅ Listar todos com paginação, filtro e ordenação
  getAll: baseProcedure
    .input(
      z
        .object({
          pageIndex: z.number().optional().default(0),
          pageSize: z.number().optional().default(10),
          nameFilter: z.string().optional().default(""),
          sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const {
        pageIndex = 0,
        pageSize = 10,
        nameFilter = "",
        sortOrder = "desc",
      } = input ?? {}
      try {
        const [data, totalCount] = await Promise.all([
          ctx.db.product.findMany({
            where: {
              name: {
                contains: nameFilter,
                // mode: "insensitive",
              },
            },
            skip: pageIndex * pageSize,
            take: pageSize,
            orderBy: { id: sortOrder },
          }),
          ctx.db.product.count({
            where: {
              name: {
                contains: nameFilter,
                // mode: "insensitive",
              },
            },
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
  getById: baseProcedure.input(z.number()).query(async ({ ctx, input }) => {
    return ctx.db.product.findUnique({
      where: { id: input },
    })
  }),

  // ✅ Criar produto
  create: baseProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional().default(""),
        price: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.product.create({ data: input })
    }),

  // ✅ Atualizar produto
  update: baseProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
        price: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
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
  delete: baseProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    return ctx.db.product.delete({
      where: { id: input },
    })
  }),
})
