import { ProductSearchDialog } from "@/components/product/product-search-dialog"
import { useAddOrderItemMutation } from "@/hooks/useComanda"
import { Order } from "@/types/order"
import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

export function AddOrderItem({ order }: { order: Order }) {
  const [productId, setProductId] = useState("")
  const [amount, setAmount] = useState(1)

  const addItem = useAddOrderItemMutation({
    onAdded: () => {
      setProductId("")
      setAmount(1)
    },
    comandaId: order.comandaId,
  })

  return (
    <div className="mt-4 space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <ProductSearchDialog onSelect={(id) => setProductId(String(id))} />
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="ID do produto"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-40"
          />
          <Input
            type="number"
            placeholder="Qtd"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-24"
          />
          <Button
            onClick={() =>
              addItem.mutate({
                orderId: order.id,
                productId: Number(productId),
                amount,
              })
            }
            disabled={!productId || amount < 1}
          >
            <span className="hidden sm:inline">Adicionar item</span>
            <span className="sm:hidden">+</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
