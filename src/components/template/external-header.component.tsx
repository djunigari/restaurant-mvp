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
      <MaxWidthWrapper className="flex-1 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex items-center">
          <div className="flex gap-2 items-end">
            {/* <Link href={"/"} noStyle>
              <Image src="/logo-menu.png" alt="Logo" width={60} height={60} />
            </Link> */}
            <Logo href="/" className="hidden md:flex mr-10" />
          </div>
          <Menu classname="self-end" />
        </div>

        {session?.userId ? <LogoutButton /> : null}
      </MaxWidthWrapper>
    </header>
  )
}
