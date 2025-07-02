"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

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
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")

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
      <Input
        type="datetime-local"
        placeholder="De"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
      />
      <Input
        type="datetime-local"
        placeholder="Até"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />
      <Button
        onClick={() =>
          onFilterChange({
            id: id ? Number(id) : undefined,
            comandaId: comandaId ? Number(comandaId) : undefined,
            from: from || undefined,
            to: to || undefined,
          })
        }
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
