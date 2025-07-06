"use client"

import { trpc } from "@/app/trpc/client"
import { OrderFilter } from "@/components/order/order-filter"
import { OrderList } from "@/components/order/order-list.component"
import { Button } from "@/components/ui/button"

import { useState } from "react"

export default function OrdersPage() {
  const [filter, setFilter] = useState({})
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize] = useState(10)

  const { data, isLoading, refetch } = trpc.order.getAll.useQuery({
    ...filter,
    pageIndex,
    pageSize,
  })

  if (isLoading) return <span>Carregando orders...</span>
  if (!data?.totalCount || data.totalCount === 0)
    return <span>Sem pedidos.</span>

  const totalPages = Math.ceil(data.totalCount / pageSize)

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Pedidos</h1>

      <OrderFilter
        onFilterChange={(newFilter) => {
          setFilter(newFilter)
          refetch()
        }}
      />
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
    </div>
  )
}
