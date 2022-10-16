import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation, usePaginatedQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import Layout from "app/core/layouts/Layout"
import getClient from "app/clients/queries/getClient"
import deleteClient from "app/clients/mutations/deleteClient"
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
  HStack,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Badge,
  Code,
} from "@chakra-ui/react"
import { Country } from "country-state-city"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import getInvoices from "app/invoices/queries/getInvoices"
import getContacts from "app/contacts/queries/getContacts"
import getExpenses from "app/expenses/queries/getExpenses"
import getSymbolFromCurrency from "currency-symbol-map"
import Loader from "app/components/Loader"

export const Client = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  useAuthorize()
  const clientId = useParam("clientId")
  const [deleteClientMutation] = useMutation(deleteClient)
  const [client] = useQuery(getClient, {
    id: clientId,
  })

  const [{ invoices }] = usePaginatedQuery(getInvoices, {
    orderBy: {
      id: "asc",
    },
    where: {
      client: clientId,
    },
  })
  const [{ contacts }] = usePaginatedQuery(getContacts, {
    orderBy: {
      id: "asc",
    },
    where: {
      client: clientId,
    },
  })
  const [{ expenses }] = usePaginatedQuery(getExpenses, {
    orderBy: {
      id: "asc",
    },
    where: {
      client: clientId,
    },
  })

  function Gender(args) {
    switch (args) {
      case "male":
        return (
          <Badge variant={"solid"} colorScheme={"whatsapp"}>
            Male
          </Badge>
        )
        break
      case "female":
        return (
          <Badge variant={"solid"} colorScheme={"whatsapp"}>
            Female
          </Badge>
        )
        break
      case "not":
        return (
          <Badge variant={"solid"} colorScheme="red">
            Not to say
          </Badge>
        )
        break
    }
  }
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
    <>
      <Head>
        <title>April | {client.name}</title>
      </Head>

      <Box rounded={"lg"} boxShadow={"lg"} p={8}>
        <Flex>
          <Heading fontSize={"2xl"}>{client.name}</Heading>
          <Spacer />
          <>
            <Link
              href={Routes.EditClientPage({
                clientId: client.id,
              })}
            >
              <Button colorScheme="whatsapp">Edit</Button>
            </Link>

            <Button
              colorScheme={"red"}
              type="button"
              onClick={async () => {
                if (window.confirm("This will be deleted")) {
                  await deleteClientMutation({
                    id: client.id,
                  })
                  router.push(Routes.ClientsPage())
                }
              }}
              style={{
                marginLeft: "0.5rem",
              }}
            >
              Delete
            </Button>
          </>
        </Flex>

        <Tabs mt="5" mb="5" colorScheme={"whatsapp"}>
          <TabList>
            <Tab>Details</Tab>
            <Tab>Activity</Tab>
            <Tab>Invoices</Tab>
            <Tab>Contacts</Tab>
            <Tab>Expense</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <UnorderedList mt="8" mb="5" spacing="2" size="2xl">
                <ListItem fontSize="lg">Name: {client.name}</ListItem>

                <ListItem fontSize="lg">
                  Email:{" "}
                  <A color="whatsapp.600" href={`mailto:${client.email}`}>
                    {client.email}
                  </A>
                </ListItem>

                <ListItem fontSize="lg">
                  Note:{" "}
                  <Text fontWeight={"bold"} as="span" fontStyle="italic">
                    {client.note}
                  </Text>
                </ListItem>
                <ListItem fontSize="lg" textTransform={"capitalize"}>
                  Gender: {client.gender}
                </ListItem>
                <ListItem fontSize="lg">
                  Country: {Country.getCountryByCode(client.country).name}{" "}
                  {Country.getCountryByCode(client.country).flag}
                </ListItem>
                <ListItem fontSize="lg">
                  Website:{" "}
                  {client.website ? (
                    <A href={client.website} color="whatsapp" target="_blank">
                      {client.website}
                    </A>
                  ) : (
                    "Not specified"
                  )}
                </ListItem>
                <ListItem fontSize="lg">
                  Phone: {client.phone ? client.phone : "Not specified"}
                </ListItem>
                <ListItem fontSize="lg">
                  Company: {client.company ? client.company : "Not specified"}
                </ListItem>
                <ListItem fontSize="lg">
                  Address: {client.address ? client.address : "Not specified"}
                </ListItem>
              </UnorderedList>
            </TabPanel>

            <TabPanel>
              <Code colorScheme={"whatsapp"}>
                <Text>
                  {currentUser.email} created client {client.name}
                </Text>
                <span>{JSON.stringify(client.createdAt)}</span>
              </Code>
              <Divider mt="5" mb="5" />
              <Code colorScheme={"whatsapp"}>
                <Text>
                  {currentUser.email} updated client {client.name} at
                </Text>
                <span>{JSON.stringify(client.updatedAt)}</span>
              </Code>
            </TabPanel>

            <TabPanel>
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
                    {invoices.map((invoice, index) => (
                      <Tr key={index}>
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
              <Text mt="4" fontStyle={"italic"}>
                View the invoices which is belongs to this client.
              </Text>
            </TabPanel>
            <TabPanel>
              <TableContainer>
                <Table variant="striped">
                  <TableCaption>Your contacts</TableCaption>
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Email</Th>
                      <Th>Gender</Th>
                      <Th>View</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {contacts.map((contact, index) => (
                      <Tr key={index}>
                        <Td>{contact.name}</Td>
                        <Td>{contact.email}</Td>
                        <Td>{Gender(contact.gender)}</Td>
                        <Td>
                          <Link href={`/contacts/${contact.id}`}>View Contact</Link>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
              <Text mt="4" fontStyle={"italic"}>
                View the contacts which is belongs to this client.
              </Text>
            </TabPanel>

            <TabPanel>
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
                      <Tr key={expense.id}>
                        <Td>{expense.name}</Td>
                        <Td>{expense.date}</Td>
                        <Td>
                          {getSymbolFromCurrency(
                            Country.getCountryByCode(expense.currency).currency
                          )}{" "}
                          {expense.amount}
                        </Td>
                        <Td>
                          <Link href={`/expenses/${expense.id}`}>View invoice</Link>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
              <Text mt="4" fontStyle={"italic"}>
                View the expenses which is belongs to this client.
              </Text>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  )
}

const ShowClientPage = () => {
  return (
    <div>
      <Breadcrumb mb="8">
        <BreadcrumbItem>
          <Link href={Routes.ClientsPage()}>
            <BreadcrumbLink>Clients</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>View Client</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Suspense fallback={<Loader />}>
        <Client />
      </Suspense>
    </div>
  )
}

ShowClientPage.authenticate = true

ShowClientPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowClientPage
