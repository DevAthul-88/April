import { Form } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import TextArea from "app/core/components/TextAreaForm"
import { usePaginatedQuery } from "@blitzjs/rpc"
import getClients from "app/clients/queries/getClients"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import ContactSelectorMail from "app/core/components/ClientMail"

export { FORM_ERROR } from "app/core/components/Form"

export function MailForm(props) {
  const currentUser = useCurrentUser()
  const [{ clients }] = usePaginatedQuery(getClients, {
    orderBy: {
      id: "asc",
    },
    where: {
      userId: currentUser.id,
    },
  })
  return (
    <Form {...props}>
      <LabeledTextField name="name" label="Name" placeholder="Name" />
      <TextArea name="note" label="Content" placeholder="Content" />
      <ContactSelectorMail
        name="client"
        label="Select Client"
        placeholder="Select Client"
        client={clients}
      />
    </Form>
  )
}
