export interface Product {
  id: number
  name: string
  description: string
  price: number
  barcode: string | null
  deletedAt: Date | null
}
