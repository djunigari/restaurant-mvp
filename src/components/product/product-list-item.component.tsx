"use client"

import { trpc } from "@/app/trpc/client"
import { Product } from "@/generated/prisma"
import { toast } from "sonner"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { ProductEditDialog } from "./product-edit-dialog"

interface ProductListItemComponentProps {
  product: Product
  onDeleted?: () => void // Callback para atualizar a lista após deletar
}

const fmt = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
})

export function ProductListItemComponent({
  product,
  onDeleted,
}: ProductListItemComponentProps) {
  const utils = trpc.useUtils()

  const deleteProduct = trpc.product.delete.useMutation({
    onSuccess: () => {
      toast.success("Produto deletado com sucesso!")
      utils.product.getAll.invalidate()
      onDeleted?.()
    },
  })

  function handleDelete() {
    if (confirm("Tem certeza que deseja deletar este produto?")) {
      deleteProduct.mutate(product.id)
    }
  }

  return (
    <div className={`flex flex-col sm:flex-row border p-4 rounded shadow-sm`}>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant={"default"}>{product.id}</Badge>
          <span className="font-semibold">{product.name}</span>
        </div>
        <p className="text-sm text-gray-500">{product.description}</p>
        <p className="font-semibold mt-2">{fmt.format(product.price)}</p>
      </div>

      <div className="flex gap-2 ml-auto">
        <ProductEditDialog product={product} />
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={deleteProduct.isPending}
        >
          {deleteProduct.isPending ? "Removendo..." : "Excluir"}
        </Button>
      </div>
    </div>
  )
}
