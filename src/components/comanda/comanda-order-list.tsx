"use client"

import { Order } from "@/types/order"
import { RemoveOrderItemDialog } from "./remove-order-item-dialog"
const fmt = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
})

export function ComandaOrderList({
  order,
  onUpdated,
}: {
  order: Order
  onUpdated: () => void
}) {
  return (
    <ul className="w-full flex flex-col gap-2">
      {order?.items.length === 0 ? (
        <li>Sem itens ainda.</li>
      ) : (
        order?.items.map((item) => (
          <li key={item.id} className="w-full flex flex-col border p-2 rounded">
            <span className="font-semibold">
              {item.product.name} - {fmt.format(item.product.price)}
            </span>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">
                Quantidade: {item.quantity}
              </span>
              <span className="text-sm text-gray-500">
                Total: {fmt.format(item.product.price * item.quantity)}
              </span>
            </div>
            <RemoveOrderItemDialog
              className="ml-auto"
              orderId={order.id}
              productId={item.productId}
              onUpdated={onUpdated}
            />
          </li>
        ))
      )}
    </ul>
  )
}
