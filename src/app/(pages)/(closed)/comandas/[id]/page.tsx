"use client"

import { trpc } from "@/app/trpc/client"
import { AddOrderItem } from "@/components/comanda/add-order-item.component"
import { CancelOrderDialog } from "@/components/comanda/cancel-order-dialog"
import { ComandaHistory } from "@/components/comanda/comanda-history"
import { ComandaOrderList } from "@/components/comanda/comanda-order-list"
import { ComandaStatusHeader } from "@/components/comanda/comanda-status-header"
import { MarkAsPaidDialog } from "@/components/comanda/mark-as-paid-dialog"
import MaxWidthWrapper from "@/components/template/MaxWidthWrapper"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStartOrderMutation } from "@/hooks/useComanda"
import { useParams } from "next/navigation"

export default function ComandaPage() {
  const params = useParams<{ id: string }>()
  const id = Number(params.id)

  const { data: comanda, isLoading } = trpc.comanda.getById.useQuery(id)
  const { data: currentOrder, isLoading: isLoadingOrder } =
    trpc.order.getCurrentByComandaId.useQuery(id)

  const startOrder = useStartOrderMutation()

  if (isLoading) return <p>Carregando comanda...</p>
  if (!comanda) return <p>Comanda não encontrada</p>

  return (
    <MaxWidthWrapper>
      <ComandaStatusHeader id={comanda.id} status={comanda.status} />

      <Tabs defaultValue="current" className="w-full mt-6">
        <TabsList>
          <TabsTrigger value="current">Pedido Atual</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          {isLoadingOrder ? (
            <p>Carregando pedido atual...</p>
          ) : !currentOrder ? (
            <div className="space-y-4">
              <p>Não há pedido em andamento.</p>
              <Button onClick={() => startOrder.mutate(id)}>
                Iniciar novo pedido
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <AddOrderItem order={currentOrder} />
              <ComandaOrderList order={currentOrder} />

              <div className="flex gap-2 mt-4">
                <MarkAsPaidDialog orderId={currentOrder.id} />
                <CancelOrderDialog orderId={currentOrder.id} />
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          <ComandaHistory id={comanda.id} />
        </TabsContent>
      </Tabs>
    </MaxWidthWrapper>
  )
}
