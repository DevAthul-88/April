import { Select, FormLabel, Text } from "@chakra-ui/react"
import { forwardRef, useId } from "react"
import { useField, Field } from "react-final-form"
import {
  Divider,
  Button,
  Table,
  Thead,
  Tbody,
  Tooltip,
  Tr,
  Th,
  Td,
  TableContainer,
  Input,
} from "@chakra-ui/react"
import { FieldArray } from "react-final-form-arrays"
import { FaTimes } from "react-icons/fa"

export const PushInput = forwardRef(
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
    return (
      <div {...outerProps}>
        <FormLabel {...labelProps}>{label}</FormLabel>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Details</Th>
                <Th>Quantity</Th>
                <Th>Price</Th>
                <Th>Amount</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              <FieldArray name="meta">
                {({ fields, meta: { error, invalid } }) => (
                  <>
                    {fields.map((name, index) => (
                      <Tr key={name}>
                        <Td>
                          <div>
                            <Field
                              name={`${name}.details`}
                              component="input"
                              className="input_push"
                            />
                          </div>
                        </Td>
                        <Td>
                          <div>
                            <Field
                              name={`${name}.quantity`}
                              type="number"
                              component="input"
                              className="input_push"
                            />
                          </div>
                        </Td>
                        <Td>
                          <div>
                            <Field
                              name={`${name}.price`}
                              type="number"
                              component="input"
                              className="input_push"
                            />
                          </div>
                        </Td>
                        <Td>
                          <Tooltip label="Remove this">
                            <Button
                              variant={"link"}
                              type="button"
                              onClick={() => fields.remove(index)}
                            >
                              <FaTimes />
                            </Button>
                          </Tooltip>
                        </Td>
                      </Tr>
                    ))}

                    <Button
                      mt="4"
                      type="button"
                      colorScheme="whatsapp"
                      onClick={() => fields.push({ details: "", quantity: "", price: "" })}
                    >
                      Add row
                    </Button>
                  </>
                )}
              </FieldArray>
            </Tbody>
          </Table>
        </TableContainer>

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
export default PushInput
