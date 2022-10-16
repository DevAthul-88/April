import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import Layout from "app/core/layouts/Layout"
import getMails from "app/mail/queries/getMails"
import { FaPlus } from "react-icons/fa"
import * as timeago from "timeago.js"

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
import { useAuthorize } from "@blitzjs/auth"
import Loader from "app/components/Loader"
const ITEMS_PER_PAGE = 10
export const MailList = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  const page = Number(router.query.page) || 0
  const [{ mail, hasMore }] = usePaginatedQuery(getMails, {
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
        <Heading fontSize={"3xl"}>Created mails</Heading>
        <Spacer />
        <Link href={Routes.NewMailPage()}>
          <Button leftIcon={<FaPlus />} colorScheme="whatsapp">
            New mail
          </Button>
        </Link>
      </Flex>
      <Divider mt="5" mb="5" />
      <TableContainer>
        <Table variant="striped">
          <TableCaption>Your created mails</TableCaption>
          <Thead>
            <Tr>
              <Th>Mail name</Th>
              <Th>Created</Th>
              <Th>Seen?</Th>
              <Th>Sended To</Th>
              <Th>View</Th>
            </Tr>
          </Thead>
          <Tbody>
            {mail.map((m) => (
              <Tr key={m.id}>
                <Td>{m.name}</Td>
                <Td>{timeago.format(m.createdAt)}</Td>
                <Td>
                  {m.seen ? (
                    <Badge variant={"solid"} colorScheme="green">
                      Seen
                    </Badge>
                  ) : (
                    <Badge variant={"solid"} colorScheme="red">
                      Not seen
                    </Badge>
                  )}
                </Td>
                <Td>{m.client}</Td>
                <Td>
                  <Link href={`/mail/${m.id}`}>View mail</Link>
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

const MailPage = () => {
  return (
    <Layout>
      <Head>
        <title>April | Mail</title>
      </Head>

      <div>
        <Suspense fallback={<Loader />}>
          <MailList />
        </Suspense>
      </div>
    </Layout>
  )
}

export default MailPage
