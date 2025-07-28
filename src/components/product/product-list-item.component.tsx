"use client"

import { trpc } from "@/app/trpc/client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Product } from "@/types/product"
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
    deleteProduct.mutate(product.id)
  }

  return (
    <div className={`flex flex-col sm:flex-row border p-4 rounded shadow-sm`}>
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant={"default"}>{product.id}</Badge>
          <span className="font-semibold">{product.name}</span>
        </div>
        <p className="font-semibold mt-2">{fmt.format(product.price)}</p>
        {product.barcode && <span>{product.barcode}</span>}
        {product.description && (
          <p className="text-sm text-gray-500">{product.description}</p>
        )}
      </div>

      <div className="flex gap-2 ml-auto">
        <ProductEditDialog product={product} />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              disabled={deleteProduct.isPending}
            >
              {deleteProduct.isPending ? "Removendo..." : "Excluir"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o produto{" "}
                <strong>{product.name}</strong>? Essa ação não poderá ser
                desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDelete()}
                disabled={deleteProduct.isPending}
              >
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
