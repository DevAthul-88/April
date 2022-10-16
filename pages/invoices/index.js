import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import Layout from "app/core/layouts/Layout"
import getInvoices from "app/invoices/queries/getInvoices"
import { FaPlus } from "react-icons/fa"
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Heading,
  Divider,
  Button,
  Badge,
  Flex,
  Spacer,
  Box,
} from "@chakra-ui/react"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

const ITEMS_PER_PAGE = 10
export const InvoicesList = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  const page = Number(router.query.page) || 0
  const [{ invoices, hasMore }] = usePaginatedQuery(getInvoices, {
    orderBy: {
      id: "asc",
    },
    where: {
      userId: currentUser.id,
    },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () =>
    router.push({
      query: {
        page: page - 1,
      },
    })

  const goToNextPage = () =>
    router.push({
      query: {
        page: page + 1,
      },
    })

  function Status(args) {
    switch (args) {
      case "DRAFT":
        return (
          <Badge variant={"solid"} colorScheme="blackAlpha">
            Draft
          </Badge>
        )
        break
      case "PAID":
        return (
          <Badge variant={"solid"} colorScheme={"whatsapp"}>
            Paid
          </Badge>
        )
        break
      case "PENDING":
        return (
          <Badge variant={"solid"} colorScheme="whatsapp">
            Pending
          </Badge>
        )
        break
    }
  }
  return (
    <div>
      <Flex mt="6">
        <Heading fontSize={"3xl"}>Your invoice</Heading>
        <Spacer />
        <Link href={Routes.NewInvoicePage()}>
          <Button leftIcon={<FaPlus />} colorScheme="whatsapp">
            New Invoice
          </Button>
        </Link>
      </Flex>
      <Divider mt="5" mb="5" />
      <TableContainer>
        <Table variant="striped">
          <TableCaption>Your invoices</TableCaption>
          <Thead>
            <Tr>
              <Th>Invoice name</Th>
              <Th>Due date</Th>
              <Th>Status</Th>
              <Th>View</Th>
            </Tr>
          </Thead>
          <Tbody>
            {invoices.map((invoice) => (
              <Tr>
                <Td>{invoice.project}</Td>
                <Td>{invoice.due}</Td>
                <Td>{Status(invoice.status)}</Td>
                <Td>
                  <Link href={`/invoices/${invoice.id}`}>View invoice</Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Button colorScheme="whatsapp" disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </Button>
      <Button ml="2" colorScheme="whatsapp" disabled={!hasMore} onClick={goToNextPage}>
        Next
      </Button>
    </div>
  )
}

const InvoicesPage = () => {
  return (
    <Layout>
      <Head>
        <title>April | Invoice</title>
      </Head>

      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <InvoicesList />
        </Suspense>
      </div>
    </Layout>
  )
}

export default InvoicesPage
