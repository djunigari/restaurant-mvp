"use client"

export function ComandaStatusHeader({ id }: { id: number }) {
  return (
    <>
      <h1 className="text-2xl font-bold">Comanda #{id}</h1>
    </>
  )
}
