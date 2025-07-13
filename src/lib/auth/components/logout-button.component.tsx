"use client"

import { trpc } from "@/app/trpc/client"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function LogoutButton() {
  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => {
      toast.success("Deslogado!")
    },
  })

  return (
    <Button
      onClick={() => logout.mutate()}
      disabled={logout.isPending}
      variant="outline"
    >
      {logout.isPending ? "Saindo..." : "Logout"}
    </Button>
  )
}
