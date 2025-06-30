"use client"

import { trpc } from "@/app/trpc/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { toast } from "sonner"

export function ComandaAddDialog() {
  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")

  const utils = trpc.useUtils()
  const createComanda = trpc.comanda.create.useMutation({
    onSuccess: () => {
      utils.comanda.getAll.invalidate()
      toast.success("Comanda criada com sucesso!")
      setId("")
      setOpen(false)
    },
    onError: () => {
      toast.error("Erro ao criar comanda")
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Nova comanda</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Criar nova comanda</DialogTitle>
        <div className="flex flex-col gap-4">
          <Input
            type="number"
            placeholder="ID da comanda"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <Button
            onClick={() => {
              if (!id) {
                toast.error("Informe um ID válido")
                return
              }
              createComanda.mutate(Number(id))
            }}
          >
            Criar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
