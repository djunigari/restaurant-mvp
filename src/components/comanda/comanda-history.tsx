"use client"

import { trpc } from "@/app/trpc/client"

import { Button } from "@/components/ui/button"
import { buildISO } from "@/lib/data-time"
import { RotateCcw } from "lucide-react"
import { useState } from "react"
import { OrderList } from "../order/order-list.component"
import { DateTimePicker } from "../shared/date-time-picker"

export function ComandaHistory({ id }: { id: number }) {
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize] = useState(5)
  const [from, setFrom] = useState<{ date?: Date; time?: string }>({})
  const [to, setTo] = useState<{ date?: Date; time?: string }>({})
  const [filter, setFilter] = useState({})

  const { data, isLoading, refetch, isRefetching } =
    trpc.order.getAllByComandaId.useQuery({
      comandaId: id,
      pageIndex,
      pageSize,
      ...filter,
    })

  if (isLoading) return <span>Carregando histórico...</span>

  const totalPages = Math.ceil((data?.totalCount || 0) / pageSize)
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-lg font-semibold">Histórico de Pedidos</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={() => refetch()}
          disabled={isRefetching}
        >
          <RotateCcw
            className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
          />
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <DateTimePicker value={from} onChange={setFrom} />
        <DateTimePicker value={to} onChange={setTo} />
        <Button
          onClick={() => {
            setFilter({ ...filter, from: buildISO(from), to: buildISO(to) })
          }}
          disabled={isRefetching}
        >
          Filtrar
        </Button>
      </div>
      {!data?.totalCount || data.totalCount === 0 ? (
        <span>Sem pedidos anteriores.</span>
      ) : (
        <>
          <OrderList orders={data.items} />
          <div className="flex justify-center items-center gap-2 mt-4">
            <Button
              variant="outline"
              disabled={pageIndex === 0}
              onClick={() => setPageIndex(pageIndex - 1)}
            >
              Anterior
            </Button>

            <span>
              {pageIndex + 1} / {totalPages}
            </span>

            <Button
              variant="outline"
              disabled={pageIndex + 1 >= totalPages}
              onClick={() => setPageIndex(pageIndex + 1)}
            >
              Próximo
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
