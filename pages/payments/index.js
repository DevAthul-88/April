import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import Layout from "app/core/layouts/Layout"
import getPayments from "app/payments/queries/getPayments"
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
  Text,
  Box,
} from "@chakra-ui/react"
import getSymbolFromCurrency from "currency-symbol-map"
import { Country } from "country-state-city"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useAuthorize } from "@blitzjs/auth"
import Loader from "app/components/Loader"
const ITEMS_PER_PAGE = 10
export const PaymentsList = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  const page = Number(router.query.page) || 0
  const [{ payments, hasMore }] = usePaginatedQuery(getPayments, {
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
  useAuthorize()
  return (
    <div>
      <Flex mt="6">
        <Heading fontSize={"3xl"}>Payments</Heading>
      </Flex>
      <Divider mt="5" mb="5" />
      <TableContainer>
        <Table variant="striped">
          <TableCaption>Payments</TableCaption>
          <Thead>
            <Tr>
              <Th>Payment date</Th>
              <Th>Payment method</Th>
              <Th>Invoice</Th>
              <Th>Reference</Th>
              <Th>Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {payments.map((m) => (
              <Tr key={m.id}>
                <Td>{m.date}</Td>
                <Td>{m.method}</Td>
                <Td color={"whatsapp"}>
                  <Text color="whatsapp.500">
                    <Link href={`/invoices/${m.invoiceId}`}>Invoice</Link>
                  </Text>
                </Td>
                <Td>{m.ref}</Td>
                <Td>
                  <Text color="green">
                    +{getSymbolFromCurrency(Country.getCountryByCode(m.currency).currency)}
                    {m.amount}
                  </Text>
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

const PaymentsPage = () => {
  return (
    <Layout>
      <Head>
        <title>April | Payments</title>
      </Head>

      <div>
        <Suspense fallback={<Loader />}>
          <PaymentsList />
        </Suspense>
      </div>
    </Layout>
  )
}

export default PaymentsPage
