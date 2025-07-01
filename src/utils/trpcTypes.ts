import { AppRouter } from "@/app/trpc/routers/_app"
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server"

export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>
