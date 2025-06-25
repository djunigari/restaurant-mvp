"use client"

import { trpc } from "@/app/trpc/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ComandaNewPage() {
  const router = useRouter()
  const [id, setId] = useState("")

  const create = trpc.comanda.create.useMutation({
    onSuccess: () => router.push("/comandas"),
  })

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Nova Comanda</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!id) return
          create.mutate(Number(id))
        }}
      >
        <label className="block mb-4">
          ID da Comanda:
          <input
            type="number"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="block border p-2 mt-1 rounded"
            required
          />
        </label>

        <button
          type="submit"
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={create.isPending || !id}
        >
          {create.isPending ? "Criando..." : "Criar Comanda"}
        </button>
      </form>
    </div>
  )
}
