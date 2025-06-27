"use client"

import { trpc } from "@/app/trpc/client"
import { ProductAddDialog } from "@/components/product/product-add-dialog"
import { ProductListComponent } from "@/components/product/product-list.component"
import MaxWidthWrapper from "@/components/template/MaxWidthWrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function ProductListPage() {
  const [inputValue, setInputValue] = useState("")
  const [filter, setFilter] = useState("")
  const [pageIndex, setPageIndex] = useState(0)
  // const debouncedFilter = useDebounce(filter, 300)

  const { data, isLoading } = trpc.product.getAll.useQuery({
    pageIndex,
    nameFilter: filter,
  })

  if (isLoading || !data) return <p>Carregando...</p>

  return (
    <MaxWidthWrapper>
      <div className="p-4 space-y-8">
        <h1 className="text-xl font-bold mb-4">Produtos</h1>
        <div className="flex gap-2">
          <FilterInput
            value={inputValue}
            onChange={setInputValue}
            onSearch={() => {
              setPageIndex(0) // opcional: volta pra página 1 ao pesquisar
              setFilter(inputValue)
            }}
          />
          <ProductAddDialog />
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

function FilterInput({
  value,
  onChange,
  onSearch,
}: {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
}) {
  return (
    <div className="flex items-end gap-2 max-w-sm">
      <Input
        id="filter"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Digite o nome do produto"
      />

      <Button onClick={onSearch} variant={"secondary"}>
        Pesquisar
      </Button>
    </div>
  )
}
