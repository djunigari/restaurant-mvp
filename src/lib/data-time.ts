export function buildISO({ date, time }: { date?: Date; time?: string }) {
  if (!date) return undefined

  const t = time || "00:00:00"
  const [hours, minutes, seconds] = t.split(":").map(Number)

  // importante: cria nova instância para não modificar o original
  const localDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes,
    seconds || 0,
  )

  // transforma em ISO UTC, para salvar no banco
  return localDate.toISOString()
}

export function parseISO(isoString: string) {
  const date = new Date(isoString)
  if (isNaN(date.getTime())) return undefined

  return {
    date,
    time: date.toTimeString().split(" ")[0], // HH:mm:ss
  }
}
export function formatDate(date: Date) {
  return date.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}
export function formatTime(time: string) {
  const [hours, minutes] = time.split(":")
  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`
}
