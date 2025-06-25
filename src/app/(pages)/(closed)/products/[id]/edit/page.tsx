"use client"

import { trpc } from "@/app/trpc/client"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function EditProductPage() {
  const router = useRouter()
  const { id } = useParams() as { id: string }

  const { data } = trpc.product.getById.useQuery(Number(id))
  const update = trpc.product.update.useMutation({
    onSuccess: () => router.push("/products"),
  })

  const [form, setForm] = useState({ name: "", description: "", price: 0 })

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name,
        description: data.description,
        price: data.price,
      })
    }
  }, [data])

  if (!data) return <p>Carregando...</p>

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Editar Produto</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          update.mutate({ id: Number(id), ...form })
        }}
      >
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="block border p-1 my-2"
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="block border p-1 my-2"
        />
        <input
          type="number"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: parseFloat(e.target.value) })
          }
          className="block border p-1 my-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-1">
          Salvar
        </button>
      </form>
    </div>
  )
}
