"use client"

import { trpc } from "@/app/trpc/client"
import { getFingerprint } from "@/lib/device"
import { toast } from "sonner"

export default function RegisterDevicePage() {
  const registerMutation = trpc.device.register.useMutation({
    onSuccess: (data) => {
      saveDeviceInfo(data.deviceId, data.fingerprint)
      toast.success(`Dispositivo registrado com ID: ${data.deviceId}`)
    },
    onError: (error) => {
      toast.error(`Erro ao registrar dispositivo: ${error.message}`)
      console.error("Erro ao registrar dispositivo:", error)
    },
  })

  function saveDeviceInfo(deviceId: string, fingerprint: string) {
    localStorage.setItem("x-device-id", deviceId)
    localStorage.setItem("x-device-fingerprint", fingerprint)
    // Isso impede envio de cookies em cross-site requests.
    const isSecure = window.location.protocol === "https:"
    document.cookie = `x-device-id=${deviceId}; path=/; SameSite=Strict;${
      isSecure ? " Secure;" : ""
    }`
    document.cookie = `x-device-fingerprint=${fingerprint}; path=/; SameSite=Strict;${
      isSecure ? " Secure;" : ""
    }`
  }

  const handleRegister = async () => {
    const name = prompt("Digite o nome do dispositivo") ?? "Dispositivo"
    const fingerprint = await getFingerprint()

    registerMutation.mutate({
      name,
      fingerprint,
    })
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Registrar Dispositivo</h1>
      <button
        onClick={handleRegister}
        disabled={registerMutation.isPending}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {registerMutation.isPending ? "Registrando..." : "Registrar"}
      </button>
    </div>
  )
}
