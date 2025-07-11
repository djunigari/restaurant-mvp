"use client"

import { trpc } from "@/app/trpc/client" // seu hook trpc
import { SessionPayload } from "@/lib/auth/definitions"

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"

type AuthContextType = {
  session: SessionPayload | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionPayload | null>(null)
  const [loading, setLoading] = useState(true)

  const { data, isLoading, error } = trpc.auth.getSession.useQuery()

  useEffect(() => {
    if (isLoading) return
    if (error || !data) {
      setSession(null)
    } else {
      setSession({ ...data, expiresAt: new Date(data.expiresAt) })
    }
    setLoading(false)
  }, [isLoading, error, data])

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
