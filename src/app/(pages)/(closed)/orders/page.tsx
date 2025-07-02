"use client"

import { trpc } from "@/app/trpc/client"
import { OrderFilter } from "@/components/order/order-filter"
import { OrderList } from "@/components/order/order-list.component"

import { useState } from "react"

export default function OrdersPage() {
  const [filter, setFilter] = useState({})
  const { data: orders, isLoading } = trpc.order.getAll.useQuery(filter)

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Pedidos</h1>

      <OrderFilter onFilterChange={setFilter} />

      {isLoading && <p>Carregando pedidos...</p>}
      {!isLoading && orders && orders.length === 0 && (
        <p>Sem pedidos encontrados.</p>
      )}
      {orders && <OrderList orders={orders} />}
    </div>
  )
}
