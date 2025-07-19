"use client"

import { trpc } from "@/app/trpc/client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { toast } from "sonner"

interface ResetPasswordDialogProps {
  userId: string
  userEmail?: string
}

export function ResetPasswordDialog({
  userId,
  userEmail,
}: ResetPasswordDialogProps) {
  const [newPassword, setNewPassword] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const mutation = trpc.auth.changePasswordFromAdmin.useMutation()

  const handleConfirm = async () => {
    try {
      mutation.mutate({ userId, newPassword })
      toast.success("Senha redefinida com sucesso")
      setNewPassword("")
      setIsOpen(false)
      setConfirmOpen(false)
    } catch (err: any) {
      console.error("Erro ao redefinir senha:", err)
      toast.error("Erro ao resetar senha")
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Resetar Senha
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resetar senha de {userEmail ?? "usuário"}</DialogTitle>
            <DialogDescription>
              Digite a nova senha que será atribuída a este usuário. Ela
              substituirá a senha atual.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Nova senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <DialogFooter className="mt-4">
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <AlertDialogTrigger asChild>
                <Button disabled={mutation.isPending}>
                  {mutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar alteração</AlertDialogTitle>
                  <AlertDialogDescription>
                    Essa ação irá sobrescrever a senha atual do usuário. Deseja
                    continuar?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <p>Tem certeza que deseja alterar a senha deste usuário?</p>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirm}>
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
