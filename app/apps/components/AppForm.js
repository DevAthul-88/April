import { Form } from "app/core/components/Form";
import { LabeledTextField } from "app/core/components/LabeledTextField";
export { FORM_ERROR } from "app/core/components/Form";
export function AppForm(props) {
  return (
    <Form {...props}>
      <LabeledTextField name="name" label="Name" placeholder="Name" />
    </Form>
  );
}
