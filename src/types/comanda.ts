import { Order } from "./order"

export enum ComandaStatus {
  OPEN = "OPEN",
  OCCUPIED = "OCCUPIED",
}

export interface Comanda {
  id: number
  status: ComandaStatus
  deletedAt: Date | null
  orders?: Order[]
}
