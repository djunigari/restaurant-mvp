import "server-only"

import { decrypt } from "@/lib/auth/session"
import { prisma } from "@/utils/prisma"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { cache } from "react"
import { SessionPayload } from "./definitions"

export const verifySession = cache(async (): Promise<SessionPayload | null> => {
  try {
    const cookie = (await cookies()).get("session")?.value
    if (!cookie) redirect("/login")

    const session = (await decrypt(cookie)) as SessionPayload

    if (!session?.userId) {
      redirect("/login")
    }

    return session
  } catch (err) {
    console.error("Invalid session:", err)
    return null
  }
})

export const getUser = cache(async () => {
  const session = await verifySession()
  if (!session?.userId) return null

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    return user
  } catch (error: any) {
    console.error("Failed to fetch user", error)
    return null
  }
})
