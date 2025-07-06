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
      const device = await ctx.db.device.create({
        data: {
          name: input.name,
          fingerprint: input.fingerprint,
          authorized: false, // começa desautorizado
        },
      })
      return { deviceId: device.id }
    }),
})
