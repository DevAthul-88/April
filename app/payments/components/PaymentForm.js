import CurrencySelector from "app/core/components/CurrencySelector"
import { Form } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import MethodSelector from "app/core/components/MethodSelector"
export { FORM_ERROR } from "app/core/components/Form"

export function PaymentForm(props) {
  return (
    <Form {...props}>
      <LabeledTextField type="date" name="date" label="Date" placeholder="Date" />
      <LabeledTextField type="number" name="amount" label="Amount" placeholder="Amount" />
      <CurrencySelector name="currency" label="Currency" placeholder="Currency" />
      <MethodSelector name="method" label="Payment Method" placeholder="Payment Method" />
      <LabeledTextField name="ref" label="Reference" placeholder="Reference" />
    </Form>
  )
}
