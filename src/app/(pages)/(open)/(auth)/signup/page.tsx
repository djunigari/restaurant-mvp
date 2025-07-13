import MaxWidthWrapper from "@/components/template/MaxWidthWrapper"
import SignupForm from "@/lib/auth/components/signup-form.component"

export default function SignupPage() {
  return (
    <MaxWidthWrapper>
      <h1 className="text-2xl font-bold mb-6">Registrar</h1>
      <SignupForm />
    </MaxWidthWrapper>
  )
}
