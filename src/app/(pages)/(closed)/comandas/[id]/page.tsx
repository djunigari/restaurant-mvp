"use client"

import { trpc } from "@/app/trpc/client"
import { AddOrderItem } from "@/components/comanda/add-order-item.component"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParams } from "next/navigation"
import { toast } from "sonner"

export default function ComandaPage() {
  const params = useParams<{ id: string }>()
  const id = Number(params.id)

  const { data, isLoading, refetch } = trpc.comanda.getById.useQuery(id)
  const startOrder = trpc.order.start.useMutation({
    onSuccess: () => {
      refetch()
    },
  })

  const removeItem = trpc.order.removeOrderItem.useMutation({
    onSuccess: (result) => {
      if (result.removed) {
        toast.success("Item removido do pedido!")
      } else if ("newQuantity" in result) {
        toast.success(`Quantidade atualizada para ${result.newQuantity}`)
      } else {
        toast.success("Quantidade atualizada.")
      }
      refetch()
    },
    onError: (err) => {
      toast.error(`Erro: ${err.message}`)
    },
  })

  if (isLoading) return <p>Carregando...</p>
  if (!data) return <p>Comanda não encontrada</p>

  // encontra o último order não pago e não cancelado
  const currentOrder = data.orders.find((o) => !o.paidAt && !o.canceledAt)

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Comanda #{data.id}</h1>
      <p>Status: {data.status}</p>

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
              <h2 className="text-xl font-semibold">
                Pedido #{currentOrder.id}
              </h2>
              <ul className="list-disc pl-6">
                {currentOrder.items.length === 0 ? (
                  <li>Sem itens ainda.</li>
                ) : (
                  currentOrder.items.map((item) => (
                    <li key={item.id}>
                      {item.product.name} - {item.quantity} x ¥
                      {item.product.price}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          removeItem.mutate({
                            orderId: currentOrder.id,
                            productId: item.productId,
                            amount: 1,
                          })
                        }
                      >
                        Remover 1
                      </Button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </TabsContent>
        <TabsContent value="history">
          <ul className="list-disc pl-6">
            {data.orders.map((order) => (
              <li key={order.id}>
                Pedido #{order.id} - Criado:{" "}
                {new Date(order.createdAt).toLocaleString()} - Pago:{" "}
                {order.paidAt ? "Sim" : "Não"} - Cancelado:{" "}
                {order.canceledAt ? "Sim" : "Não"}
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  )
}
