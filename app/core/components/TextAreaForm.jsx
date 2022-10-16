import { Textarea, FormLabel, Text, Link } from "@chakra-ui/react"
import { forwardRef } from "react"
import { useField } from "react-final-form"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
} from "@chakra-ui/react"

export const TextArea = forwardRef(
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
        <Popover>
          <PopoverTrigger>
            <Textarea {...input} isDisabled={submitting} {...props} ref={ref} />
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Tip</PopoverHeader>
            <PopoverBody>
              Use can use markdown syntax to write top notch mails,{" "}
              <Link
                href="https://en.wikipedia.org/wiki/Markdown"
                target="_blank"
                color="whatsapp.500"
              >
                Markdown documentation
              </Link>
            </PopoverBody>
          </PopoverContent>
        </Popover>

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
export default TextArea
