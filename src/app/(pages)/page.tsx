"use client"

import MaxWidthWrapper from "@/components/template/MaxWidthWrapper"
import Link from "next/link"

export default function Home() {
  // const { session } = useAuth()
  // const isAdmin = session?.role === "ADMIN"

  return (
    <MaxWidthWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-4">
        <h1 className="text-2xl font-bold mb-8">Bem-vindo ao Sistema</h1>

        <Link href="/products">
          <button className="bg-blue-500 text-white px-6 py-3 rounded w-60">
            Produtos
          </button>
        </Link>

        <Link href="/comandas">
          <button className="bg-green-500 text-white px-6 py-3 rounded w-60">
            Comandas
          </button>
        </Link>

        <Link href="/orders">
          <button className="bg-purple-500 text-white px-6 py-3 rounded w-60">
            Pedidos (Orders)
          </button>
        </Link>

        {/* {isAdmin && ( */}
        <Link href="/users">
          <button className="bg-orange-500 text-white px-6 py-3 rounded w-60">
            Usuários
          </button>
        </Link>
        {/* )} */}
      </div>
    </MaxWidthWrapper>
  )
}
