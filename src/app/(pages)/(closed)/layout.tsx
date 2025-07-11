"use client"

import ExternalHeader from "@/components/template/external-header.component"
import { AuthProvider } from "@/lib/auth/contexts/auth.context"

export default function Layout(props: any) {
  return (
    <div className="w-full flex flex-col">
      <ExternalHeader />

      <AuthProvider>{props.children}</AuthProvider>
    </div>
  )
}
