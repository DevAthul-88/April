import Layout from "app/core/layouts/Layout"
import { LoginForm } from "app/auth/components/LoginForm"
import { useRouter } from "next/router"
import { useRedirectAuthenticated } from "@blitzjs/auth"
import AppHeader from "app/components/appHeader"

const LoginPage = () => {
  const router = useRouter()
  useRedirectAuthenticated("/apps")
  return (
    <Layout title="April | Log In">
      <AppHeader />
      <LoginForm
        onSuccess={(_user) => {
          const next = router.query.next ? decodeURIComponent(router.query.next) : "/"
          return router.push(next)
        }}
      />
    </Layout>
  )
}

export default LoginPage
