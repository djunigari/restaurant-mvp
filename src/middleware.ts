// middleware.ts
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { decrypt } from "./lib/auth/session"

// 1. Specify protected and public routes
const protectedRoutes = ["/", "/dashboard"]
const publicRoutes = ["/login", "/signup"]

// 🔍 Função para determinar se é rota protegida
function isProtectedRoute(path: string) {
  return protectedRoutes.includes(path)
}

// 🔍 Função para determinar se é rota pública
function isPublicRoute(path: string) {
  return publicRoutes.includes(path)
}

// 🔍 Função para checar device via API
async function checkDevice(req: NextRequest) {
  const deviceId = req.cookies.get("x-device-id")?.value
  const fingerprint = req.cookies.get("x-device-fingerprint")?.value
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "0.0.0.0"
  const userAgent = req.headers.get("user-agent") || ""

  if (!deviceId || !fingerprint) {
    console.error("Dispositivo não identificado", { deviceId, fingerprint })
    return { ok: false, reason: "Dispositivo não identificado" }
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/check-device`,
    {
      headers: {
        "x-device-id": deviceId,
        "x-device-fingerprint": fingerprint,
        "user-agent": userAgent,
        "x-forwarded-for": ip,
      },
    },
  )

  if (!res.ok) {
    console.error("Dispositivo não autorizado")
    return { ok: false, reason: "Dispositivo não autorizado" }
  }

  return { ok: true }
}

// 🔍 Função para carregar session
async function loadSessionFromCookie() {
  const cookie = (await cookies()).get("session")?.value
  return await decrypt(cookie)
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  const deviceCheck = await checkDevice(req)
  if (!deviceCheck.ok) {
    return NextResponse.json({ error: deviceCheck.reason }, { status: 401 })
  }

  const session = await loadSessionFromCookie()

  if (isProtectedRoute(path) && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  if (
    isPublicRoute(path) &&
    session?.userId &&
    !path.startsWith("/dashboard")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|device|api/check-device|api/authorize-device|api/trpc).*)",
  ],
}
