import { User } from "@/generated/prisma"
import { SessionPayload } from "@/lib/auth/definitions"
import { prisma } from "@/utils/prisma"
import crypto from "crypto"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import "server-only"

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    })
    return payload
  } catch (error: any) {
    console.log("Failed to verify session")
    console.log("Error:", error)
  }
}

export async function createSession(user: User) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  // cria token único para session
  const sessionToken = crypto.randomBytes(32).toString("hex")

  // salva no banco
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      expires: expiresAt,
      sessionToken,
    },
  })

  // cria payload criptografado
  const encryptedSession = await encrypt({
    userId: user.id,
    role: user.role,
    sessionId: session.id,
    sessionToken,
    expiresAt,
  })

  const cookieStore = await cookies()
  cookieStore.set("session", encryptedSession, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  })
}

export async function updateSession() {
  const session = (await cookies()).get("session")?.value
  const payload = await decrypt(session)

  if (!session || !payload) {
    return null
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  const cookieStore = await cookies()
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}
