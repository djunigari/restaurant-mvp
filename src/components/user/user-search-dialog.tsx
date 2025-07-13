"use client"

import { trpc } from "@/app/trpc/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function UserSearchDialog({
  onSelect,
}: {
  onSelect: (userId: string) => void
}) {
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const { data, refetch, isFetching } = trpc.auth.getAll.useQuery({
    pageIndex: 0,
    filter: search,
    typeFilter: "Name",
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Pesquisar Usuário</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pesquisar Usuário</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Input
            placeholder="Digite o nome do usuário"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? "Buscando..." : "Buscar"}
          </Button>
          <div className="max-h-60 overflow-y-auto border p-2 rounded mt-2">
            {data?.data?.length ? (
              <ul className="space-y-2">
                {data.data.map((user) => (
                  <li key={user.id}>
                    <Button
                      variant="ghost"
                      className="justify-start w-full"
                      onClick={() => {
                        onSelect(user.id)
                        setOpen(false)
                      }}
                    >
                      #{user.id} - {user.name}
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum usuário encontrado
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
