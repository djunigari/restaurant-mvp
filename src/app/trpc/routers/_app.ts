import { z } from "zod"
import { baseProcedure, createTRPCRouter } from "../init"
import { comandaRouter } from "./comanda"
import { orderRouter } from "./order"
import { productRouter } from "./product"
export const appRouter = createTRPCRouter({
  ping: baseProcedure.input(z.object({})).query(() => {
    return "pong"
  }),
  product: productRouter,
  comanda: comandaRouter,
  order: orderRouter,
})

export type AppRouter = typeof appRouter
