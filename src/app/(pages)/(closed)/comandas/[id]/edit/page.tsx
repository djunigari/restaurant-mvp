"use client"

import { trpc } from "@/app/trpc/client"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

export default function ComandaEditPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const { data, isLoading } = trpc.comanda.getById.useQuery(Number(id))
  const update = trpc.comanda.updateStatus.useMutation({
    onSuccess: () => router.push("/comandas"),
  })

  const [status, setStatus] = useState<"OPEN" | "OCCUPIED">(
    data?.status ?? "OPEN",
  )

  if (isLoading) return <p>Carregando...</p>
  if (!data) return <p>Comanda não encontrada</p>

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">
        Editar Comanda #{data.id} (Status atual: {data.status})
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (status === data.status) {
            // Nenhuma alteração
            return
          }
          update.mutate({ id: data.id, status })
        }}
      >
        <label className="block mb-4">
          Status:
          <select
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as "OPEN" | "OCCUPIED")}
            className="block border p-2 mt-1 rounded"
          >
            <option value="OPEN">OPEN</option>
            <option value="OCCUPIED">OCCUPIED</option>
          </select>
        </label>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={update.isPending || status === data.status}
        >
          {update.isPending ? "Atualizando..." : "Atualizar"}
        </button>
      </form>
    </div>
  )
}
