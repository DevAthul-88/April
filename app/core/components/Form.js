import { Form as FinalForm } from "react-final-form"
import { validateZodSchema } from "blitz"
import { Button, Box } from "@chakra-ui/react"
export { FORM_ERROR } from "final-form"
import arrayMutators from "final-form-arrays"
export function Form({ children, submitText, schema, initialValues, onSubmit, ...props }) {
  return (
    <FinalForm
      initialValues={initialValues}
      validate={validateZodSchema(schema)}
      onSubmit={onSubmit}
      mutators={{
        ...arrayMutators,
      }}
      render={({ handleSubmit, submitting, submitError, values }) => (
        <form onSubmit={handleSubmit} className="form" {...props}>
          {/* Form fields supplied as children are rendered here */}
          {children}

          {submitError && (
            <div
              role="alert"
              style={{
                color: "red",
              }}
            >
              {submitError}
            </div>
          )}

          {submitText && (
            <Box display="inline-flex" rounded="md" shadow="md">
              <Button type="submit" colorScheme="whatsapp" disabled={submitting}>
                {submitText}
              </Button>
            </Box>
          )}
          <style global jsx>{`
            .form > * + * {
              margin-top: 1rem;
            }
          `}</style>
        </form>
      )}
    />
  )
}
export default Form
