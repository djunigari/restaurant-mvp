"use client"

import { Button } from "@/components/ui/button"
import { Product } from "@/types/product"
import { ProductListItemComponent } from "./product-list-item.component"

interface ProductListComponentProps {
  data: Product[]
  totalPages: number
  pageIndex: number
  onPageChange: (page: number) => void
}

export function ProductListComponent({
  data,
  totalPages,
  pageIndex,
  onPageChange,
}: ProductListComponentProps) {
  if (data.length === 0) {
    return <p>Nenhum produto encontrado.</p>
  }

  return (
    <div className="space-y-4">
      {data.map((product) => (
        <ProductListItemComponent key={product.id} product={product} />
      ))}

      <div className="flex justify-center items-center gap-2 mt-4">
        <Button
          variant="outline"
          disabled={pageIndex === 0}
          onClick={() => onPageChange(pageIndex - 1)}
        >
          Anterior
        </Button>

        <span>
          {pageIndex + 1} / {totalPages}
        </span>

        <Button
          variant="outline"
          disabled={pageIndex + 1 >= totalPages}
          onClick={() => onPageChange(pageIndex + 1)}
        >
          Próximo
        </Button>
      </div>
    </div>
  )
}
