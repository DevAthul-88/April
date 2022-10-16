import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery, useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import Layout from "app/core/layouts/Layout"
import Loader from "app/components/Loader"
import { Heading, Divider, Spacer, Flex, Box, Center, Text } from "@chakra-ui/react"
import getInvoices from "app/invoices/queries/getInvoices"
import {
  FaMoneyBill,
  FaUserFriends,
  FaUser,
  FaMoneyCheck,
  FaWrench,
  FaInbox,
  FaMailBulk,
  FaDollarSign,
} from "react-icons/fa"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import getProjects from "app/projects/queries/getProjects"
import getClients from "app/clients/queries/getClients"
import getContacts from "app/contacts/queries/getContacts"
import { FiBox } from "react-icons/fi"
import getMails from "app/mail/queries/getMails"
import { List, ListItem, ListIcon, OrderedList, UnorderedList } from "@chakra-ui/react"
import getPayments from "app/payments/queries/getPayments"
import getExpenses from "app/expenses/queries/getExpenses"
import { useAuthorize } from "@blitzjs/auth"

const AppsPage = () => {
  useAuthorize()
  function Items() {
    const currentUser = useCurrentUser()
    const [{ invoices }] = useQuery(getInvoices, {
      where: {
        userId: currentUser.id,
      },
    })
    const [{ projects }] = useQuery(getProjects, {
      where: {
        userId: currentUser.id,
      },
    })
    const [{ clients }] = useQuery(getClients, {
      where: {
        userId: currentUser.id,
      },
    })
    const [{ contacts }] = useQuery(getContacts, {
      where: {
        userId: currentUser.id,
      },
    })
    const [{ mails }] = useQuery(getMails, {
      where: {
        client: currentUser.id,
      },
    })
    const [{ payments }] = useQuery(getPayments, {
      where: {
        userId: currentUser.id,
      },
    })
    const [{ expenses }] = useQuery(getExpenses, {
      where: {
        userId: currentUser.id,
      },
    })

    return (
      <>
        <Flex gap="5px">
          <Box border="2px" borderColor={"whatsapp"} flex="1" rounded={"lg"} boxShadow={"lg"} p={8}>
            <Flex>
              <Text textTransform={"uppercase"} color="gray.600">
                Invoices
              </Text>
              <Spacer />
              <FaMoneyBill fontSize="1.5rem" />
            </Flex>
            <Heading mt="2">{invoices.length}</Heading>
            <Divider mt="4" mb="4" />
            <Link href={Routes.InvoicesPage()}>View Invoices</Link>
          </Box>

          <Box border="2px" borderColor={"whatsapp"} flex="1" rounded={"lg"} boxShadow={"lg"} p={8}>
            <Flex>
              <Text textTransform={"uppercase"} color="gray.600">
                Projects
              </Text>
              <Spacer />
              <FiBox fontSize="1.5rem" />
            </Flex>
            <Heading mt="2">{projects.length}</Heading>
            <Divider mt="4" mb="4" />
            <Link href={Routes.ProjectsPage()}>View Projects</Link>
          </Box>

          <Box border="2px" borderColor={"whatsapp"} flex="1" rounded={"lg"} boxShadow={"lg"} p={8}>
            <Flex>
              <Text textTransform={"uppercase"} color="gray.600">
                Clients
              </Text>
              <Spacer />
              <FaUser fontSize="1.5rem" />
            </Flex>
            <Heading mt="2">{clients.length}</Heading>
            <Divider mt="4" mb="4" />
            <Link href={Routes.ClientsPage()}>View Clients</Link>
          </Box>

          <Box border="2px" borderColor={"whatsapp"} flex="1" rounded={"lg"} boxShadow={"lg"} p={8}>
            <Flex>
              <Text textTransform={"uppercase"} color="gray.600">
                Contacts
              </Text>
              <Spacer />
              <FaUserFriends fontSize="1.5rem" />
            </Flex>
            <Heading mt="2">{contacts.length}</Heading>
            <Divider mt="4" mb="4" />
            <Link href={Routes.ContactsPage()}>View Contacts</Link>
          </Box>
        </Flex>
        <Flex gap="5px">
          <Box
            border="2px"
            mt="4"
            borderColor={"whatsapp"}
            flex="2"
            rounded={"lg"}
            boxShadow={"lg"}
            p={8}
          >
            <Flex>
              <Box flex="1">
                <Flex>
                  <Text textTransform={"uppercase"} color="gray.600">
                    Payments
                  </Text>
                  <Spacer />
                  <FaDollarSign fontSize="1.5rem" />
                </Flex>
                <Heading mt="2" color="green" fontWeight="bold">
                  +
                  {payments.length == 1 ? (
                    <>
                      {payments.map((a, index) => {
                        return <span key={index}>{a.amount}</span>
                      })}
                    </>
                  ) : (
                    <>
                      {payments.reduce((a, b) => {
                        return a.amount + b.amount
                      })}
                    </>
                  )}
                </Heading>
                <Divider mt="4" mb="4" />
                <Link href={Routes.PaymentsPage()}>View Payments</Link>
              </Box>
              <Spacer />
              <Center height="100px">
                <Divider color="red.100" orientation="vertical" />
              </Center>
              <Spacer />
              <Box flex="1">
                <Flex>
                  <Text textTransform={"uppercase"} color="gray.600">
                    Expenses
                  </Text>
                  <Spacer />
                  <FaMoneyCheck fontSize="1.5rem" />
                </Flex>
                <Heading mt="2" color="red" fontWeight="bold">
                  -
                  {expenses.length == 1 ? (
                    <>
                      {expenses.map((a, index) => {
                        return <span key={index}>{a.amount}</span>
                      })}
                    </>
                  ) : (
                    <>
                      {expenses.reduce((a, b) => {
                        return a.amount + b.amount
                      })}
                    </>
                  )}
                </Heading>
                <Divider mt="4" mb="4" />
                <Link href={Routes.ExpensesPage()}>View Expenses</Link>
              </Box>
            </Flex>
          </Box>
          <Box
            border="2px"
            mt="4"
            borderColor={"whatsapp"}
            flex="1"
            rounded={"lg"}
            boxShadow={"lg"}
            p={8}
          >
            <Flex>
              <Text textTransform={"uppercase"} color="gray.600">
                Latest Mails
              </Text>
              <Spacer />
              <FaMailBulk fontSize="1.5rem" />
            </Flex>

            {mails ? (
              <>
                <OrderedList mt="4">
                  <ListItem>Lorem ipsum dolor sit amet</ListItem>
                </OrderedList>
              </>
            ) : (
              <Text mt="4" color="gray.600" textAlign="center">
                No mails
              </Text>
            )}
          </Box>
        </Flex>
      </>
    )
  }

  return (
    <Layout>
      <Head>
        <title>April | Dashboard</title>
      </Head>

      <div>
        <Heading fontSize={"3xl"}>Dashboard</Heading>
        <Divider mt="5" mb="5" />

        <Suspense fallback={<Loader />}>
          <Items />
        </Suspense>
      </div>
    </Layout>
  )
}

export default AppsPage
