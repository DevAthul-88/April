import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import Layout from "app/core/layouts/Layout"
import getExpenses from "app/expenses/queries/getExpenses"
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
import getSymbolFromCurrency from "currency-symbol-map"
import { Country } from "country-state-city"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

const ITEMS_PER_PAGE = 10
export const ExpensesList = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  const page = Number(router.query.page) || 0
  const [{ expenses, hasMore }] = usePaginatedQuery(getExpenses, {
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

  return (
    <div>
      <Flex mt="6">
        <Heading fontSize={"3xl"}>Your expenses</Heading>
        <Spacer />
        <Link href={Routes.NewExpensePage()}>
          <Button leftIcon={<FaPlus />} colorScheme="whatsapp">
            New Expenses
          </Button>
        </Link>
      </Flex>
      <Divider mt="5" mb="5" />

      <TableContainer>
        <Table variant="striped">
          <TableCaption>Your expenses</TableCaption>
          <Thead>
            <Tr>
              <Th>Expense name</Th>
              <Th>Date</Th>
              <Th>Amount</Th>
              <Th>View</Th>
            </Tr>
          </Thead>
          <Tbody>
            {expenses.map((expense) => (
              <Tr>
                <Td>{expense.name}</Td>
                <Td>{expense.date}</Td>
                <Td color={"red"}>
                  -{getSymbolFromCurrency(Country.getCountryByCode(expense.currency).currency)}
                  {expense.amount}
                </Td>
                <Td>
                  <Link href={`/expenses/${expense.id}`}>View expense</Link>
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

const ExpensesPage = () => {
  return (
    <Layout>
      <Head>
        <title>April | Expenses</title>
      </Head>

      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <ExpensesList />
        </Suspense>
      </div>
    </Layout>
  )
}

export default ExpensesPage
