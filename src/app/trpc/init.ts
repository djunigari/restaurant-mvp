import { prisma } from "@/utils/prisma"
import { initTRPC, TRPCError } from "@trpc/server"
import { cookies } from "next/headers"
import { cache } from "react"
import superjson from "superjson"

// 👇 Context: só coleta headers e disponibiliza Prisma + deviceId + fingerprint
export const createTRPCContext = cache(async (opts?: { req?: Request }) => {
  console.group("Creating TRPC Context")
  console.log("Request Headers:", opts?.req?.headers)
  console.log("Request URL:", opts?.req?.url)
  console.log("Request Method:", opts?.req?.method)

  const headers = opts?.req?.headers

  // console.log("Creating TRPC context", {
  //   headers: headers ? Object.fromEntries(headers.entries()) : "No headers",
  // })
  const cookiesStore = await cookies()
  const deviceId = cookiesStore.get("x-device-id")?.value || ""
  const fingerprint = cookiesStore.get("x-device-fingerprint")?.value || ""

  if (!headers) {
    // chamadas internas (SSR, etc)
    console.groupEnd()
    return { userId: "server_job", db: prisma, deviceId: "", fingerprint: "" }
  }

  const ip = headers.get("x-forwarded-for") || ""
  const userAgent = headers.get("user-agent") || ""

  console.groupEnd()
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
  console.group("Device Middleware")
  console.log("Verificando dispositivo no middleware", {
    deviceId: ctx.deviceId,
    fingerprint: ctx.fingerprint,
  })
  if (!ctx.deviceId || !ctx.fingerprint) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Dispositivo não identificado",
    })
  }

  const device = await ctx.db.device.findUnique({
    where: { id: ctx.deviceId },
  })

  if (!device) {
    console.error("Dispositivo não encontrado", { deviceId: ctx.deviceId })
    console.groupEnd()
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Dispositivo não encontrado",
    })
  }

  if (!device.authorized) {
    console.error("Dispositivo não autorizado", { deviceId: ctx.deviceId })
    console.groupEnd()
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Dispositivo não autorizado",
    })
  }

  if (device.fingerprint !== ctx.fingerprint) {
    console.error("Dispositivo fingerprint inválido", {
      deviceId: ctx.deviceId,
      fingerprint: ctx.fingerprint,
    })
    console.groupEnd()
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Dispositivo não autorizado",
    })
  }

  console.log("Dispositivo autorizado no middleware", {
    deviceId: ctx.deviceId,
  })
  console.groupEnd()
  return next({
    ctx: {
      ...ctx,
      device, // se quiser injetar
    },
  })
})

// 👇 Você cria um procedure protegido com isso
export const protectedProcedure = baseProcedure.use(deviceMiddleware)
