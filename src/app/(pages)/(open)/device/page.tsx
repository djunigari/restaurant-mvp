"use client"

import { trpc } from "@/app/trpc/client"
import { getFingerprint } from "@/lib/device"
import { toast } from "sonner"

export default function RegisterDevicePage() {
  const registerMutation = trpc.device.register.useMutation({
    onSuccess: (data) => {
      toast.success(`Dispositivo registrado com ID: ${data.deviceId}`)
    },
    onError: (error) => {
      toast.error(`Erro ao registrar dispositivo: ${error.message}`)
      console.error("Erro ao registrar dispositivo:", error)
    },
  })

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
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Registrar
      </button>
    </div>
  )
}
