"use client"
// ^-- to make sure we can mount the Provider from a server component
import { getFingerprint, getOrCreateDeviceId } from "@/lib/device"
import type { QueryClient } from "@tanstack/react-query"
import { QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import { createTRPCReact } from "@trpc/react-query"
import { useState } from "react"
import superjson from "superjson"
import { makeQueryClient } from "./query-client"
import type { AppRouter } from "./routers/_app.ts"

export const trpc = createTRPCReact<AppRouter>()

let clientQueryClientSingleton: QueryClient

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient()
  }
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= makeQueryClient())
}

function getUrl() {
  const base = (() => {
    if (typeof window !== "undefined") return ""
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
    return "http://localhost:3000"
  })()
  return `${base}/api/trpc`
}

export function TRPCProvider(
  props: Readonly<{
    children: React.ReactNode
  }>,
) {
  const queryClient = getQueryClient()
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: getUrl(),
          async headers() {
            // aqui vai garantir deviceId e fingerprint
            const deviceId = await getOrCreateDeviceId()
            const fingerprint = await getFingerprint()

            return {
              "x-device-id": deviceId,
              "x-device-fingerprint": fingerprint,
            }
          },
          transformer: superjson,
        }),
      ],
    }),
  )
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </trpc.Provider>
  )
}
