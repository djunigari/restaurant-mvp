import { trpc } from "@/app/trpc/client"
import { ProductSearchDialog } from "@/components/product/product-search-dialog"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

export function AddOrderItem({
  orderId,
  onAdded,
}: {
  orderId: number
  onAdded: () => void
}) {
  const [productId, setProductId] = useState("")
  const [amount, setAmount] = useState(1)

  const addItem = trpc.order.addOrderItem.useMutation({
    onSuccess: () => {
      onAdded()
      setProductId("")
      setAmount(1)
      toast.success("Item adicionado com sucesso!")
    },
    onError: (error) => {
      console.error("Erro ao adicionar item:", error)
      if (
        error.data?.code === "NOT_FOUND" &&
        error.message.includes("Product")
      ) {
        toast.error("Produto não encontrado")
      } else {
        toast.error(
          `Erro ao adicionar item: ${error.message || "Erro desconhecido"}`,
        )
      }
    },
  })

  return (
    <div className="mt-4 space-y-2">
      <div className="flex gap-2 items-center">
        <ProductSearchDialog onSelect={(id) => setProductId(String(id))} />
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
              orderId,
              productId: Number(productId),
              amount,
            })
          }
          disabled={!productId || amount < 1}
        >
          Adicionar
        </Button>
      </div>
    </div>
  )
}
