import { DateTimePicker } from "../shared/date-time-picker"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

export function OrderFilter({
  value,
  onChange,
  onFilter,
}: {
  value: {
    id: string
    comandaId: string
    from: { date?: Date; time?: string }
    to: { date?: Date; time?: string }
  }
  onChange: (val: typeof value) => void
  onFilter: () => void
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      <Input
        type="number"
        placeholder="Pedido ID"
        value={value.id}
        onChange={(e) => onChange({ ...value, id: e.target.value })}
      />
      <Input
        type="number"
        placeholder="Comanda ID"
        value={value.comandaId}
        onChange={(e) => onChange({ ...value, comandaId: e.target.value })}
      />
      <div className="flex gap-2">
        <DateTimePicker
          value={value.from}
          onChange={(from) => onChange({ ...value, from })}
        />
        <DateTimePicker
          value={value.to}
          onChange={(to) => onChange({ ...value, to })}
        />
      </div>
      <Button onClick={onFilter}>Filtrar</Button>
    </div>
  )
}
