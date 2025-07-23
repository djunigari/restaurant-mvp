import { Product } from "./product"

export interface OrderItem {
  id: number
  quantity: number
  orderId: number
  productId: number
  deletedAt: Date | null
  product: Product
}
