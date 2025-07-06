import { trpc } from "@/app/trpc/client"
import { toast } from "sonner"

export function useStartOrderMutation() {
  const utils = trpc.useUtils()
  return trpc.order.start.useMutation({
    onSuccess: () => {
      utils.order.invalidate()
      utils.comanda.invalidate()
      toast.success("Pedido iniciado com sucesso!")
    },
    onError: (err) => {
      toast.error(`Erro ao iniciar pedido: ${err.message}`)
    },
  })
}

export function useCancelOrderMutation() {
  const utils = trpc.useUtils()
  return trpc.order.cancel.useMutation({
    onSuccess: () => {
      utils.order.invalidate()
      utils.comanda.invalidate()
      toast.success("Pedido cancelado com sucesso!")
    },
    onError: (err) => {
      toast.error(`Erro ao cancelar pedido: ${err.message}`)
    },
  })
}

export function usePaidOrderMutation() {
  const utils = trpc.useUtils()
  return trpc.order.paid.useMutation({
    onSuccess: () => {
      utils.order.invalidate()
      utils.comanda.invalidate()
      toast.success("Pedido marcado como pago!")
    },
    onError: (err) => {
      toast.error(`Erro ao marcar pedido como pago: ${err.message}`)
    },
  })
}

export function useAddOrderItemMutation({
  onAdded,
  comandaId,
}: {
  onAdded?: () => void
  comandaId?: number
} = {}) {
  const utils = trpc.useUtils()
  return trpc.order.addOrderItem.useMutation({
    onSuccess: () => {
      utils.order.invalidate()
      if (comandaId) {
        utils.order.getCurrentByComandaId.invalidate(comandaId)
      }
      onAdded?.()
      toast.success("Item adicionado ao pedido com sucesso!")
    },
    onError: (err) => {
      console.error("Erro ao adicionar item:", err)
      if (err.data?.code === "NOT_FOUND" && err.message.includes("Product")) {
        toast.error("Produto não encontrado")
      } else {
        toast.error(
          `Erro ao adicionar item: ${err.message || "Erro desconhecido"}`,
        )
      }
    },
  })
}

export function useRemoveOrderItemMutation({
  onRemoved,
  comandaId,
}: {
  onRemoved?: () => void
  comandaId?: number
} = {}) {
  const utils = trpc.useUtils()
  return trpc.order.removeOrderItem.useMutation({
    onSuccess: (result) => {
      utils.order.invalidate()
      if (comandaId) {
        utils.order.getCurrentByComandaId.invalidate(comandaId)
      }

      if (result.removed) {
        toast.success("Item removido do pedido!")
      } else if ("newQuantity" in result) {
        toast.success(`Quantidade atualizada para ${result.newQuantity}`)
      } else {
        toast.success("Quantidade atualizada.")
      }

      onRemoved?.()
    },
    onError: (err) => {
      toast.error(`Erro: ${err.message}`)
    },
  })
}
