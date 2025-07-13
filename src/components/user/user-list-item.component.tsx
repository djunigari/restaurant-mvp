"use client"

import { trpc } from "@/app/trpc/client"
import { User } from "@/generated/prisma"
import { toast } from "sonner"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { UserEditDialog } from "./user-edit-dialog"

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
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant={"default"}>{user.id}</Badge>
          <span className="font-semibold">{user.name}</span>
        </div>
      </div>

      <div className="flex gap-2 ml-auto">
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
