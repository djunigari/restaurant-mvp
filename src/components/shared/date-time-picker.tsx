"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronDownIcon } from "lucide-react"
import * as React from "react"

export function DateTimePicker({
  label,
  value,
  onChange,
}: {
  label?: string
  value: { date?: Date; time?: string }
  onChange: (val: { date?: Date; time?: string }) => void
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        {label && (
          <Label htmlFor="date-picker" className="px-1">
            {label}
          </Label>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-32 justify-between font-normal"
            >
              {value.date ? value.date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="flex flex-col gap-2 p-1 w-auto overflow-hidden"
            align="start"
          >
            <Label htmlFor="time-picker" className="px-1">
              Hora
            </Label>
            <Input
              type="time"
              id="time-picker"
              step="1"
              value={value.time || "00:00:00"}
              onChange={(e) => onChange({ ...value, time: e.target.value })}
              className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />

            <Calendar
              mode="single"
              selected={value.date}
              captionLayout="dropdown"
              onSelect={(date) => {
                onChange({ ...value, date })
                setOpen(false)
              }}
            />
            <Button
              variant="outline"
              onClick={() => onChange({ date: undefined, time: "" })}
            >
              Resetar
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
