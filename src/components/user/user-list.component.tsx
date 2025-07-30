"use client"

import { Button } from "@/components/ui/button"
import { User } from "@/types/user"
import { UserListItemComponent } from "./user-list-item.component"

interface UserListComponentProps {
  data: User[]
  totalPages: number
  pageIndex: number
  onPageChange: (page: number) => void
}

export function UserListComponent({
  data,
  totalPages,
  pageIndex,
  onPageChange,
}: UserListComponentProps) {
  if (data.length === 0) {
    return <p>Nenhum usuário encontrado.</p>
  }

  return (
    <div className="space-y-4">
      {data.map((user) => (
        <UserListItemComponent key={user.id} user={user} />
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
