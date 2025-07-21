"use client"

import { trpc } from "@/app/trpc/client"
import LoadingOverlay from "@/components/shared/loading-overlay.component"
import MaxWidthWrapper from "@/components/template/MaxWidthWrapper"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UserAddDialog } from "@/components/user/user-add-dialog"
import { UserListComponent } from "@/components/user/user-list.component"
import { useState } from "react"

export default function UserListPage() {
  const [inputValue, setInputValue] = useState("")
  const [filter, setFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState<"ID" | "Name">("Name")
  const [pageIndex, setPageIndex] = useState(0)
  // const debouncedFilter = useDebounce(filter, 300)

  const { data, isLoading } = trpc.auth.getAll.useQuery({
    pageIndex,
    filter,
    typeFilter,
  })

  return (
    <MaxWidthWrapper>
      {isLoading && <LoadingOverlay />}
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
          <UserAddDialog />
        </div>

        {data ? (
          data.data.length === 0 ? (
            <div className="text-center text-gray-500">
              Nenhum usuário encontrado.
            </div>
          ) : (
            <UserListComponent
              data={data.data || []}
              totalPages={data.totalPages}
              pageIndex={data.pageIndex}
              onPageChange={(page) => setPageIndex(page)}
            />
          )
        ) : (
          <div className="text-center text-gray-500">
            Nenhum usuário encontrado.
          </div>
        )}
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
    <div className="w-full flex flex-col sm:flex-row sm:gap-0 border rounded-md overflow-hidden shadow-sm">
      <label htmlFor="filter" className="sr-only">
        Filtrar por nome do usuário ou ID
      </label>

      {/* Select: Tipo de filtro */}
      <Select onValueChange={setTypeFilter} defaultValue={typeFilter}>
        <SelectTrigger className="w-full sm:w-[100px] rounded-none border-none bg-zinc-100">
          <SelectValue placeholder="Filtro" />
        </SelectTrigger>
        <SelectContent className="sm:border-l-0">
          <SelectItem value="ID">ID</SelectItem>
          <SelectItem value="Name">Nome</SelectItem>
        </SelectContent>
      </Select>

      {/* Campo de texto */}
      <input
        id="filter"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={
          typeFilter === "ID" ? "Filtrar por ID" : "Filtrar por nome"
        }
        className="w-full px-3 py-2 h-9 border-none outline-none ring-0 focus:ring-0 focus:outline-none focus:border-none shadow-none"
        autoComplete="off"
      />

      {/* Botão de pesquisa */}
      <Button
        onClick={onSearch}
        variant="secondary"
        className="w-full sm:w-auto sm:border-l-0 rounded-none"
      >
        <span className="sm:sr-only">Pesquisar</span>
        <span className="hidden sm:inline">Pesquisar</span>
        <span className="sm:hidden">🔍</span>
      </Button>
    </div>
  )
}
