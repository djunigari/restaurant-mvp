"use client"

import { useAuth } from "@/lib/auth/contexts/auth.context"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

export interface MenuProps {
  classname?: string
}

export default function Menu(props: MenuProps) {
  const caminho = usePathname()
  const { session } = useAuth()

  const isAdmin = session?.role === "ADMIN"

  return (
    <nav className={cn("flex gap-6 font-semibold", props.classname)}>
      <MenuItem href="/comandas" selecionado={caminho.startsWith("/comandas")}>
        Comandas
      </MenuItem>
      <MenuItem href="/orders" selecionado={caminho.startsWith("/orders")}>
        Pedidos
      </MenuItem>
      <MenuItem href="/products" selecionado={caminho.startsWith("/products")}>
        Produtos
      </MenuItem>
      {isAdmin && (
        <MenuItem href="/users" selecionado={caminho.startsWith("/users")}>
          Usuários
        </MenuItem>
      )}
    </nav>
  )
}

function MenuItem(props: {
  href: string
  children: React.ReactNode
  selecionado: boolean
  novaAba?: boolean
}) {
  return (
    <Link href={props.href} target={props.novaAba ? "_blank" : "_self"}>
      <span
        className={`flex items-center gap-2 text-sm border-blue-600 hover:text-blue-900
        ${props.selecionado ? "border-b-4 text-blue-900" : "text-zinc-600"}
      `}
      >
        {props.children}
      </span>
    </Link>
  )
}
