import { OrderItem } from "./orderItem"

export interface Order {
  id: number
  paidAt: Date | null
  canceledAt: Date | null
  createdAt: Date
  updatedAt: Date
  comandaId: number
  items?: OrderItem[]
}
