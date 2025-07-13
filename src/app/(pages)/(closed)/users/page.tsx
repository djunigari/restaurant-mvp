"use client"

import { trpc } from "@/app/trpc/client"
import { ProductAddDialog } from "@/components/product/product-add-dialog"
import MaxWidthWrapper from "@/components/template/MaxWidthWrapper"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

export default function UserListPage() {
  const [inputValue, setInputValue] = useState("")
  const [filter, setFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState<"ID" | "Name">("Name")
  const [pageIndex, setPageIndex] = useState(0)
  // const debouncedFilter = useDebounce(filter, 300)

  const { data, isLoading } = trpc.user.getAll.useQuery({
    pageIndex,
    filter,
    typeFilter,
  })

  if (isLoading || !data) return <p>Carregando...</p>

  return (
    <MaxWidthWrapper>
      <div className="p-4 space-y-8">
        <h1 className="text-xl font-bold mb-4">Usuários</h1>
        <div className="flex flex-col gap-2 sm:flex-row">
          <FilterInput
            value={inputValue}
            typeFilter={typeFilter}
            setTypeFilter={(type) => {
              setInputValue("")
              setFilter("")
              setPageIndex(0)
              setTypeFilter(type)
            }}
            onChange={setInputValue}
            onSearch={() => {
              setPageIndex(0) // opcional: volta pra página 1 ao pesquisar
              setFilter(inputValue)
            }}
          />
          <ProductAddDialog />
        </div>
        {/* Lista de produtos */}
        <UserListComponent
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
  typeFilter = "Name",
  setTypeFilter,
  value,
  onChange,
  onSearch,
}: {
  value: string
  typeFilter?: "Name" | "ID"
  setTypeFilter?: (type: "Name" | "ID") => void
  onChange: (value: string) => void
  onSearch: () => void
}) {
  return (
    <div className="w-full flex border rounded-md overflow-hidden shadow-sm">
      <label htmlFor="filter" className="sr-only">
        Filtrar por nome do produto ou ID
      </label>
      <Select onValueChange={setTypeFilter} defaultValue={typeFilter}>
        <SelectTrigger className="w-[100px] rounded-none border-none bg-zinc-100">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="border-l-0">
          <SelectItem value="ID">ID</SelectItem>
          <SelectItem value="Name">Nome</SelectItem>
        </SelectContent>
      </Select>
      <input
        id="filter"
        type={typeFilter === "ID" ? "number" : "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={
          typeFilter === "ID" ? "Filtrar por ID" : "Filtrar por nome"
        }
        className="flex-1 outline-none px-2 py-1 border-l border-r-0 focus:ring-0"
      />

      <Button
        onClick={onSearch}
        variant={"secondary"}
        className="border-l-0 rounded-none"
      >
        <span className="sr-only">Pesquisar</span>
        Pesquisar
      </Button>
    </div>
  )
}
