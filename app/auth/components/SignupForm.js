import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import signup from "app/auth/mutations/signup"
import { Signup } from "app/auth/validations"
import { useMutation } from "@blitzjs/rpc"
import { Flex, Box, Stack, Link, Button, Heading, Text, useColorModeValue } from "@chakra-ui/react"
import CurrencySelector from "app/core/components/CurrencySelector"

export const SignupForm = (props) => {
  const [signupMutation] = useMutation(signup)
  return (
    <Flex
      minH={"50vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Create a new account</Heading>
        </Stack>
        <Box rounded={"lg"} bg={useColorModeValue("white", "gray.700")} boxShadow={"lg"} p={8}>
          <Form
            submitText="Create Account"
            schema={Signup}
            initialValues={{
              email: "",
              password: "",
            }}
            onSubmit={async (values) => {
              try {
                await signupMutation(values)
                props.onSuccess?.()
              } catch (error) {
                if (error.code === "P2002" && error.meta?.target?.includes("email")) {
                  // This error comes from Prisma
                  return {
                    email: "This email is already being used",
                  }
                } else {
                  return {
                    [FORM_ERROR]: error.toString(),
                  }
                }
              }
            }}
          >
            <Stack spacing={4}>
              <LabeledTextField name="name" label="Username" placeholder="Username" />
              <LabeledTextField name="email" label="Email" placeholder="Email" />
              <LabeledTextField name="address" label="Address" placeholder="Address" />
              <LabeledTextField name="company" label="Company name" placeholder="Company name" />
            </Stack>
            <LabeledTextField
              name="password"
              label="Password"
              placeholder="Password"
              type="password"
            />
          </Form>
        </Box>
      </Stack>
    </Flex>
  )
}
export default SignupForm
