"use client"

import LogoutButton from "@/lib/auth/components/logout-button.component"
import { useAuth } from "@/lib/auth/contexts/auth.context"
import Menu from "../shared/menu.component"
import Logo from "./logo.component"
import MaxWidthWrapper from "./MaxWidthWrapper"

export default function ExternalHeader() {
  const { session } = useAuth()

  return (
    <header className="w-full flex items-center h-16 bg-black/20 px-2">
      <MaxWidthWrapper className="flex-1 flex items-center">
        <Logo href="/" className="hidden md:flex mr-10" />

        {/* Desktop Menu */}
        <div className="hidden md:flex">
          <Menu />
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Menu mobile />
        </div>

        {session?.userId ? <LogoutButton classname="ml-auto" /> : null}
      </MaxWidthWrapper>
    </header>
  )
}
