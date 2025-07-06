// middleware.ts
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function middleware(req: NextRequest) {
  const deviceId = req.headers.get("x-device-id")
  const fingerprint = req.headers.get("x-device-fingerprint")

  if (!deviceId || !fingerprint) {
    return new NextResponse("Dispositivo não identificado", { status: 401 })
  }

  // chama sua API route
  const check = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/check-device`,
    {
      headers: {
        "x-device-id": deviceId,
        "x-device-fingerprint": fingerprint,
      },
    },
  )

  if (!check.ok) {
    return new NextResponse("Dispositivo não autorizado", { status: 401 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|device|api/check-device|api/trpc).*)",
  ],
}
