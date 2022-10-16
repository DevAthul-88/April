import { Box, Button, Divider } from "@chakra-ui/react"
import ContactSelect from "app/core/components/ContactSelect"
import { CountrySelector } from "app/core/components/CountrySelector"
import { Form } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { useState } from "react"
import { FaPlus } from "react-icons/fa"

export { FORM_ERROR } from "app/core/components/Form"
export function ClientForm(props) {
  const [show, setShow] = useState(false)
  return (
    <Form {...props}>
      <LabeledTextField name="name" label="Name" placeholder="Name" />
      <LabeledTextField name="email" label="Email" placeholder="Email" />
      <LabeledTextField name="note" label="About the client" placeholder="About the client" />
      <ContactSelect label="Gender" placeholder="Gender" name="gender" />
      <CountrySelector name="country" label="Country" placeholder="Client country" />
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
