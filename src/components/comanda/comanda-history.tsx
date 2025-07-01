"use client"

import { Order } from "@/types/order"

export function ComandaHistory({ orders }: { orders: Order[] }) {
  return (
    <ul className="list-disc pl-6">
      {orders.map((order) => (
        <li key={order.id}>
          Pedido #{order.id} - Criado:{" "}
          {new Date(order.createdAt).toLocaleString()} - Pago:{" "}
          {order.paidAt ? "Sim" : "Não"} - Cancelado:{" "}
          {order.canceledAt ? "Sim" : "Não"}
        </li>
      ))}
    </ul>
  )
}
