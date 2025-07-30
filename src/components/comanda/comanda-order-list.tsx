"use client"

import { Order } from "@/types/order"
import { ChevronsUpDown } from "lucide-react"
import Barcode from "react-barcode"
import { Button } from "../ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible"
import { RemoveOrderItemDialog } from "./remove-order-item-dialog"

const fmt = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
})

export function ComandaOrderList({ order }: { order: Order }) {
  const total =
    order.items?.reduce((sum, item) => {
      return sum + item.product.price * item.quantity
    }, 0) || 0

  if (!order) return <span>Carregando...</span>

  if (order.items?.length === 0) {
    return <span>Sem itens ainda.</span>
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="font-bold">Total: {fmt.format(total)}</span>

      {order?.items?.map((item) => (
        <Collapsible
          key={item.id}
          className="w-full flex flex-col p-2 border rounded"
        >
          <div className="flex justify-between gap-4">
            <div className="flex flex-col">
              <span className="font-semibold">
                {item.quantity}x {item.product.name}
              </span>
              {item.product.barcode && (
                <div className="mt-2">
                  <Barcode
                    value={item.product.barcode}
                    height={40}
                    width={1.5}
                    fontSize={12}
                    displayValue={true} // mostra o número abaixo
                  />
                </div>
              )}
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <ChevronsUpDown />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="flex flex-col">
            <div className="flex gap-2 text-sm text-gray-500">
              <span>Preço:{fmt.format(item.product.price)}</span>
              <span>Quantidade: {item.quantity}</span>
            </div>
            <span className="text-sm text-gray-500 font-semibold">
              Total:{fmt.format(item.product.price * item.quantity)}
            </span>

            <RemoveOrderItemDialog
              className="ml-auto"
              order={order}
              productId={item.productId}
            />
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  )
}
