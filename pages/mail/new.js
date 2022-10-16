import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Layout from "app/core/layouts/Layout"
import createMail from "app/mail/mutations/createMail"
import { MailForm, FORM_ERROR } from "app/mail/components/MailForm"
import { Box, Breadcrumb, BreadcrumbItem, Divider, BreadcrumbLink, Heading } from "@chakra-ui/react"
import { Suspense } from "react"
import { Mail } from "app/auth/validations"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

const NewMailPage = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  const [createMailMutation] = useMutation(createMail)
  return (
    <Layout title={"Create New Mail"}>
      <Breadcrumb mb="8">
        <BreadcrumbItem>
          <Link href={Routes.MailPage()}>
            <BreadcrumbLink>Mail</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <Link href={Routes.NewMailPage()}>
            <BreadcrumbLink>New Mail</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>
      </Breadcrumb>
      <Suspense fallback={<div>Loading...</div>}>
        <Box rounded={"lg"} boxShadow={"lg"} p={8}>
          <MailForm
            submitText="Create Mail" // TODO use a zod schema for form validation
            //  - Tip: extract mutation's schema into a shared `validations.ts` file and
            //         then import and use it here
            schema={Mail}
            initialValues={{
              userId: currentUser.id,
              name: null,
              client: null,
              note: null,
              seen: false,
              sender: currentUser.email,
            }}
            onSubmit={async (values) => {
              try {
                const mail = await createMailMutation(values)
                router.push(
                  Routes.ShowMailPage({
                    mailId: mail.id,
                  })
                )
              } catch (error) {
                console.error(error)
                return {
                  [FORM_ERROR]: error.toString(),
                }
              }
            }}
          />
        </Box>
      </Suspense>
    </Layout>
  )
}

NewMailPage.authenticate = true
export default NewMailPage
