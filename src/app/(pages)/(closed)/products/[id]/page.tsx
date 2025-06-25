"use client"

import { trpc } from "@/app/trpc/client"
import { useParams, useRouter } from "next/navigation"

export default function ProductDetailPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()

  const { data, isLoading } = trpc.product.getById.useQuery(Number(id))

  if (isLoading) return <p>Carregando...</p>
  if (!data) return <p>Produto não encontrado</p>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">{data.name}</h1>
      <p className="text-gray-600 mb-2">Preço: R$ {data.price.toFixed(2)}</p>
      <p className="mb-4">{data.description}</p>

      <div className="flex gap-2">
        <button
          onClick={() => router.push(`/products/${id}/edit`)}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Editar
        </button>
        <button
          onClick={() => router.push("/products")}
          className="bg-gray-300 px-4 py-1 rounded"
        >
          Voltar
        </button>
      </div>
    </div>
  )
}
