import { Product } from "./product"

export interface OrderItem {
  id: number
  quantity: number
  orderId: number
  productId: number
  deletedAt: string | null
  product: Product
}
