"use client"

import { trpc } from "@/app/trpc/client"
import { Product } from "@/generated/prisma"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { ProductEditDialog } from "./product-edit-dialog"

interface ProductListItemComponentProps {
  product: Product
  onDeleted?: () => void // Callback para atualizar a lista após deletar
}

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
    <div className="border p-4 rounded shadow-sm flex justify-between items-center">
      <div>
        <h3 className="font-bold text-lg">
          #{product.id} - {product.name}
        </h3>
        <p className="text-sm text-gray-500">{product.description}</p>
        <p className="font-semibold mt-2">R$ {product.price.toFixed(2)}</p>
      </div>

      <div className="flex gap-2">
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
