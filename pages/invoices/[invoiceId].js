import { Suspense, useCallback } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import Layout from "app/core/layouts/Layout"
import getInvoice from "app/invoices/queries/getInvoice"
import deleteInvoice from "app/invoices/mutations/deleteInvoice"
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer"
import {
  Box,
  Breadcrumb,
  Button,
  BreadcrumbItem,
  Divider,
  BreadcrumbLink,
  Heading,
  Link as A,
  Flex,
  Spacer,
} from "@chakra-ui/react"
import getClient from "app/clients/queries/getClient"
import Pdf from "app/components/Pdf"
import markIn from "app/invoices/mutations/markIn"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useAuthorize } from "@blitzjs/auth"
import Loader from "app/components/Loader"
export const Invoice = () => {
  const router = useRouter()
  const invoiceId = useParam("invoiceId")
  const [deleteInvoiceMutation] = useMutation(deleteInvoice)
  const [markInvoiceMutation] = useMutation(markIn)

  const [invoice] = useQuery(getInvoice, {
    id: invoiceId,
  })
  const [client] = useQuery(getClient, {
    id: invoice.client,
  })

  return (
    <>
      <Head>
        <title>April | Invoice {invoice.name}</title>
      </Head>

      <Box rounded={"lg"} boxShadow={"lg"} p={8}>
        <Flex>
          <Heading fontSize={"2xl"}>{invoice.project}</Heading>
          <Spacer />
          {invoice.status == "DRAFT" && (
            <Button
              style={{
                marginRight: "0.5rem",
              }}
              colorScheme="whatsapp"
              onClick={async () => {
                await markInvoiceMutation({
                  id: invoice.id,
                })
                router.push(Routes.InvoicesPage())
              }}
            >
              Mark it as send
            </Button>
          )}
          {invoice.status == "PENDING" && (
            <Link
              href={Routes.NewPaymentPage({
                invoice_id: invoice.id,
              })}
            >
              <Button
                style={{
                  marginRight: "0.5rem",
                }}
                colorScheme="whatsapp"
              >
                Add payment
              </Button>
            </Link>
          )}
          <Button
            colorScheme={"whatsapp"}
            style={{
              marginRight: "0.5rem",
            }}
          >
            <PDFDownloadLink
              document={<Pdf invoicedata={invoice} client={client} />}
              fileName={"invoice.pdf"}
            >
              {({ blob, url, loading, error }) => (loading ? "Loading..." : "Download invoice")}
            </PDFDownloadLink>
          </Button>
          <Link
            href={Routes.EditInvoicePage({
              invoiceId: invoice.id,
            })}
          >
            <Button colorScheme="whatsapp">Edit</Button>
          </Link>

          <Button
            colorScheme="red"
            type="button"
            onClick={async () => {
              if (window.confirm("This will be deleted")) {
                await deleteInvoiceMutation({
                  id: invoice.id,
                })
                router.push(Routes.InvoicesPage())
              }
            }}
            style={{
              marginLeft: "0.5rem",
            }}
          >
            Delete
          </Button>
        </Flex>
        <Divider mt="5" mb="5" />
        <PDFViewer height={500} showToolbar={false}>
          <Pdf invoicedata={invoice} client={client} />
        </PDFViewer>
      </Box>
    </>
  )
}

const ShowInvoicePage = () => {
  return (
    <div>
      <Breadcrumb mb="8">
        <BreadcrumbItem>
          <Link href={Routes.InvoicesPage()}>
            <BreadcrumbLink>Invoices</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>View Invoice</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Suspense fallback={<Loader />}>
        <Invoice />
      </Suspense>
    </div>
  )
}

ShowInvoicePage.authenticate = true

ShowInvoicePage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowInvoicePage
