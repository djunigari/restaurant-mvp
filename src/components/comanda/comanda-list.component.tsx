"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Comanda } from "@/types/comanda"
import Link from "next/link"
import { Badge } from "../ui/badge"

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
      <div className="flex flex-wrap gap-4">
        {data.map((comanda) => (
          <Link
            href={`/comandas/${comanda.id}`}
            key={comanda.id}
            className={cn(
              `flex flex-col gap-2 p-4 border rounded  
              transition-colors space-x-2 w-[150px] text-center
              `,
              {
                "bg-blue-100 border-blue-200 hover:bg-blue-50":
                  comanda.status === "OPEN",
                "bg-orange-100 border-orange-200 hover:bg-orange-50":
                  comanda.status === "OCCUPIED",
              },
            )}
          >
            <Badge>{comanda.id}</Badge>
            <span className="font-semibold">{comanda.status}</span>
          </Link>
        ))}
      </div>

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
