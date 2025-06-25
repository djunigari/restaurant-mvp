"use client"

import { trpc } from "@/app/trpc/client"
import Link from "next/link"

export default function ComandaListPage() {
  const { data, isLoading } = trpc.comanda.getAll.useQuery()

  if (isLoading) return <p>Carregando...</p>

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Comandas</h1>
      <Link href="/comandas/new" className="text-blue-600 underline">
        Nova comanda
      </Link>
      <ul className="mt-4 space-y-2">
        {data?.map((c) => (
          <li key={c.id} className="border p-2 flex justify-between">
            <span>
              #{c.id} - {c.status}
            </span>
            <div className="space-x-2">
              <Link href={`/comandas/${c.id}`}>Ver</Link>
              <Link href={`/comandas/${c.id}/edit`} className="text-blue-500">
                Editar
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
