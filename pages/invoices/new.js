import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Layout from "app/core/layouts/Layout"
import createInvoice from "app/invoices/mutations/createInvoice"
import { InvoiceForm, FORM_ERROR } from "app/invoices/components/InvoiceForm"
import { Box, Breadcrumb, BreadcrumbItem, Divider, BreadcrumbLink, Heading } from "@chakra-ui/react"
import { Invoice } from "app/auth/validations"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useAuthorize } from "@blitzjs/auth"
const NewInvoicePage = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  const [createInvoiceMutation] = useMutation(createInvoice)
  useAuthorize()
  return (
    <Layout title={"April | Create New Invoice"}>
      <Breadcrumb mb="8">
        <BreadcrumbItem>
          <Link href={Routes.InvoicesPage()}>
            <BreadcrumbLink>Invoice</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <Link href={Routes.NewInvoicePage()}>
            <BreadcrumbLink>New Invoice</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>
      </Breadcrumb>
      <Box rounded={"lg"} boxShadow={"lg"} p={8}>
        <Heading fontSize={"2xl"}>New Invoice</Heading>
        <Divider mt="5" mb="5" />
        <InvoiceForm
          submitText="Create Invoice"
          schema={Invoice}
          initialValues={{
            project: null,
            client: null,
            note: null,
            userId: currentUser.id,
            issue: null,
            due: null,
            tax: null,
            discount: null,
            note: null,
            currency: null,
            meta: null,
          }}
          onSubmit={async (values) => {
            try {
              const invoice = await createInvoiceMutation(values)
              router.push(
                Routes.ShowInvoicePage({
                  invoiceId: invoice.id,
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

NewInvoicePage.authenticate = true
export default NewInvoicePage
