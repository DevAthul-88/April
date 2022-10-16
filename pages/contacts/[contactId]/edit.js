import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import Layout from "app/core/layouts/Layout"
import getContact from "app/contacts/queries/getContact"
import updateContact from "app/contacts/mutations/updateContact"
import { Box, Breadcrumb, BreadcrumbItem, Divider, BreadcrumbLink, Heading } from "@chakra-ui/react"
import { ContactForm, FORM_ERROR } from "app/contacts/components/ContactForm"
import { Contact } from "app/auth/validations"
import { useAuthorize } from "@blitzjs/auth"
import Loader from "app/components/Loader"

export const EditContact = () => {
  const router = useRouter()
  const contactId = useParam("contactId")
  const [contact, { setQueryData }] = useQuery(
    getContact,
    {
      id: contactId,
    },
    {
      staleTime: Infinity,
    }
  )
  const [updateContactMutation] = useMutation(updateContact)
  useAuthorize()
  return (
    <>
      <Head>
        <title>April | Edit {contact.name}</title>
      </Head>

      <Box rounded={"lg"} boxShadow={"lg"} p={8}>
        <Heading fontSize={"2xl"}>Edit {contact.name}</Heading>
        <Divider mt="5" mb="5" />
        <ContactForm
          submitText="Update Contact" // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          schema={Contact}
          initialValues={contact}
          onSubmit={async (values) => {
            try {
              const updated = await updateContactMutation({
                id: contactId,
                ...values,
              })
              await setQueryData(updated)
              router.push(
                Routes.ShowContactPage({
                  contactId: updated.id,
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
    </>
  )
}

const EditContactPage = () => {
  return (
    <div>
      <Breadcrumb mb="8">
        <BreadcrumbItem>
          <Link href={Routes.ContactsPage()}>
            <BreadcrumbLink>Contacts</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Edit Contact</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Suspense fallback={<Loader />}>
        <EditContact />
      </Suspense>
    </div>
  )
}

EditContactPage.authenticate = true

EditContactPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditContactPage
