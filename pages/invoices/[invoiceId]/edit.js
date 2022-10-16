import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import Layout from "app/core/layouts/Layout"
import getInvoice from "app/invoices/queries/getInvoice"
import updateInvoice from "app/invoices/mutations/updateInvoice"
import { InvoiceForm, FORM_ERROR } from "app/invoices/components/InvoiceForm"
import { Box, Breadcrumb, BreadcrumbItem, Divider, BreadcrumbLink, Heading } from "@chakra-ui/react"

export const EditInvoice = () => {
  const router = useRouter()
  const invoiceId = useParam("invoiceId")
  const [invoice, { setQueryData }] = useQuery(
    getInvoice,
    {
      id: invoiceId,
    },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateInvoiceMutation] = useMutation(updateInvoice)
  return (
    <>
      <Head>
        <title>April | Edit Invoice {invoice.name}</title>
      </Head>

      <Box rounded={"lg"} boxShadow={"lg"} p={8}>
        <Heading fontSize={"2xl"}>Edit {invoice.name}</Heading>
        <Divider mt="5" mb="5" />

        <InvoiceForm
          submitText="Update Invoice" // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateInvoice}
          initialValues={invoice}
          onSubmit={async (values) => {
            try {
              const updated = await updateInvoiceMutation({
                id: invoice.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(
                Routes.ShowInvoicePage({
                  invoiceId: updated.id,
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

const EditInvoicePage = () => {
  return (
    <div>
      <Breadcrumb mb="8">
        <BreadcrumbItem>
          <Link href={Routes.InvoicesPage()}>
            <BreadcrumbLink>Invoices</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Edit Invoice</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Suspense fallback={<div>Loading...</div>}>
        <EditInvoice />
      </Suspense>
    </div>
  )
}

EditInvoicePage.authenticate = true

EditInvoicePage.getLayout = (page) => <Layout>{page}</Layout>

export default EditInvoicePage
