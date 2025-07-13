import MaxWidthWrapper from "@/components/template/MaxWidthWrapper"
import LoginForm from "@/lib/auth/components/login-form.component"

export default function LoginPage() {
  return (
    <MaxWidthWrapper>
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <LoginForm />
    </MaxWidthWrapper>
  )
}
