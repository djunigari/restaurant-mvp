import { Order } from "./order"

export type ComandaStatus = "OPEN" | "OCCUPIED"

export interface Comanda {
  id: number
  status: ComandaStatus
  deletedAt: string | null
  orders?: Order[]
}
