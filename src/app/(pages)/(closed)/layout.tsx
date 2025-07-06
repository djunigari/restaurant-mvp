/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import ExternalHeader from "@/components/template/external-header.component"

export default function Layout(props: any) {
  return (
    <div className="w-full flex flex-col">
      <ExternalHeader />
      {props.children}
    </div>
  )
}
