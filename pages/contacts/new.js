import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Layout from "app/core/layouts/Layout"
import createContact from "app/contacts/mutations/createContact"
import { ContactForm, FORM_ERROR } from "app/contacts/components/ContactForm"
import { Box, Breadcrumb, BreadcrumbItem, Divider, BreadcrumbLink, Heading } from "@chakra-ui/react"
import { Contact } from "app/auth/validations"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useAuthorize } from "@blitzjs/auth"
const NewContactPage = () => {
  const router = useRouter()

  const [createContactMutation] = useMutation(createContact)
  const currentUser = useCurrentUser()
  useAuthorize()
  return (
    <Layout title={"April | Create New Contact"}>
      <Breadcrumb mb="8">
        <BreadcrumbItem>
          <Link href={Routes.ContactsPage()}>
            <BreadcrumbLink>Contacts</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <Link href={Routes.NewContactPage()}>
            <BreadcrumbLink>New Contact</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>
      </Breadcrumb>

      <Box rounded={"lg"} boxShadow={"lg"} p={8}>
        <Heading fontSize={"2xl"}>New Contact</Heading>
        <Divider mt="5" mb="5" />

        <ContactForm
          submitText="Create Contact"
          schema={Contact}
          allowN
          initialValues={{
            name: null,
            email: null,
            gender: null,
            note: null,
            country: null,
            userId: currentUser.id,
            phone: null,
            address: null,
            company: null,
            website: null,
            client: null,
          }}
          onSubmit={async (values) => {
            try {
              const contact = await createContactMutation(values)
              router.push(
                Routes.ShowContactPage({
                  contactId: contact.id,
                })
              )
            } catch (error) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </Box>
    </Layout>
  )
}

NewContactPage.authenticate = true
export default NewContactPage
