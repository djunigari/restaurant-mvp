import { prisma } from "@/utils/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { deviceId, fingerprint } = body

  console.log("PATCH /api/authorize-device", body)

  if (!deviceId || !fingerprint) {
    return NextResponse.json(
      { error: "deviceId e fingerprint são obrigatórios" },
      { status: 400 },
    )
  }

  const device = await prisma.device.update({
    where: { id: deviceId },
    data: {
      authorized: true,
      fingerprint,
    },
  })

  return NextResponse.json({
    message: `Device ${deviceId} autorizado`,
    device,
  })
}
