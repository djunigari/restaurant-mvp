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
import { User } from "@/generated/prisma"
import { useState } from "react"
import { UserFormComponent } from "./user-form.component"

interface ProductEditDialogProps {
  user: User
}

export function UserEditDialog({ user }: ProductEditDialogProps) {
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

        <UserFormComponent
          userId={user.id}
          defaultValues={{
            name: user.name || "",
            email: user.email || "",
          }}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
