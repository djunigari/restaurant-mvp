import FingerprintJS from "@fingerprintjs/fingerprintjs"
import { v4 as uuidv4 } from "uuid"

export async function getOrCreateDeviceId(): Promise<string> {
  let id = localStorage.getItem("deviceId")
  if (!id) {
    id = uuidv4()
    localStorage.setItem("deviceId", id)
  }
  return id
}

export async function getFingerprint(): Promise<string> {
  const fp = await FingerprintJS.load()
  const result = await fp.get()
  return result.visitorId
}
