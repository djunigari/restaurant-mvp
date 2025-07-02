"use client"

import { trpc } from "@/app/trpc/client"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, RotateCcw, XCircle } from "lucide-react"

export function ComandaHistory({ id }: { id: number }) {
  const { data, isLoading, refetch, isRefetching } =
    trpc.order.getAllByComandaId.useQuery(id)

  if (isLoading) return <span>Carregando histórico...</span>
  if (!data || data.length === 0) return <span>Sem pedidos anteriores.</span>

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-lg font-semibold">Histórico de Pedidos</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={() => refetch()}
          disabled={isRefetching}
        >
          <RotateCcw
            className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
          />
        </Button>
      </div>

      <ul className="list-none pl-0 space-y-2">
        {data.map((order) => (
          <li key={order.id} className="flex items-center gap-2">
            {order.paidAt ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : order.canceledAt ? (
              <XCircle className="h-5 w-5 text-red-600" />
            ) : (
              <Clock className="h-5 w-5 text-yellow-500" />
            )}
            <span>
              #{order.id} - {new Date(order.createdAt).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
