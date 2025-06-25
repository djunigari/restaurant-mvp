import { prisma } from "@/utils/prisma"
import { initTRPC } from "@trpc/server"
import { cache } from "react"

export const createTRPCContext = cache(async () => {
  return { userId: "user_123", db: prisma }
})

export type Context = Awaited<ReturnType<typeof createTRPCContext>>

const t = initTRPC.context<Context>().create({})

export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory
export const baseProcedure = t.procedure
