import MaxWidthWrapper from "@/components/template/MaxWidthWrapper"
import SignupForm from "@/lib/auth/components/signup-form.component"

export default function SignupPage() {
  return (
    <MaxWidthWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-6">Registrar</h1>
        <SignupForm />
      </div>
    </MaxWidthWrapper>
  )
}
