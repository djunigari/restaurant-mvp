export interface User {
  name: string | null
  email: string | null
  id: string
  createdAt: Date
  updatedAt: Date
  emailVerified: Date | null
  image: string | null
  passwordHash: string
  role: Role
}

export enum Role {
  USER = "user",
  ADMIN = "admin",
}
