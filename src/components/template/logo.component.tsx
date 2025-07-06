import { cn } from "@/lib/utils"
import Link from "../shared/link.component"

export interface LogoProps {
  href?: string
  className?: string
}

export default function Logo(props: LogoProps) {
  const content = (
    <h1
      className={cn(
        "bg-gradient-to-r from-zinc-500 to-black",
        "bg-clip-text text-transparent text-xl font-bold",
        "self-end",
        props.className,
      )}
    >
      ReComanda
    </h1>
  )

  return props.href ? (
    <Link href={props.href} noStyle>
      {content}
    </Link>
  ) : (
    content
  )
}
