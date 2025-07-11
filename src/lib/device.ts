import FingerprintJS from "@fingerprintjs/fingerprintjs"
import { v4 as uuidv4 } from "uuid"

export async function getOrCreateDeviceId() {
  let id = localStorage.getItem("deviceId")
  if (!id) {
    id = uuidv4()
    localStorage.setItem("deviceId", id)
  }
  return id
}

// export async function getFingerprint(): Promise<string> {
//   const fp = await FingerprintJS.load()
//   const result = await fp.get()
//   return result.visitorId
// }

export async function getFingerprint() {
  const fp = await FingerprintJS.load()
  const result = await fp.get()
  const fingerprint = result.visitorId

  // salva também em cookie
  document.cookie = `fingerprint=${fingerprint}; path=/; SameSite=Lax`
  return fingerprint
}
