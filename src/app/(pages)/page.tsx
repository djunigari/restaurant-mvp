"use client"

import Link from "next/link"

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col gap-4">
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
      </div>
    </div>
  )
}
