import { useRouter } from "next/router"
import Layout from "app/core/layouts/Layout"
import { SignupForm } from "app/auth/components/SignupForm"
import { Routes } from "@blitzjs/next"
import AppHeader from "app/components/appHeader"
import { useRedirectAuthenticated } from "@blitzjs/auth"

const SignupPage = () => {
  const router = useRouter()
  useRedirectAuthenticated("/apps")
  return (
    <Layout title="Sign Up">
      <AppHeader />
      <SignupForm onSuccess={() => router.push(Routes.AppsPage())} />
    </Layout>
  )
}

export default SignupPage
