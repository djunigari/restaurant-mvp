"use client"

import ExternalHeader from "@/components/template/external-header.component"
import { AuthProvider } from "@/lib/auth/contexts/auth.context"

export default function Layout(props: any) {
  return (
    <AuthProvider>
      <div className="w-full flex flex-col">
        <ExternalHeader />

        {props.children}
      </div>
    </AuthProvider>
  )
}
