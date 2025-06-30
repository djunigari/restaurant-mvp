"use client"

import { trpc } from "@/app/trpc/client"
import { ComandaAddDialog } from "@/components/comanda/comanda-add-dialog"
import { ComandaListComponent } from "@/components/comanda/comanda-list.component"
import MaxWidthWrapper from "@/components/template/MaxWidthWrapper"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

export default function ComandaListPage() {
  const [inputValue, setInputValue] = useState("")
  const [filter, setFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState<"ID" | "Status">("ID")
  const [pageIndex, setPageIndex] = useState(0)

  const { data, isLoading } = trpc.comanda.getAll.useQuery({
    pageIndex,
    filter,
    typeFilter,
  })

  if (isLoading || !data) return <p>Carregando...</p>

  return (
    <MaxWidthWrapper>
      <div className="p-4 space-y-8">
        <h1 className="text-xl font-bold mb-4">Comandas</h1>
        <div className="flex flex-col gap-2 sm:flex-row">
          <FilterInput
            isLoading={isLoading}
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
              setPageIndex(0)
              setFilter(inputValue)
            }}
          />
          <ComandaAddDialog />
        </div>
        <ComandaListComponent
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
  typeFilter = "ID",
  setTypeFilter,
  value,
  onChange,
  onSearch,
  isLoading,
}: {
  value: string
  typeFilter?: "ID" | "Status"
  setTypeFilter?: (type: "ID" | "Status") => void
  onChange: (value: string) => void
  onSearch: () => void
  isLoading?: boolean
}) {
  return (
    <div className="w-full flex flex-col sm:flex-row border rounded-md overflow-hidden shadow-sm">
      <div className="flex">
        <Select onValueChange={setTypeFilter} defaultValue={typeFilter}>
          <SelectTrigger className="w-[100px] rounded-none border-none bg-zinc-100">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-l-0">
            <SelectItem value="ID">ID</SelectItem>
            <SelectItem value="Status">Status</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {typeFilter === "ID" && (
        <div className="flex w-full">
          <input
            id="filter"
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Filtrar por ID"
            className="flex-1 outline-none px-2 py-1 border focus:ring-0"
          />
        </div>
      )}

      {typeFilter === "Status" && (
        <div className="flex gap-4 items-center mx-2">
          <label className="flex items-center gap-2">
            <Checkbox
              checked={value.includes("OPEN")}
              onCheckedChange={(checked) => {
                let next = value.split(",").filter(Boolean)
                if (checked) {
                  next.push("OPEN")
                } else {
                  next = next.filter((v) => v !== "OPEN")
                }
                onChange(next.join(","))
              }}
            />
            <span>Open</span>
          </label>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={value.includes("OCCUPIED")}
              onCheckedChange={(checked) => {
                let next = value.split(",").filter(Boolean)
                if (checked) {
                  next.push("OCCUPIED")
                } else {
                  next = next.filter((v) => v !== "OCCUPIED")
                }
                onChange(next.join(","))
              }}
            />
            <span>Occupied</span>
          </label>
        </div>
      )}
      <Button
        onClick={onSearch}
        variant={"secondary"}
        className="border-l-0 rounded-none ml-auto"
        disabled={isLoading}
      >
        {isLoading ? "Carregando..." : "Filtrar"}
      </Button>
    </div>
  )
}
