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

export function ProductSearchDialog({
  onSelect,
}: {
  onSelect: (productId: number) => void
}) {
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const { data, refetch, isFetching } = trpc.product.getAll.useQuery({
    pageIndex: 0,
    filter: search,
    typeFilter: "Name",
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Pesquisar Produto</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pesquisar Produto</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Input
            placeholder="Digite o nome do produto"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? "Buscando..." : "Buscar"}
          </Button>
          <div className="max-h-60 overflow-y-auto border p-2 rounded mt-2">
            {data?.data?.length ? (
              <ul className="space-y-2">
                {data.data.map((prod) => (
                  <li key={prod.id}>
                    <Button
                      variant="ghost"
                      className="justify-start w-full"
                      onClick={() => {
                        onSelect(prod.id)
                        setOpen(false)
                      }}
                    >
                      #{prod.id} - {prod.name}
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum produto encontrado
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
