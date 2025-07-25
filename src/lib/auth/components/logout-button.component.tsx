"use client"

import { trpc } from "@/app/trpc/client"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { redirect } from "next/navigation"

import { toast } from "sonner"

export default function LogoutButton({ classname }: { classname?: string }) {
  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => {
      toast.success("Deslogado!")
      redirect("/login")
    },
  })

  return (
    <Button
      onClick={() => logout.mutate()}
      disabled={logout.isPending}
      variant="outline"
      className={classname}
    >
      <span className="sr-only">Logout</span>
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:inline">
        {logout.isPending ? "Saindo..." : "Logout"}
      </span>
    </Button>
  )
}
