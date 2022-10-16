import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Layout from "app/core/layouts/Layout"
import createClient from "app/clients/mutations/createClient"
import { ClientForm, FORM_ERROR } from "app/clients/components/ClientForm"
import { Box, Breadcrumb, BreadcrumbItem, Divider, BreadcrumbLink, Heading } from "@chakra-ui/react"
import { Client } from "app/auth/validations"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useAuthorize } from "@blitzjs/auth"
const NewClientPage = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  useAuthorize()
  const [createClientMutation] = useMutation(createClient)
  return (
    <Layout title={"April | New Client"}>
      <Breadcrumb mb="8">
        <BreadcrumbItem>
          <Link href={Routes.ClientsPage()}>
            <BreadcrumbLink>Clients</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <Link href={Routes.NewClientPage()}>
            <BreadcrumbLink>New Client</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>
      </Breadcrumb>
      <Box rounded={"lg"} boxShadow={"lg"} p={8}>
        <Heading fontSize={"2xl"}>New Client</Heading>
        <Divider mt="5" mb="5" />
        <ClientForm
          submitText="Create Client" // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          schema={Client}
          initialValues={{
            name: null,
            email: null,
            gender: null,
            note: null,
            userId: currentUser.id,
            phone: null,
            address: null,
            company: null,
            website: null,
          }}
          onSubmit={async (values) => {
            try {
              const client = await createClientMutation(values)
              router.push(
                Routes.ShowClientPage({
                  clientId: client.id,
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
    </Layout>
  )
}

NewClientPage.authenticate = true
export default NewClientPage
