"use client"

import { trpc } from "@/app/trpc/client"
import { Button } from "@/components/ui/button"

export default function LogoutButton() {
  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => {
      alert("Deslogado!")
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
