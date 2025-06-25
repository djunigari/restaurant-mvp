"use client"

import { trpc } from "@/app/trpc/client"
import { useParams } from "next/navigation"

export default function ComandaDetailPage() {
  const { id } = useParams() as { id: string }
  const { data } = trpc.comanda.getById.useQuery(Number(id))

  if (!data) return <p>Comanda não encontrada</p>

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Comanda #{data.id}</h1>
      <p>Status: {data.status}</p>

      <h2 className="mt-4 font-semibold">Pedidos (Orders):</h2>

      {data.orders.length === 0 ? (
        <p>Não há pedidos nesta comanda.</p>
      ) : (
        <ul className="list-disc pl-4">
          {data.orders.map((order) => (
            <li key={order.id}>
              Pedido #{order.id} - Criado em{" "}
              {new Date(order.createdAt).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
