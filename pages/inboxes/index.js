import { Suspense, forwardRef } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import Layout from "app/core/layouts/Layout"
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useTab,
  useMultiStyleConfig,
} from "@chakra-ui/react"
import getMails from "app/mail/queries/getMails"
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

const ITEMS_PER_PAGE = 10
export const InboxesList = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  const page = Number(router.query.page) || 0
  const [{ mail, hasMore }] = usePaginatedQuery(getMails, {
    orderBy: {
      id: "asc",
    },
    where: {
      client: currentUser.email,
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
  const CustomTab1 = forwardRef((props, ref) => {
    // 1. Reuse the `useTab` hook
    const tabProps = useTab({ ...props, ref })
    const styles = useMultiStyleConfig("Tabs", tabProps)

    return (
      <Button __css={styles.tab} {...tabProps}>
        {tabProps.children}
        <Box as="span" ml="2" color="red">
          {mail.length}
        </Box>
      </Button>
    )
  })

  return (
    <div>
      <Flex mt="6">
        <Heading fontSize={"3xl"}>Your inbox</Heading>
      </Flex>
      <Divider mt="5" mb="5" />
      <Tabs mt="5" mb="5" colorScheme={"whatsapp"}>
        <TabList>
          <CustomTab1>Mails</CustomTab1>
        </TabList>
        <TabPanels>
          <TabPanel>
            <TableContainer>
              <Table variant="striped">
                <TableCaption>Your inbox</TableCaption>
                <Thead>
                  <Tr>
                    <Th>Mail name</Th>
                    <Th>Created</Th>
                    <Th>Seen?</Th>
                    <Th>Sended By</Th>
                    <Th>View</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {mail.map((m) => (
                    <Tr>
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
                      <Td>{m.sender}</Td>
                      <Td>
                        <Link href={`/inboxes/mail/${m.id}`}>View mail</Link>
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
          </TabPanel>
          <TabPanel></TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  )
}

const InboxesPage = () => {
  return (
    <Layout>
      <Head>
        <title>April | Inboxes</title>
      </Head>

      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <InboxesList />
        </Suspense>
      </div>
    </Layout>
  )
}

export default InboxesPage
