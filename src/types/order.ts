import { OrderItem } from "./orderItem"

export interface Order {
  id: number
  paidAt: string | null
  canceledAt: string | null
  createdAt: string
  updatedAt: string
  comandaId: number
  items: OrderItem[]
}
