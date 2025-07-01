"use client"

import { trpc } from "@/app/trpc/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { toast } from "sonner"

export function RemoveOrderItemDialog({
  orderId,
  productId,
  onUpdated,
  className,
}: {
  orderId: number
  productId: number
  onUpdated: () => void
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState(1)

  const removeItem = trpc.order.removeOrderItem.useMutation({
    onSuccess: (result) => {
      if (result.removed) {
        toast.success("Item removido do pedido!")
      } else if ("newQuantity" in result) {
        toast.success(`Quantidade atualizada para ${result.newQuantity}`)
      } else {
        toast.success("Quantidade atualizada.")
      }
      onUpdated()
    },
    onError: (err) => {
      toast.error(`Erro: ${err.message}`)
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className={className}>
          Remover
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover produto</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <Input
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="Quantidade"
          />
          <div className="flex items-center space-x-2">
            <Button
              onClick={() =>
                removeItem.mutate({
                  orderId,
                  productId,
                  amount,
                })
              }
              disabled={amount < 1}
            >
              Confirmar
            </Button>

            <Button
              variant="secondary"
              onClick={() => setOpen(false)}
              className="ml-auto"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
