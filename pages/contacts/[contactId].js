import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import Layout from "app/core/layouts/Layout"
import getContact from "app/contacts/queries/getContact"
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"
import deleteContact from "app/contacts/mutations/deleteContact"
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
  Code,
  Text,
  Spacer,
} from "@chakra-ui/react"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

export const Contact = () => {
  const router = useRouter()
  const contactId = useParam("contactId")
  const [deleteContactMutation] = useMutation(deleteContact)
  const currentUser = useCurrentUser()
  const [contact] = useQuery(getContact, {
    id: contactId,
  })
  return (
    <>
      <Head>
        <title>April | {contact.name}</title>
      </Head>
      <Box rounded={"lg"} boxShadow={"lg"} p={8}>
        <Flex>
          <Heading fontSize={"2xl"}>{contact.name}</Heading>
          <Spacer />
          <>
            <Link
              href={Routes.EditContactPage({
                contactId: contact.id,
              })}
            >
              <Button colorScheme="whatsapp">Edit</Button>
            </Link>

            <Button
              colorScheme={"red"}
              type="button"
              onClick={async () => {
                if (window.confirm("This will be deleted")) {
                  await deleteContactMutation({
                    id: contact.id,
                  })
                  router.push(Routes.ContactsPage())
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
          </TabList>
          <TabPanels>
            <TabPanel>
              <UnorderedList mb="5" spacing="2" size="2xl">
                <ListItem fontSize="lg">Name: {contact.name}</ListItem>
                <ListItem fontSize="lg">
                  Email:{" "}
                  <A color="whatsapp.600" href={`mailto:${contact.email}`}>
                    {contact.email}
                  </A>
                </ListItem>
                <ListItem fontSize="lg">
                  About {contact.name}: {contact.note}
                </ListItem>
                <ListItem fontSize="lg">Gender: {contact.gender}</ListItem>
                <ListItem fontSize="lg">
                  Website: {contact.website ? contact.website : "Not specified"}
                </ListItem>
                <ListItem fontSize="lg">
                  Phone: {contact.phone ? contact.phone : "Not specified"}
                </ListItem>
                <ListItem fontSize="lg">
                  Company: {contact.company ? contact.company : "Not specified"}
                </ListItem>
                <ListItem fontSize="lg">
                  Address: {contact.address ? contact.address : "Not specified"}
                </ListItem>
              </UnorderedList>
            </TabPanel>
            <TabPanel>
              <Code colorScheme={"whatsapp"}>
                <Text>
                  {currentUser.email} created contact {contact.name}
                </Text>
                <span>{JSON.stringify(contact.createdAt)}</span>
              </Code>
              <Divider mt="5" mb="5" />
              <Code colorScheme={"whatsapp"}>
                <Text>
                  {currentUser.email} updated contact {contact.name} at
                </Text>
                <span>{JSON.stringify(contact.updatedAt)}</span>
              </Code>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  )
}

const ShowContactPage = () => {
  const router = useRouter()
  const contactId = useParam("contactId")
  const [deleteContactMutation] = useMutation(deleteContact)
  const [contact] = useQuery(getContact, {
    id: contactId,
  })
  return (
    <div>
      <Breadcrumb mb="8">
        <BreadcrumbItem>
          <Link href={Routes.ContactsPage()}>
            <BreadcrumbLink>Contacts</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>View contact</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Suspense fallback={<div>Loading...</div>}>
        <Contact />
      </Suspense>
    </div>
  )
}

ShowContactPage.authenticate = true

ShowContactPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowContactPage
