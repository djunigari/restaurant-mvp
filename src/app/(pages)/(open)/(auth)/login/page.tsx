import MaxWidthWrapper from "@/components/template/MaxWidthWrapper"
import LoginForm from "@/lib/auth/components/login-form.component"

export default function LoginPage() {
  return (
    <MaxWidthWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <LoginForm />
      </div>
    </MaxWidthWrapper>
  )
}
