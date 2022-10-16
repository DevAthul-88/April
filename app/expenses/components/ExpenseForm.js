import { usePaginatedQuery } from "@blitzjs/rpc"
import getClients from "app/clients/queries/getClients"
import CurrencySelector from "app/core/components/CurrencySelector"
import { Form } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import getProjects from "app/projects/queries/getProjects"
import getCurrentUser from "app/users/queries/getCurrentUser"
import ClientSelector from "app/core/components/ClientSelect"
import CheckBox from "app/core/components/CheckBox"
import ProjectIdSelector from "app/core/components/ProjectIdSelector"

export { FORM_ERROR } from "app/core/components/Form"
export function ExpenseForm(props) {
  const currentUser = getCurrentUser()
  const [{ projects }] = usePaginatedQuery(getProjects, {
    orderBy: {
      id: "asc",
    },
    where: {
      userId: currentUser.id,
    },
  })
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
      <LabeledTextField name="note" label="Note" placeholder="Note" />
      <LabeledTextField name="date" type="date" label="Date" placeholder="Date" />
      <LabeledTextField name="amount" type="number" label="Amount" placeholder="Amount" />
      <ClientSelector
        name="client"
        label="Select Client"
        placeholder="Select Client"
        client={clients}
      />
      <CurrencySelector name="currency" label="Select Currency" placeholder="Select Currency" />
      <ProjectIdSelector
        name="project"
        label="Select Project"
        placeholder="Select Project"
        project={projects}
      />
      <CheckBox name="paid" label="Is this expense paid?" placeholder="Paid" />
      <CheckBox name="should" label="Should be invoiced?" placeholder="Should be invoiced?" />
    </Form>
  )
}
