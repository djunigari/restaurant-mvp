"use client"

import { Button } from "@/components/ui/button"
import { Comanda } from "@/generated/prisma"
import Link from "next/link"

export function ComandaListComponent({
  data,
  totalPages,
  pageIndex,
  onPageChange,
}: {
  data: Comanda[]
  totalPages: number
  pageIndex: number
  onPageChange: (page: number) => void
}) {
  return (
    <div className="space-y-4">
      {data.map((comanda) => (
        <Link href={`/comandas/${comanda.id}`} key={comanda.id}>
          <div>ID: {comanda.id}</div>
          <div>Status: {comanda.status}</div>
        </Link>
      ))}

      {/* Paginação */}
      <div className="flex justify-center gap-2 mt-4">
        <Button
          variant="outline"
          disabled={pageIndex <= 0}
          onClick={() => onPageChange(pageIndex - 1)}
        >
          Anterior
        </Button>
        <span className="px-2">
          Página {pageIndex + 1} de {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={pageIndex >= totalPages - 1}
          onClick={() => onPageChange(pageIndex + 1)}
        >
          Próxima
        </Button>
      </div>
    </div>
  )
}
