// middleware.ts
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { decrypt } from "./lib/auth/session"

// 1. Specify protected and public routes
// const protectedRoutes = ["/", "/dashboard", "/orders/*"]
const protectedRoutes = ["/*"]
const publicRoutes = ["/login", "/signup"]
const needCheckDevice = process.env.NEXT_PUBLIC_CHECK_DEVICE

function matchRoute(path: string, route: string) {
  if (route.endsWith("/*")) {
    const base = route.slice(0, -2)
    return path === base || path.startsWith(`${base}/`)
  }
  return path === route
}

// 🔍 Função para determinar se é rota protegida
function isProtectedRoute(path: string) {
  return protectedRoutes.some((route) => matchRoute(path, route))
}

// 🔍 Função para determinar se é rota pública
function isPublicRoute(path: string) {
  return publicRoutes.some((route) => matchRoute(path, route))
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
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/check-device`, {
      headers: {
        "x-device-id": deviceId,
        "x-device-fingerprint": fingerprint,
        "user-agent": userAgent,
        "x-forwarded-for": ip,
      },
    })

    if (!res.ok) {
      console.error("Dispositivo não autorizado")
      return { ok: false, reason: "Dispositivo não autorizado" }
    }

    return { ok: true }
  } catch (error) {
    console.error("Erro ao verificar dispositivo", error)
    return { ok: false, reason: "Erro ao verificar dispositivo" }
  }
}

// 🔍 Função para carregar session
async function loadSessionFromCookie() {
  const cookie = (await cookies()).get("session")?.value
  return await decrypt(cookie)
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  if (needCheckDevice) {
    const deviceCheck = await checkDevice(req)
    if (!deviceCheck.ok) {
      return NextResponse.json({ error: deviceCheck.reason }, { status: 401 })
    }
  }

  const session = await loadSessionFromCookie()

  if (isPublicRoute(path)) {
    return NextResponse.next()
  }

  if (isProtectedRoute(path) && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|device|api/check-device|api/authorize-device|api/trpc).*)",
  ],
}
