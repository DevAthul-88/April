import { usePaginatedQuery } from "@blitzjs/rpc"
import { Form } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import ProjectSelector from "app/core/components/ProjectSelect"
export { FORM_ERROR } from "app/core/components/Form"
import getProjects from "app/projects/queries/getProjects"
import getCurrentUser from "app/users/queries/getCurrentUser"
import getClients from "app/clients/queries/getClients"
import ClientSelector from "app/core/components/ClientSelect"
import { Divider } from "@chakra-ui/react"
import PushInput from "app/core/components/PushInput"
import CurrencySelector from "app/core/components/CurrencySelector"

export function InvoiceForm(props) {
  const currentUser = getCurrentUser()
  const [{ projects }] = usePaginatedQuery(getProjects, {
    orderBy: {
      id: "asc",
      userId: currentUser.id,
    },
    where: {
      userId: currentUser.id,
    },
  })
  const [{ clients }] = usePaginatedQuery(getClients, {
    orderBy: {
      id: "asc",
      userId: currentUser.id,
    },
    where: {
      userId: currentUser.id,
    },
  })
  return (
    <Form {...props}>
      <ProjectSelector
        name="project"
        label="Select Project"
        placeholder="Select Project"
        project={projects}
      />
      <ClientSelector
        name="client"
        label="Select Client"
        placeholder="Select Client"
        client={clients}
      />
      <CurrencySelector name="currency" label="Select Currency" placeholder="Select Currency" />
      <LabeledTextField name="issue" type="date" label="Issue date" placeholder="Issue date" />
      <LabeledTextField name="due" type="date" label="Due date" placeholder="Due date" />
      <LabeledTextField name="tax" type="number" label="Tax rate" placeholder="Tax rate" />
      <LabeledTextField name="discount" type="number" label="Discount" placeholder="Discount" />
      <LabeledTextField name="note" label="Note" placeholder="Note" />
      <Divider mt="5" mb="5" />
      <PushInput />
      <Divider mt="5" mb="5" />
    </Form>
  )
}
