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
import { useState } from "react"
import { ProductFormComponent } from "./product-form.component"

interface ProductAddDialogProps {
  className?: string
}
export function ProductAddDialog(props: ProductAddDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={props.className}>Adicionar</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar produto</DialogTitle>
        </DialogHeader>

        <ProductFormComponent onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
