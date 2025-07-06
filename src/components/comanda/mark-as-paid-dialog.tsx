"use client"

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
import { usePaidOrderMutation } from "@/hooks/useComanda"

export function MarkAsPaidDialog({ orderId }: { orderId: number }) {
  const paidOrder = usePaidOrderMutation()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Marcar como Pago</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Marcar como Pago</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja marcar este pedido como pago?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Fechar</Button>
          </DialogClose>
          <Button
            onClick={() => paidOrder.mutate(orderId)}
            disabled={paidOrder.isPending}
          >
            {paidOrder.isPending ? "Processando..." : "Confirmar Pagamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
