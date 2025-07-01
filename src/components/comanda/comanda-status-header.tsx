"use client"

export function ComandaStatusHeader({
  id,
  status,
}: {
  id: number
  status: string
}) {
  return (
    <>
      <h1 className="text-2xl font-bold">Comanda #{id}</h1>
      <p>Status: {status}</p>
    </>
  )
}
