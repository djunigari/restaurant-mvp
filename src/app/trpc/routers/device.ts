import { z } from "zod"
import { baseProcedure, createTRPCRouter } from "../init"

export const deviceRouter = createTRPCRouter({
  register: baseProcedure
    .input(
      z.object({
        name: z.string(),
        fingerprint: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("Registering device:", input)
      // Verifica se o dispositivo já está registrado

      const founded = await ctx.db.device.findFirst({
        where: { fingerprint: input.fingerprint },
      })
      if (founded) {
        return { deviceId: founded.id, fingerprint: founded.fingerprint }
      }
      const device = await ctx.db.device.create({
        data: {
          name: input.name,
          fingerprint: input.fingerprint,
          authorized: false, // começa desautorizado
          userAgent: ctx.userAgent ?? "",
          lastKnownIp: ctx.ip ?? "0.0.0.0",
        },
      })
      return { deviceId: device.id, fingerprint: device.fingerprint }
    }),
})
