import { Form } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import StatusSelect from "app/core/components/StatusSelect"
export { FORM_ERROR } from "app/core/components/Form"

export function ProjectForm(props) {
  return (
    <Form {...props}>
      <LabeledTextField name="name" label="Name" placeholder="Name" />
      <LabeledTextField name="note" label="Note" placeholder="Note" />
      <LabeledTextField
        type="date"
        name="start"
        label="Starting date"
        placeholder="Starting date"
      />
      <StatusSelect name="status" label="Status" placeholder="Status" />
    </Form>
  )
}
