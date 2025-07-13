"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutDashboard, LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { Avatar } from "../ui/avatar"

export default function UserMenu() {
  // const { session, loading } = useAuth()
  const router = useRouter()

  function goTo(route: string, newTab = false) {
    return () => {
      if (newTab) {
        window.open(route, "_blank")
      } else {
        router.push(route)
      }
    }
  }

  function logout() {
    console.log("Logout")
    // aqui você chama seu logout mutation + redirect
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar>
          <User className="h-4 w-4" />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>User Menu</DropdownMenuLabel>
          <DropdownMenuItem onSelect={goTo("/dashboard")}>
            <LayoutDashboard size={18} className="mr-2" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={goTo("/my-account")}>
            <User size={18} className="mr-2" />
            <span>Minha Conta</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-500" onSelect={logout}>
          <LogOut size={18} className="mr-2" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
