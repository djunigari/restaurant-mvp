"use client"

import { trpc } from "@/app/trpc/client"
import { OrderFilter } from "@/components/order/order-filter"
import { OrderList } from "@/components/order/order-list.component"
import MaxWidthWrapper from "@/components/template/MaxWidthWrapper"
import { Button } from "@/components/ui/button"
import { buildISO } from "@/lib/data-time"

import { useState } from "react"

export default function OrdersPage() {
  const [filter, setFilter] = useState<{
    id: string
    comandaId: string
    from: { date?: Date; time?: string }
    to: { date?: Date; time?: string }
  }>({
    id: "",
    comandaId: "",
    from: {},
    to: {},
  })
  const [queryFilter, setQueryFilter] = useState({})

  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize] = useState(10)

  const { data, isLoading, refetch } = trpc.order.getAll.useQuery({
    ...queryFilter,
    pageIndex,
    pageSize,
  })

  if (isLoading) return <span>Carregando orders...</span>

  const totalPages = Math.ceil((data?.totalCount || 0) / pageSize)

  return (
    <MaxWidthWrapper>
      <div className="p-4 space-y-8">
        <h1 className="text-2xl font-bold mb-4">Pedidos</h1>

        <OrderFilter
          value={filter}
          onChange={setFilter}
          onFilter={() => {
            setQueryFilter({
              id: filter.id ? Number(filter.id) : undefined,
              comandaId: filter.comandaId
                ? Number(filter.comandaId)
                : undefined,
              from: buildISO(filter.from),
              to: buildISO(filter.to),
            })
            refetch()
          }}
        />

        {!data?.totalCount || data.totalCount === 0 ? (
          <span>Sem pedidos.</span>
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
    </MaxWidthWrapper>
  )
}
