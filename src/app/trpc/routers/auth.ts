import { verifySession } from "@/lib/auth/dal"
import { createSession, deleteSession } from "@/lib/auth/session"
import { TRPCError } from "@trpc/server"
import bcrypt from "bcrypt"
import z from "zod"
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init"

export const authRouter = createTRPCRouter({
  getSession: baseProcedure.query(async () => {
    return verifySession()
  }),

  signup: baseProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.user.findUnique({
        where: { email: input.email },
      })
      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already exists",
        })
      }

      const passwordHash = await bcrypt.hash(input.password, 10)

      const user = await ctx.db.user.create({
        data: {
          email: input.email,
          passwordHash,
          name: input.name,
          role: "USER",
        },
      })

      // cria session no DB e cookie
      await createSession(user)

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      }
    }),

  login: baseProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
      })

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        })
      }

      const valid = await bcrypt.compare(input.password, user.passwordHash)
      if (!valid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        })
      }

      await createSession(user)

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      }
    }),

  logout: baseProcedure.mutation(async () => {
    await deleteSession()
    return true
  }),

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
          where.id = filter
        } else {
          where.name = {
            contains: filter,
            // mode: "insensitive", // Uncomment if you want case-insensitive search
          }
        }
        const [data, totalCount] = await Promise.all([
          ctx.db.user.findMany({
            where,
            skip: pageIndex * pageSize,
            take: pageSize,
            orderBy: { id: sortOrder },
          }),
          ctx.db.user.count({
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
        console.error("Error fetching users:", error)
        throw new Error("Failed to fetch users")
      }
    }),

  create: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const existingUser = await ctx.db.user.findUnique({
          where: { email: input.email },
        })
        if (existingUser) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Email already exists",
          })
        }

        const passwordHash = await bcrypt.hash(input.password, 10)

        const user = await ctx.db.user.create({
          data: {
            email: input.email,
            passwordHash,
            name: input.name,
            role: "USER",
          },
        })

        return {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        }
      } catch (err) {
        console.error("Error creating user:", err)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not create user",
        })
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: input.id },
        data: {
          name: input.name,
        },
      })
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.delete({
        where: { id: input },
      })
    }),

  changePasswordFromAdmin: protectedProcedure
    .input(
      z.object({
        userId: z.string(), // ID do usuário cuja senha será alterada
        newPassword: z.string().min(6), // Nova senha
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuário não autenticado.",
        })
      }

      // Verifica se o usuário logado é ADMIN
      const admin = await ctx.db.user.findUnique({
        where: { id: ctx.userId },
      })

      if (!admin || admin.role !== "ADMIN") {
        console.error("Apenas administradores podem alterar senhas.")
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem alterar senhas.",
        })
      }

      const targetUser = await ctx.db.user.findUnique({
        where: { id: input.userId },
      })

      if (!targetUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Usuário não encontrado.",
        })
      }

      const passwordHash = await bcrypt.hash(input.newPassword, 10)

      await ctx.db.user.update({
        where: { id: input.userId },
        data: { passwordHash },
      })

      return { success: true, message: "Senha alterada com sucesso." }
    }),

  updateOwnPassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string(),
        newPassword: z.string().min(6),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuário não autenticado.",
        })
      }

      const user = await ctx.db.user.findUnique({
        where: { id: ctx.userId },
      })

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuário não encontrado.",
        })
      }

      const isValid = await bcrypt.compare(
        input.currentPassword,
        user.passwordHash,
      )

      if (!isValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Senha atual incorreta.",
        })
      }

      const newPasswordHash = await bcrypt.hash(input.newPassword, 10)

      await ctx.db.user.update({
        where: { id: user.id },
        data: { passwordHash: newPasswordHash },
      })

      return { success: true, message: "Senha atualizada com sucesso." }
    }),
})
