import { prisma } from "@/utils/prisma"
import { initTRPC, TRPCError } from "@trpc/server"
import { cache } from "react"
import superjson from "superjson"

// 👇 Context: só coleta headers e disponibiliza Prisma + deviceId + fingerprint
export const createTRPCContext = cache(async (opts?: { req?: Request }) => {
  const headers = opts?.req?.headers

  // console.log("Creating TRPC context", {
  //   headers: headers ? Object.fromEntries(headers.entries()) : "No headers",
  // })

  if (!headers) {
    // chamadas internas (SSR, etc)
    return { userId: "server_job", db: prisma, deviceId: "", fingerprint: "" }
  }

  const ip = headers.get("x-forwarded-for") || ""
  const userAgent = headers.get("user-agent") || ""
  const deviceId = headers.get("x-device-id") || ""
  const fingerprint = headers.get("x-device-fingerprint") || ""

  return {
    userId: "user_123",
    db: prisma,
    deviceId,
    fingerprint,
    ip,
    userAgent,
  }
})

export type Context = Awaited<ReturnType<typeof createTRPCContext>>

// 👇 Inicializa tRPC
const t = initTRPC.context<Context>().create({ transformer: superjson })

export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory
export const baseProcedure = t.procedure

// 👇 middleware de verificação do device
const deviceMiddleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.deviceId || !ctx.fingerprint) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Dispositivo não identificado",
    })
  }

  const device = await ctx.db.device.findUnique({
    where: { id: ctx.deviceId },
  })

  if (!device || !device.authorized || device.fingerprint !== ctx.fingerprint) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Dispositivo não autorizado",
    })
  }

  return next({
    ctx: {
      ...ctx,
      device, // se quiser injetar
    },
  })
})

// 👇 Você cria um procedure protegido com isso
export const protectedProcedure = baseProcedure.use(deviceMiddleware)
