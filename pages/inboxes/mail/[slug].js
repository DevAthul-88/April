import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import Layout from "app/core/layouts/Layout"
import getMail from "app/mail/queries/getMail"
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"
import ReactMarkdown from "react-markdown"
import {
  Box,
  Breadcrumb,
  Button,
  BreadcrumbItem,
  Divider,
  BreadcrumbLink,
  Badge,
  Heading,
  Link as A,
  Flex,
  Code,
  Spacer,
  Text,
} from "@chakra-ui/react"
import * as timeago from "timeago.js"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import markMail from "app/inboxes/mutations/mark"
import { useAuthorize } from "@blitzjs/auth"
import Loader from "app/components/Loader"

export const Mail = () => {
  const router = useRouter()
  const mailId = useParam("slug")
  const [markMailMutation] = useMutation(markMail)
  const [mail] = useQuery(getMail, {
    id: mailId,
  })
  const currentUser = useCurrentUser()
  useAuthorize()
  return (
    <>
      <Head>
        <title>April | {mail.name}</title>
      </Head>

      <Box rounded={"lg"} boxShadow={"lg"} p={8}>
        <Flex>
          <Heading fontSize={"2xl"}>{mail.name}</Heading>
          <Spacer />
          <>
            {!mail.seen && (
              <Button
                colorScheme={"whatsapp"}
                type="button"
                onClick={async () => {
                  await markMailMutation({
                    id: mail.id,
                  })
                  router.push(Routes.InboxesPage())
                }}
                style={{
                  marginLeft: "0.5rem",
                }}
              >
                Mark as seen
              </Button>
            )}
          </>
        </Flex>

        <Tabs mt="5" mb="5" colorScheme={"whatsapp"}>
          <TabList>
            <Tab>Details</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Flex>
                <Text fontWeight="bold">Mail name:</Text>

                <Text ml="4">{mail.name}</Text>
                <Spacer />
                <Text fontWeight="bold">Sended At:</Text>

                <Text ml="4">{timeago.format(mail.createdAt)}</Text>
              </Flex>
              <Divider mt="5" mb="5" />
              <Flex>
                <Text fontWeight="bold">Mail content:</Text>

                <Text ml="4">
                  <ReactMarkdown>{mail.note}</ReactMarkdown>
                </Text>
              </Flex>
              <Divider mt="5" mb="5" />
              <Flex>
                <Text fontWeight="bold">Sended By:</Text>

                <Text ml="4">
                  <A href={`mailto:${mail.sender}`} color="whatsapp.500">
                    {mail.sender}
                  </A>
                </Text>
                <Spacer />
                <Flex>
                  <Text fontWeight="bold">Status:</Text>
                  <Text ml="4">
                    {mail.seen ? (
                      <Badge variant={"solid"} colorScheme="green">
                        Seen
                      </Badge>
                    ) : (
                      <Badge variant={"solid"} colorScheme="red">
                        Not seen
                      </Badge>
                    )}
                  </Text>
                </Flex>
              </Flex>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  )
}

const ShowMailPage = () => {
  return (
    <div>
      <Breadcrumb mb="8">
        <BreadcrumbItem>
          <Link href={Routes.MailPage()}>
            <BreadcrumbLink>Inbox</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>View Mail</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Suspense fallback={<Loader />}>
        <Mail />
      </Suspense>
    </div>
  )
}

ShowMailPage.authenticate = true

ShowMailPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowMailPage
