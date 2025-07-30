"use client"

import { trpc } from "@/app/trpc/client"
import { User } from "@/types/user"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { ResetPasswordDialog } from "./reset-password-dialog"
import { UserEditDialog } from "./user-edit-dialog"
import { UserIdWithCopy } from "./user-id-pop-up.component"

interface UserListItemComponentProps {
  user: User
  onDeleted?: () => void // Callback para atualizar a lista após deletar
}

export function UserListItemComponent({
  user,
  onDeleted,
}: UserListItemComponentProps) {
  const utils = trpc.useUtils()

  const deleteUser = trpc.auth.delete.useMutation({
    onSuccess: () => {
      toast.success("Produto deletado com sucesso!")
      utils.auth.getAll.invalidate()
      onDeleted?.()
    },
  })

  function handleDelete() {
    if (confirm("Tem certeza que deseja deletar este produto?")) {
      deleteUser.mutate(user.id)
    }
  }

  return (
    <div className={`flex flex-col sm:flex-row border p-4 rounded shadow-sm`}>
      <UserIdWithCopy user={user} />

      <div className="flex gap-2 ml-auto">
        <ResetPasswordDialog
          userId={user.id}
          userEmail={user.email || user.id}
        />
        <UserEditDialog user={user} />
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={deleteUser.isPending}
        >
          {deleteUser.isPending ? "Removendo..." : "Excluir"}
        </Button>
      </div>
    </div>
  )
}
