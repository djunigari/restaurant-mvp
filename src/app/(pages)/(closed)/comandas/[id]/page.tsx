"use client"

import { trpc } from "@/app/trpc/client"
import { AddOrderItem } from "@/components/comanda/add-order-item.component"
import { ComandaActions } from "@/components/comanda/comanda-actions"
import { ComandaHistory } from "@/components/comanda/comanda-history"
import { ComandaOrderList } from "@/components/comanda/comanda-order-list"
import { ComandaStatusHeader } from "@/components/comanda/comanda-status-header"
import MaxWidthWrapper from "@/components/template/MaxWidthWrapper"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParams } from "next/navigation"

export default function ComandaPage() {
  const params = useParams<{ id: string }>()
  const id = Number(params.id)

  const { data, isLoading, refetch } = trpc.comanda.getById.useQuery(id)
  const startOrder = trpc.order.start.useMutation({
    onSuccess: () => {
      refetch()
    },
  })

  if (isLoading) return <p>Carregando...</p>
  if (!data) return <p>Comanda não encontrada</p>

  const currentOrder = data.orders.find((o) => !o.paidAt && !o.canceledAt)

  return (
    <MaxWidthWrapper>
      <ComandaStatusHeader id={data.id} status={data.status} />

      <Tabs defaultValue="current" className="w-full mt-6">
        <TabsList>
          <TabsTrigger value="current">Pedido Atual</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          {!currentOrder ? (
            <div className="space-y-4">
              <p>Não há pedido em andamento.</p>
              <Button onClick={() => startOrder.mutate(id)}>
                Iniciar novo pedido
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <AddOrderItem
                orderId={currentOrder.id}
                onAdded={() => refetch()}
              />
              <ComandaOrderList
                order={currentOrder}
                onUpdated={() => refetch()}
              />
              <ComandaActions
                orderId={currentOrder.id}
                onUpdated={() => refetch()}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          <ComandaHistory orders={data.orders} />
        </TabsContent>
      </Tabs>
    </MaxWidthWrapper>
  )
}
