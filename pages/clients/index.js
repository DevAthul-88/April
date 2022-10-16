import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import Layout from "app/core/layouts/Layout"
import getClients from "app/clients/queries/getClients"
import { useAuthorize } from "@blitzjs/auth"
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
import { FaPlus } from "react-icons/fa"
import { Country } from "country-state-city"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import Loader from "app/components/Loader"

const ITEMS_PER_PAGE = 10
export const ClientsList = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  useAuthorize()
  const page = Number(router.query.page) || 0
  const [{ clients, hasMore }] = usePaginatedQuery(getClients, {
    where: {
      userId: currentUser.id,
    },
    orderBy: {
      id: "asc",
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
  return (
    <div>
      <Flex mt="6">
        {" "}
        <Heading fontSize={"3xl"}>Your clients</Heading>
        <Spacer />
        <Link href={Routes.NewClientPage()}>
          <Button leftIcon={<FaPlus />} colorScheme="whatsapp">
            New Client
          </Button>
        </Link>
      </Flex>

      <Divider mt="5" mb="5" />
      <TableContainer>
        <Table variant="striped">
          <TableCaption>Your clients</TableCaption>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Gender</Th>
              <Th>Country</Th>
              <Th>View</Th>
            </Tr>
          </Thead>
          <Tbody>
            {clients.map((client) => (
              <Tr key={client.id}>
                <Td>{client.name}</Td>
                <Td>{client.email}</Td>
                <Td>{Gender(client.gender)}</Td>
                <Td>
                  {Country.getCountryByCode(client.country).name}{" "}
                  {Country.getCountryByCode(client.country).flag}
                </Td>
                <Td>
                  <Link href={`/clients/${client.id}`}>View Client</Link>
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

const ClientsPage = () => {
  return (
    <Layout>
      <Head>
        <title>April | Clients</title>
      </Head>

      <div>
        <Suspense fallback={<Loader />}>
          <ClientsList />
        </Suspense>
      </div>
    </Layout>
  )
}

export default ClientsPage
