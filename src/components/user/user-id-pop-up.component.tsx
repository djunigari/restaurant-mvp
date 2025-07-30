import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { User } from "@/types/user"
import { Check, Clipboard } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

type Props = {
  user: User
}

export function UserIdWithCopy({ user }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(user.id)
    setCopied(true)
    toast.success("ID copiado!")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2 mb-2">
      <Popover>
        <PopoverTrigger asChild>
          <Badge variant="default" className="cursor-pointer">
            {user.id.slice(0, 6)}...
          </Badge>
        </PopoverTrigger>
        <PopoverContent
          className={`
            flex items-center justify-between gap-2
            max-w-sm w-full sm:w-[300px]
            sm:max-w-xs px-4 py-2
          `}
          align="start"
          sideOffset={8}
        >
          <span className="truncate text-sm">{user.id}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopy}
            className="shrink-0"
          >
            {copied ? <Check size={16} /> : <Clipboard size={16} />}
          </Button>
        </PopoverContent>
      </Popover>
      <span className="font-semibold">{user.name}</span>
    </div>
  )
}
