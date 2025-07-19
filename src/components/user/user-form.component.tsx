"use client"

import { trpc } from "@/app/trpc/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { FieldErrors, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Label } from "../ui/label"

const createUserSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
})

const updateUserSchema = createUserSchema.omit({ password: true })

// Tipos separados
type CreateUserFormValues = z.infer<typeof createUserSchema>
type UpdateUserFormValues = z.infer<typeof updateUserSchema>

interface UserFormProps {
  defaultValues?: Partial<CreateUserFormValues>
  userId?: string // se estiver presente, é edição
  onSuccess?: () => void // opcional: para fechar modal após salvar
}

export function UserFormComponent({
  defaultValues,
  userId,
  onSuccess,
}: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<CreateUserFormValues | UpdateUserFormValues>({
    resolver: zodResolver(!!userId ? updateUserSchema : createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      ...defaultValues,
    },
  })

  const utils = trpc.useUtils() // Para invalidar cache após criar

  const create = trpc.auth.create.useMutation({
    onSuccess: () => {
      toast.success("Conta criada com sucesso!")
      utils.auth.getAll.invalidate() // Atualiza lista após criar
      reset()
      onSuccess?.()
    },
    onError: (error: any) => {
      if (error.message.includes("Unique")) {
        toast.error(`Erro ao criar usuário`, {
          description: "Nome já registrado",
        })
        console.error("Erro ao criar usuário:", error)
        return
      }
      console.error("Erro ao criar usuário:", error)
      toast.error(`Erro ao criar usuário`)
    },
  })

  const update = trpc.auth.update.useMutation({
    onSuccess: () => {
      toast.success("Usuário atualizado com sucesso!")
      utils.product.getAll.invalidate()
      onSuccess?.()
    },
    onError: (error: any) => {
      if (error.message.includes("Unique")) {
        toast.error(`Erro ao criar usuário`, {
          description: "Nome já registrado",
        })
        return
      }
      toast.error(`Erro ao criar produto`)
    },
  })

  function onSubmit(data: CreateUserFormValues | UpdateUserFormValues) {
    console.log("Submitting user form:", data)

    if (userId) {
      update.mutate({ id: userId, ...data })
    } else {
      if ("password" in data) {
        create.mutate(data)
      } else {
        console.error("Senha ausente no cadastro")
      }
    }
  }

  const name = watch("name") || ""
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 w-full max-w-md mx-auto"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Name" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" placeholder="Email" {...register("email")} />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {!userId && (
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="******"
            {...register("password")}
          />
          {(errors as FieldErrors<CreateUserFormValues>).password && (
            <p className="text-sm text-red-500">
              {(errors as FieldErrors<CreateUserFormValues>).password?.message}
            </p>
          )}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting
          ? userId
            ? "Salvando..."
            : "Criando..."
          : userId
          ? "Salvar"
          : "Criar"}
      </Button>

      {create.error && (
        <p className="text-sm text-red-500">
          {(create.error.data as any)?.zodError?.formErrors?.join(", ") ||
            create.error.message}
        </p>
      )}
    </form>
  )
}
