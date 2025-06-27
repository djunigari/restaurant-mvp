"use client"

import { trpc } from "@/app/trpc/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { CurrencyInput } from "../shared/currency-input.component"

const productSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  description: z.string().optional(),
  price: z.number().min(0, "Preço inválido"),
})

export type ProductFormValues = z.infer<typeof productSchema>

interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues>
  productId?: number // se estiver presente, é edição
  onSuccess?: () => void // opcional: para fechar modal após salvar
}

export function ProductFormComponent({
  defaultValues,
  productId,
  onSuccess,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      ...defaultValues,
    },
  })

  const price = watch("price") || 0

  const utils = trpc.useUtils() // Para invalidar cache após criar

  const create = trpc.product.create.useMutation({
    onSuccess: () => {
      toast.success("Produto criado com sucesso!")
      utils.product.getAll.invalidate() // Atualiza lista após criar
      reset()
      onSuccess?.()
    },
    onError: (error) => {
      if (error.message.includes("Unique")) {
        toast.error(`Erro ao criar produto`, {
          description: "Nome já registrado",
        })
        return
      }
      toast.error(`Erro ao criar produto`)
    },
  })

  const update = trpc.product.update.useMutation({
    onSuccess: () => {
      toast.success("Produto atualizado com sucesso!")
      utils.product.getAll.invalidate()
      onSuccess?.()
    },
    onError: (error) => {
      if (error.message.includes("Unique")) {
        toast.error(`Erro ao criar produto`, {
          description: "Nome já registrado",
        })
        return
      }
      toast.error(`Erro ao criar produto`)
    },
  })

  function onSubmit(data: ProductFormValues) {
    if (productId) {
      update.mutate({ id: productId, ...data })
    } else {
      create.mutate(data)
    }
  }

  const name = watch("name") || ""
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {productId && (
        <div>
          <label className="font-semibold">ID:</label>
          <Input value={productId} disabled readOnly className="bg-muted" />
        </div>
      )}

      <div>
        <label className="font-semibold">Nome:</label>
        <Input
          value={name}
          onChange={(e) => {
            const cleaned = e.target.value.replace(/\s{2,}/g, " ")
            setValue("name", cleaned)
          }}
          onBlur={(e) => {
            const cleaned = e.target.value
              .replace(/\s+/g, " ")
              .replace(/^\s+|\s+$/g, "")
            setValue("name", cleaned, { shouldValidate: true })
          }}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="font-semibold">Descrição:</label>
        <Textarea {...register("description")} />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      <div>
        <CurrencyInput
          label="Preço em ienes"
          register={register("price", { valueAsNumber: true })}
          value={price}
          onChange={(val) => setValue("price", val, { shouldValidate: true })}
        />
        {errors.price && (
          <p className="text-red-500 text-sm">{errors.price.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? productId
            ? "Salvando..."
            : "Registrando..."
          : productId
          ? "Salvar"
          : "Registrar"}
      </Button>
    </form>
  )
}
