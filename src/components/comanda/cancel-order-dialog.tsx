"use client"

import { trpc } from "@/app/trpc/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"

export function CancelOrderDialog({
  orderId,
  onUpdated,
}: {
  orderId: number
  onUpdated: () => void
}) {
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Cancelar Pedido</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancelar Pedido</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja cancelar este pedido? Esta ação não pode ser
            desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Fechar</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => cancelOrder.mutate(orderId)}
            disabled={cancelOrder.isPending}
          >
            {cancelOrder.isPending ? "Cancelando..." : "Confirmar Cancelamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
