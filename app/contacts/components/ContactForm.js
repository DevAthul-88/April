import { usePaginatedQuery } from "@blitzjs/rpc"
import { Box, Button, Divider } from "@chakra-ui/react"
import getClients from "app/clients/queries/getClients"
import ContactSelect from "app/core/components/ContactSelect"
import { Form } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import ClientSelector from "app/core/components/ClientSelect"
import { useState } from "react"
import { FaPlus } from "react-icons/fa"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
export { FORM_ERROR } from "app/core/components/Form"

export function ContactForm(props) {
  const currentUser = useCurrentUser()
  const [{ clients }] = usePaginatedQuery(getClients, {
    orderBy: {
      id: "asc",
      userId: currentUser.id,
    },
    where: {
      userId: currentUser.id,
    },
  })
  const [show, setShow] = useState(false)
  return (
    <Form {...props}>
      <LabeledTextField name="name" label="Name" placeholder="Name" />
      <LabeledTextField name="email" label="Email" placeholder="Email" />
      <ClientSelector
        name="client"
        label="Select Client"
        placeholder="Select Client"
        client={clients}
      />
      <LabeledTextField name="note" label="About the contact" placeholder="About the contact" />
      <ContactSelect label="Gender" placeholder="Gender" name="gender" />
      {!show && (
        <Button
          variant={"outline"}
          leftIcon={<FaPlus />}
          colorScheme="whatsapp"
          type="button"
          display="block"
          mb="4"
          onClick={() => {
            setShow(!show)
          }}
          size="sm"
        >
          More Fields
        </Button>
      )}

      {show && (
        <>
          <Divider mb="4" />
          <LabeledTextField name="website" label="Website (optional)" placeholder="Website" />
          <LabeledTextField name="company" label="Company (optional)" placeholder="Company" />
          <LabeledTextField name="phone" label="Phone (optional)" placeholder="Phone" />
          <LabeledTextField name="address" label="Address (optional)" placeholder="Address" />
        </>
      )}
    </Form>
  )
}
