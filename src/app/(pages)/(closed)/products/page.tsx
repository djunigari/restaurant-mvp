"use client"

import { trpc } from "@/app/trpc/client"
import { ProductFormComponent } from "@/components/product/product-form.component"
import { ProductListComponent } from "@/components/product/product-list.component"
import MaxWidthWrapper from "@/components/template/MaxWidthWrapper"
import { useState } from "react"

export default function ProductListPage() {
  const [pageIndex, setPageIndex] = useState(0)

  const { data, isLoading } = trpc.product.getAll.useQuery({
    pageIndex: pageIndex,
  })

  if (isLoading || !data) return <p>Carregando...</p>

  return (
    <MaxWidthWrapper>
      <div className="p-4 space-y-8">
        <h1 className="text-xl font-bold mb-4">Produtos</h1>

        {/* Formulário de novo produto */}
        <div className="border p-4 rounded shadow-sm">
          <h2 className="font-semibold mb-2">Cadastrar novo produto</h2>
          <ProductFormComponent />
        </div>

        {/* Lista de produtos */}
        <ProductListComponent
          data={data.data}
          totalPages={data.totalPages}
          pageIndex={data.pageIndex}
          onPageChange={(page) => setPageIndex(page)}
        />
      </div>
    </MaxWidthWrapper>
  )
}
