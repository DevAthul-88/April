import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import Layout from "app/core/layouts/Layout"
import getClient from "app/clients/queries/getClient"
import updateClient from "app/clients/mutations/updateClient"
import { ClientForm, FORM_ERROR } from "app/clients/components/ClientForm"
import { Box, Breadcrumb, BreadcrumbItem, Divider, BreadcrumbLink, Heading } from "@chakra-ui/react"
import { Client } from "app/auth/validations"

export const EditClient = () => {
  const router = useRouter()
  const clientId = useParam("clientId")
  const [client, { setQueryData }] = useQuery(
    getClient,
    {
      id: clientId,
    },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateClientMutation] = useMutation(updateClient)
  return (
    <>
      <Head>
        <title>April | Edit {client.name}</title>
      </Head>

      <Box rounded={"lg"} boxShadow={"lg"} p={8}>
        <Heading fontSize={"2xl"}>Edit Client {client.name}</Heading>
        <Divider mt="5" mb="5" />

        <ClientForm
          submitText="Update Client" // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          schema={Client}
          initialValues={client}
          onSubmit={async (values) => {
            try {
              const updated = await updateClientMutation({
                id: client.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(
                Routes.ShowClientPage({
                  clientId: updated.id,
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
    </>
  )
}

const EditClientPage = () => {
  return (
    <div>
      <Breadcrumb mb="8">
        <BreadcrumbItem>
          <Link href={Routes.ClientsPage()}>
            <BreadcrumbLink>Clients</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Edit Client</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Suspense fallback={<div>Loading...</div>}>
        <EditClient />
      </Suspense>
    </div>
  )
}

EditClientPage.authenticate = true

EditClientPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditClientPage
