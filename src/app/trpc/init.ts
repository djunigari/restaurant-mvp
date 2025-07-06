import { prisma } from "@/utils/prisma"
import { initTRPC, TRPCError } from "@trpc/server"
import { cache } from "react"

export const createTRPCContext = cache(async (opts?: { req?: Request }) => {
  const headers = opts?.req?.headers

  console.log("Creating TRPC context", {
    headers: headers ? Object.fromEntries(headers.entries()) : "No headers",
  })

  if (!headers) {
    // significa chamada interna server-side, sem headers do browser
    return { userId: "server_job", db: prisma, deviceId: "", fingerprint: "" }
  }

  const deviceId = headers?.get("x-device-id") || ""
  const fingerprint = headers?.get("x-device-fingerprint") || ""

  if (!deviceId || !fingerprint) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Dispositivo não identificado",
    })
  }

  const device = await prisma.device.findUnique({
    where: { id: deviceId },
  })

  if (!device || !device.authorized || device.fingerprint !== fingerprint) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Dispositivo não autorizado",
    })
  }

  return { userId: "user_123", db: prisma, deviceId, fingerprint }
})
export type Context = Awaited<ReturnType<typeof createTRPCContext>>

const t = initTRPC.context<Context>().create({})

export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory
export const baseProcedure = t.procedure
