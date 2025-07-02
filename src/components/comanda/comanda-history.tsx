"use client"

import { trpc } from "@/app/trpc/client"

import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import { OrderList } from "../order/order-list.component"

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

      <OrderList orders={data} />
    </div>
  )
}
