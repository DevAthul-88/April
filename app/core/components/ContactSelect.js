import { Select, FormLabel, Text } from "@chakra-ui/react"
import { forwardRef, useId } from "react"
import { useField, Field } from "react-final-form"

export const ContactSelect = forwardRef(
  ({ name, label, outerProps, fieldProps, labelProps, ...props }, ref) => {
    const {
      input,
      meta: { touched, error, submitError, submitting },
    } = useField(name, {
      parse:
        props.type === "number"
          ? Number // Converting `""` to `null` ensures empty values will be set to null in the DB
          : (v) => (v === "" ? null : v),
      ...fieldProps,
    })
    const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError
    const id = useId()
    return (
      <div {...outerProps}>
        <FormLabel {...labelProps}>{label}</FormLabel>
        <Field
          component="select"
          class="chakra-select css-1hokd9z"
          id={id}
          placeholder={label}
          name={name}
          isDisabled={submitting}
        >
          <option />
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="not">Rather not say</option>
        </Field>

        {touched && normalizedError && (
          <Text role="alert" color={"red.500"}>
            {normalizedError}
          </Text>
        )}

        <style jsx>{`
          label {
            display: flex;
            flex-direction: column;
            align-items: start;
            font-size: 1rem;
          }
          input {
            font-size: 1rem;
            padding: 0.25rem 0.5rem;
            border-radius: 3px;
            border: 1px solid purple;
            appearance: none;
            margin-top: 0.5rem;
          }
        `}</style>
      </div>
    )
  }
)
export default ContactSelect
