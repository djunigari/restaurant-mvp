import { prisma } from "@/utils/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const deviceId = req.headers.get("x-device-id")
  const fingerprint = req.headers.get("x-device-fingerprint")
  const userAgent = req.headers.get("user-agent") || ""
  const ip = req.headers.get("x-forwarded-for") || "0.0.0.0"

  if (!deviceId || !fingerprint) {
    return NextResponse.json({ authorized: false }, { status: 401 })
  }

  const device = await prisma.device.findUnique({
    where: { id: deviceId },
  })

  if (
    !device ||
    !device.authorized ||
    device.fingerprint !== fingerprint ||
    device.userAgent !== userAgent ||
    device.lastKnownIp !== ip
  ) {
    return NextResponse.json({ authorized: false }, { status: 401 })
  }

  return NextResponse.json({ authorized: true })
}
