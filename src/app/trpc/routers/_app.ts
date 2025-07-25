import { z } from "zod"
import { baseProcedure, createTRPCRouter } from "../init"
import { authRouter } from "./auth"
import { comandaRouter } from "./comanda"
import { deviceRouter } from "./device"
import { orderRouter } from "./order"
import { productRouter } from "./product"
export const appRouter = createTRPCRouter({
  ping: baseProcedure.input(z.object({})).query(() => {
    return "pong"
  }),
  auth: authRouter,
  product: productRouter,
  comanda: comandaRouter,
  order: orderRouter,
  device: deviceRouter,
})

export type AppRouter = typeof appRouter
