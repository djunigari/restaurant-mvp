// hooks/useFingerprint.ts
"use client"
import FingerprintJS from "@fingerprintjs/fingerprintjs"
import { useEffect, useState } from "react"

export function useFingerprint() {
  const [fingerprint, setFingerprint] = useState<string>("")

  useEffect(() => {
    const load = async () => {
      const fp = await FingerprintJS.load()
      const result = await fp.get()
      setFingerprint(result.visitorId)
    }
    load()
  }, [])

  return fingerprint
}
