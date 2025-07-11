import { verifySession } from "@/lib/auth/dal"
import { createSession, deleteSession } from "@/lib/auth/session"
import { TRPCError } from "@trpc/server"
import bcrypt from "bcrypt"
import z from "zod"
import { baseProcedure, createTRPCRouter } from "../init"

export const authRouter = createTRPCRouter({
  getSession: baseProcedure.query(async () => {
    const session = await verifySession()
    if (!session) return null

    return {
      ...session,
      expiresAt: session.expiresAt.toISOString(),
    }
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
})
