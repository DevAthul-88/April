import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Layout from "app/core/layouts/Layout"
import { Box, Breadcrumb, BreadcrumbItem, Divider, BreadcrumbLink, Heading } from "@chakra-ui/react"
import createPayment from "app/payments/mutations/createPayment"
import { PaymentForm, FORM_ERROR } from "app/payments/components/PaymentForm"
import { Payment } from "app/auth/validations"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useAuthorize } from "@blitzjs/auth"
const NewPaymentPage = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()

  const [createPaymentMutation] = useMutation(createPayment)
  useAuthorize()
  return (
    <Layout title={"Create New Payment"}>
      <Breadcrumb mb="8">
        <BreadcrumbItem>
          <Link href={Routes.PaymentsPage()}>
            <BreadcrumbLink>Payment</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <Link href={Routes.NewPaymentPage()}>
            <BreadcrumbLink>Add Payment</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>
      </Breadcrumb>
      <Box rounded={"lg"} boxShadow={"lg"} p={8}>
        <Heading fontSize={"2xl"}>Add Payment</Heading>
        <Divider mt="5" mb="5" />
        <PaymentForm
          submitText="Create Payment" // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          schema={Payment}
          initialValues={{
            userId: currentUser.id,
            date: null,
            method: null,
            invoiceId: router.query.invoice_id,
            amount: null,
            ref: null,
          }}
          onSubmit={async (values) => {
            try {
              const payment = await createPaymentMutation(values)
              router.push(Routes.PaymentsPage())
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

NewPaymentPage.authenticate = true
export default NewPaymentPage
