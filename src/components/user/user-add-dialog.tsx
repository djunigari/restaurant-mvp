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
import { UserFormComponent } from "./user-form.component"

interface UserAddDialogProps {
  className?: string
}
export function UserAddDialog(props: UserAddDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={props.className}>Adicionar</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar usuário</DialogTitle>
        </DialogHeader>

        <UserFormComponent onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
