// components/product/product-edit-dialog.tsx

"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Product } from "@/generated/prisma"
import { useState } from "react"
import { ProductFormComponent } from "./product-form.component"

interface ProductEditDialogProps {
  product: Product
}

export function ProductEditDialog({ product }: ProductEditDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Editar
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar produto</DialogTitle>
        </DialogHeader>

        <ProductFormComponent
          productId={product.id}
          defaultValues={{
            name: product.name,
            description: product.description ?? "",
            price: product.price,
          }}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
