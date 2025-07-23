"use client"

import { trpc } from "@/app/trpc/client"
import MaxWidthWrapper from "@/components/template/MaxWidthWrapper"
import Link from "next/link"
import { useParams } from "next/navigation"

const fmt = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
})

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>()
  const id = Number(params.id)

  const { data: order, isLoading } = trpc.order.getById.useQuery(id)

  if (isLoading) return <p>Carregando pedido...</p>
  if (!order) return <p>Pedido não encontrado.</p>

  return (
    <MaxWidthWrapper>
      <Link href="/orders" className="text-sm underline">
        ← Voltar para pedidos
      </Link>
      <h1 className="text-2xl font-bold mb-4">Pedido #{order.id}</h1>

      <p className="mb-2">
        Status:{" "}
        {order.canceledAt ? "Cancelado" : order.paidAt ? "Pago" : "Pendente"}
      </p>
      <p className="mb-4">
        Criado: {new Date(order.createdAt).toLocaleString()}
      </p>

      <ul className="space-y-2">
        {order.items.map((item) => (
          <li
            key={item.id}
            className="border p-3 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{item.product.name}</p>
              <p className="text-sm text-gray-500">
                {item.quantity} x {fmt.format(item.product.price)}
              </p>
            </div>
            <span className="font-semibold">
              {fmt.format(item.quantity * item.product.price)}
            </span>
          </li>
        ))}
      </ul>
    </MaxWidthWrapper>
  )
}
