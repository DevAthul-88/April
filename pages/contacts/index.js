import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import Layout from "app/core/layouts/Layout"
import getContacts from "app/contacts/queries/getContacts"
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
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useAuthorize } from "@blitzjs/auth"
import Loader from "app/components/Loader"

const ITEMS_PER_PAGE = 10
export const ContactsList = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  useAuthorize()
  const page = Number(router.query.page) || 0
  const [{ contacts, hasMore }] = usePaginatedQuery(getContacts, {
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
        <Heading fontSize={"3xl"}>Your contacts</Heading>
        <Spacer />
        <Link href={Routes.NewContactPage()}>
          <Button leftIcon={<FaPlus />} colorScheme="whatsapp">
            New Contact
          </Button>
        </Link>
      </Flex>

      <Divider mt="5" mb="5" />
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
            {contacts.map((contact) => (
              <Tr key={contact.id}>
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

      <Button colorScheme="whatsapp" disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </Button>
      <Button ml="2" colorScheme="whatsapp" disabled={!hasMore} onClick={goToNextPage}>
        Next
      </Button>
    </div>
  )
}

const ContactsPage = () => {
  return (
    <Layout>
      <Head>
        <title>April | Contacts</title>
      </Head>

      <div>
        <Suspense fallback={<Loader />}>
          <ContactsList />
        </Suspense>
      </div>
    </Layout>
  )
}

export default ContactsPage
