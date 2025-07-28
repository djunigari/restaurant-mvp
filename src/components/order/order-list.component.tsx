"use client"

import { Order } from "@/generated/prisma"
import { CheckCircle, Clock, XCircle } from "lucide-react"
import Link from "next/link"
import { Badge } from "../ui/badge"

interface OrderListProps {
  orders: Order[]
  showLinks?: boolean
}

export function OrderList({ orders, showLinks = true }: OrderListProps) {
  return (
    <ul className="space-y-2">
      {orders.map((order) => (
        <li
          key={order.id}
          className="border p-3 rounded flex items-center gap-3"
        >
          {order.paidAt ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : order.canceledAt ? (
            <XCircle className="h-5 w-5 text-red-600" />
          ) : (
            <Clock className="h-5 w-5 text-yellow-500" />
          )}

          <div>
            <div className="flex gap-2 font-semibold">
              <Badge>{order.comandaId}</Badge>
              {showLinks ? (
                <Link href={`/orders/${order.id}`}>Pedido #{order.id}</Link>
              ) : (
                <>Pedido #{order.id}</>
              )}
            </div>
            <p className="text-sm text-gray-600">
              Criado: {new Date(order.createdAt).toLocaleString()} -{" "}
              {order.canceledAt
                ? "Cancelado"
                : order.paidAt
                ? "Pago"
                : "Pendente"}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}
