"use client"

import { trpc } from "@/app/trpc/client"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function ComandaActions({
  orderId,
  onUpdated,
}: {
  orderId: number
  onUpdated: () => void
}) {
  const paidOrder = trpc.order.paid.useMutation({
    onSuccess: () => {
      toast.success("Pedido marcado como pago!")
      onUpdated()
    },
    onError: (err) => {
      toast.error(`Erro: ${err.message}`)
    },
  })

  const cancelOrder = trpc.order.cancel.useMutation({
    onSuccess: () => {
      toast.success("Pedido cancelado!")
      onUpdated()
    },
    onError: (err) => {
      toast.error(`Erro: ${err.message}`)
    },
  })

  return (
    <div className="flex gap-2 mt-4">
      <Button
        onClick={() => paidOrder.mutate(orderId)}
        disabled={paidOrder.isPending}
      >
        {paidOrder.isPending ? "Processando..." : "Marcar como Pago"}
      </Button>
      <Button
        variant="destructive"
        onClick={() => cancelOrder.mutate(orderId)}
        disabled={cancelOrder.isPending}
      >
        {cancelOrder.isPending ? "Cancelando..." : "Cancelar Pedido"}
      </Button>
    </div>
  )
}
