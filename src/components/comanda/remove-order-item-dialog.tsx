"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useRemoveOrderItemMutation } from "@/hooks/useComanda"
import { Order } from "@/types/order"
import { useState } from "react"

export function RemoveOrderItemDialog({
  order,
  productId,
  className,
}: {
  order: Order
  productId: number
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState(1)

  const removeItem = useRemoveOrderItemMutation({
    comandaId: order.comandaId,
    onRemoved: () => setOpen(false),
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
                  orderId: order.id,
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
