import { cn } from "@/lib/utils"
import Link from "next/link"
import React from "react"

function Root(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <nav {...props} className={cn("flex flex-col", props.className)}>
      {props.children}
    </nav>
  )
}

interface MainMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ElementType
  href?: string
  children?: React.ReactNode
  selected?: boolean
}

function Item(props: MainMenuItemProps) {
  const { icon, href, children, ...others } = props

  function renderizarItem() {
    return (
      <div
        {...others}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-md",
          "hover:bg-white/10 select-none",
          "cursor-pointer hover:text-white text-zinc-400",
          props.selected && "bg-white/10",
          props.className,
        )}
      >
        {icon && props.icon && (
          <props.icon
            size={20}
            stroke={1.5}
            className={props.selected ? "text-zinc-200" : ""}
          />
        )}
        <span className={cn("font-light", props.selected && "text-zinc-200")}>
          {children}
        </span>
      </div>
    )
  }

  return href ? <Link href={href}>{renderizarItem()}</Link> : renderizarItem()
}

interface MainMenuGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  titleClassName?: string
}

function Group(props: MainMenuGroupProps) {
  const { title, titleClassName, ...others } = props
  return (
    <div {...others} className={cn("flex flex-col gap-2", props.className)}>
      {title && (
        <span
          className={cn(
            "text-sm text-zinc-600 font-semibold uppercase",
            titleClassName,
          )}
        >
          {title}
        </span>
      )}
      <div className={cn("flex flex-col gap-0.5", props.className)}>
        {props.children}
      </div>
    </div>
  )
}

export const MainMenu = { Root, Group, Item }
