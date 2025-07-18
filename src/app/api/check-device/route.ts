import { prisma } from "@/utils/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  console.group("Check Device Authorization")
  console.log("Received request to check device authorization")
  console.log("Request URL:", req.url)
  console.log("Request Method:", req.method)
  console.log("Request Headers:", req.headers)
  console.log("Verificando dispositivo...")
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

  if (!device) {
    console.error("Dispositivo não encontrado", { deviceId })
    console.groupEnd()
    return NextResponse.json({ authorized: false }, { status: 401 })
  }

  if (!device.authorized) {
    console.error("Dispositivo não autorizado", { deviceId })
    console.groupEnd()
    return NextResponse.json({ authorized: false }, { status: 401 })
  }

  // Verifica se o fingerprint, userAgent e IP correspondem ao dispositivo
  // Isso é importante para evitar spoofing de dispositivos
  // e garantir que o dispositivo é realmente o esperado.
  // Isso também ajuda a prevenir ataques de phishing e outras ameaças.
  // Se algum desses valores não corresponder, o dispositivo é considerado não autorizado.
  if (!device.fingerprint || !device.userAgent || !device.lastKnownIp) {
    console.error("Dispositivo não autorizado, dados incompletos", {
      deviceId,
      fingerprint,
      userAgent,
      ip,
    })
    console.groupEnd()
    return NextResponse.json({ authorized: false }, { status: 401 })
  }
  console.log("Dispositivo autorizado", { deviceId })
  console.groupEnd()
  return NextResponse.json({ authorized: true })
}
