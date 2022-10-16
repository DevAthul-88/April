import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import Layout from "app/core/layouts/Layout"
import getExpense from "app/expenses/queries/getExpense"
import deleteExpense from "app/expenses/mutations/deleteExpense"
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"
import { useAuthorize } from "@blitzjs/auth"
import {
  Box,
  Breadcrumb,
  Button,
  BreadcrumbItem,
  Divider,
  BreadcrumbLink,
  Heading,
  ListItem,
  UnorderedList,
  Link as A,
  Flex,
  Spacer,
  Text,
  Code,
  Badge,
} from "@chakra-ui/react"
import getSymbolFromCurrency from "currency-symbol-map"
import { Country } from "country-state-city"
import { ArrowRightIcon } from "@chakra-ui/icons"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import Loader from "app/components/Loader"

export const Expense = () => {
  const router = useRouter()
  const expenseId = useParam("expenseId")
  const currentUser = useCurrentUser()
  const [deleteExpenseMutation] = useMutation(deleteExpense)
  const [expense] = useQuery(getExpense, {
    id: expenseId,
  })
  useAuthorize()
  return (
    <>
      <Head>
        <title>April | {expense.name}</title>
      </Head>

      <Box rounded={"lg"} boxShadow={"lg"} p={8}>
        <Flex>
          <Heading fontSize={"2xl"}>{expense.name}</Heading>
          <Spacer />
          <>
            <Link
              href={Routes.EditExpensePage({
                expenseId: expense.id,
              })}
            >
              <Button colorScheme="whatsapp">Edit</Button>
            </Link>

            <Button
              colorScheme={"red"}
              type="button"
              onClick={async () => {
                if (window.confirm("This will be deleted")) {
                  await deleteExpenseMutation({
                    id: expense.id,
                  })
                  router.push(Routes.ExpensesPage())
                }
              }}
              style={{
                marginLeft: "0.5rem",
              }}
            >
              Delete
            </Button>
          </>
        </Flex>{" "}
        <Tabs mt="5" mb="5" colorScheme={"whatsapp"}>
          <TabList>
            <Tab>Details</Tab>
            <Tab>Activity</Tab>
            <Tab>Project</Tab>
            <Tab>Client</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <UnorderedList mb="5" spacing="2" size="2xl">
                <ListItem fontSize="lg">Name: {expense.name}</ListItem>
                <ListItem fontSize="lg">
                  Amount:{" "}
                  <Text color="red" as="span">
                    -{getSymbolFromCurrency(Country.getCountryByCode(expense.currency).currency)}
                    {expense.amount}
                  </Text>
                </ListItem>
                <ListItem fontSize="lg">
                  Note:{" "}
                  <Text as="span" fontStyle="italic" fontWeight="bold">
                    {expense.note}
                  </Text>
                </ListItem>
                <ListItem fontSize="lg">
                  Paid?:{" "}
                  <Badge fontSize="md" colorScheme="red">
                    {expense.paid == true ? "Paid" : "Not paid"}
                  </Badge>
                </ListItem>
                <ListItem fontSize="lg">
                  Should invoice:{" "}
                  <Badge fontSize="md" colorScheme="whatsapp">
                    {expense.should == true ? "YES" : "NO"}
                  </Badge>
                </ListItem>
                <ListItem fontSize="lg">
                  Date:{" "}
                  <Badge fontSize="md" colorScheme="whatsapp">
                    {expense.date}
                  </Badge>
                </ListItem>
              </UnorderedList>
            </TabPanel>
            <TabPanel>
              <Code colorScheme={"whatsapp"}>
                <Text>
                  {currentUser.email} created expense {expense.name}
                </Text>
                <span>{JSON.stringify(expense.createdAt)}</span>
              </Code>
              <Divider mt="5" mb="5" />
              <Code colorScheme={"whatsapp"}>
                <Text>
                  {currentUser.email} updated expense {expense.name} at
                </Text>
                <span>{JSON.stringify(expense.updatedAt)}</span>
              </Code>
            </TabPanel>
            <TabPanel>
              <Link href={`/projects/${expense.project}`}>
                <Button colorScheme="whatsapp" variant="link">
                  View project
                </Button>
              </Link>
              <Text mt="4" fontStyle={"italic"}>
                View the project which is belongs to this expense.
              </Text>
            </TabPanel>
            <TabPanel>
              <Link href={`/clients/${expense.client}`}>
                <Button colorScheme="whatsapp" variant={"link"}>
                  View client
                </Button>
              </Link>
              <Text mt="4" fontStyle={"italic"}>
                View the client which is belongs to this expense.
              </Text>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  )
}

const ShowExpensePage = () => {
  return (
    <div>
      <Breadcrumb mb="8">
        <BreadcrumbItem>
          <Link href={Routes.ExpensesPage()}>
            <BreadcrumbLink>Expenses</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>View Expense</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Suspense fallback={<Loader />}>
        <Expense />
      </Suspense>
    </div>
  )
}

ShowExpensePage.authenticate = true

ShowExpensePage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowExpensePage
