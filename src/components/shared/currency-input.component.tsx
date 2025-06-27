// components/ui/currency-input.tsx
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { UseFormRegisterReturn } from "react-hook-form"

type CurrencyInputProps = {
  label?: string
  value?: number
  onChange: (value: number) => void
  register: UseFormRegisterReturn
  className?: string
}

export function CurrencyInput({
  label,
  value = 0,
  onChange,
  register,
  className,
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState("")

  useEffect(() => {
    const formatted = new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      maximumFractionDigits: 0,
    }).format(value)
    setDisplayValue(formatted)
  }, [value])

  return (
    <div className="flex flex-col space-y-1">
      {label && <label className="text-sm font-medium">{label}</label>}

      {/* input invisível do RHF */}
      <input
        type="number"
        className="hidden"
        {...register}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />

      {/* input visível com formatação */}
      <Input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^\d]/g, "")
          onChange(Number(raw))
        }}
        className={cn("no-spinner", className)}
      />
    </div>
  )
}
