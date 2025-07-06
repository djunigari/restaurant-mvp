"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { buildISO } from "@/lib/data-time"
import { useState } from "react"
import { DateTimePicker } from "../shared/date-time-picker"

export function OrderFilter({
  onFilterChange,
}: {
  onFilterChange: (filter: {
    id?: number
    comandaId?: number
    from?: string
    to?: string
  }) => void
}) {
  const [id, setId] = useState("")
  const [comandaId, setComandaId] = useState("")
  const [from, setFrom] = useState<{ date?: Date; time?: string }>({})
  const [to, setTo] = useState<{ date?: Date; time?: string }>({})

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      <Input
        type="number"
        placeholder="Pedido ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Comanda ID"
        value={comandaId}
        onChange={(e) => setComandaId(e.target.value)}
      />
      <DateTimePicker value={from} onChange={setFrom} />
      <DateTimePicker value={to} onChange={setTo} />
      <Button
        onClick={() => {
          onFilterChange({
            id: id ? Number(id) : undefined,
            comandaId: comandaId ? Number(comandaId) : undefined,
            from: buildISO(from),
            to: buildISO(to),
          })
        }}
      >
        Filtrar
      </Button>
    </div>
  )
}
export function OrderFilterReset({ onReset }: { onReset: () => void }) {
  return (
    <Button variant="outline" onClick={onReset}>
      Limpar Filtros
    </Button>
  )
}
