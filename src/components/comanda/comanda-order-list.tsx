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
  const total = order.items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity
  }, 0)

  return (
    <ul className="w-full flex flex-col gap-2">
      {order?.items.length === 0 ? (
        <li>Sem itens ainda.</li>
      ) : (
        <>
          <span className="mt-2 flex justify-between border-t pt-2 text-lg font-bold">
            <span>Total:</span>
            <span>{fmt.format(total)}</span>
          </span>
          {order?.items.map((item) => (
            <li
              key={item.id}
              className="w-full flex flex-col border p-2 rounded"
            >
              <span className="font-semibold">{item.product.name}</span>
              <div className="flex flex-col">
                <div className="flex gap-2 text-sm text-gray-500">
                  <span>Preço:{fmt.format(item.product.price)}</span>
                  <span>Quantidade: {item.quantity}</span>
                </div>
                <span className="text-sm text-gray-500 font-semibold">
                  Total:{fmt.format(item.product.price * item.quantity)}
                </span>
              </div>
              <RemoveOrderItemDialog
                className="ml-auto"
                orderId={order.id}
                productId={item.productId}
                onUpdated={onUpdated}
              />
            </li>
          ))}
        </>
      )}
    </ul>
  )
}
