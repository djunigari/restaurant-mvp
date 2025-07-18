"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth/contexts/auth.context"
import { cn } from "@/lib/utils"
import { Separator } from "@radix-ui/react-select"
import { Menu as MenuIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export interface MenuProps {
  classname?: string
  mobile?: boolean
}

export default function Menu({ classname, mobile }: MenuProps) {
  const pathname = usePathname()
  const { session } = useAuth()
  const isAdmin = session?.role === "ADMIN"

  const links = [
    { href: "/comandas", label: "Comandas" },
    { href: "/orders", label: "Pedidos" },
    { href: "/products", label: "Produtos" },
    ...(isAdmin ? [{ href: "/users", label: "Usuários" }] : []),
  ]

  if (mobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <MenuIcon className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          {/* Conteúdo da sidebar responsiva no drawer */}
          <div className="h-full w-full flex flex-col bg-white p-4">
            <div className="text-lg font-bold mb-4">Menu</div>
            <nav className="space-y-1">
              {links.map((link) => (
                <SidebarLink
                  key={link.href}
                  href={link.href}
                  active={pathname.startsWith(link.href)}
                >
                  {link.label}
                </SidebarLink>
              ))}
            </nav>
            <Separator className="my-4" />
            {/* Você pode colocar logout, configurações etc. aqui também */}
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <nav className={cn("flex gap-6 font-semibold", classname)}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "flex items-center gap-2 text-sm border-blue-600 hover:text-blue-900",
            pathname.startsWith(link.href)
              ? "border-b-4 text-blue-900"
              : "text-zinc-600",
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}

function SidebarLink({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={cn(
        "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
        active
          ? "bg-blue-100 text-blue-900"
          : "text-zinc-700 hover:bg-zinc-100",
      )}
    >
      {children}
    </Link>
  )
}
