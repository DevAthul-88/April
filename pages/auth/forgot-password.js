import Layout from "app/core/layouts/Layout"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import { ForgotPassword } from "app/auth/validations"
import forgotPassword from "app/auth/mutations/forgotPassword"
import { useMutation } from "@blitzjs/rpc"
import { useRedirectAuthenticated } from "@blitzjs/auth"
import { Flex, Box, Stack, Button, Heading, Text, useColorModeValue } from "@chakra-ui/react"
import AppHeader from "app/components/appHeader"

const ForgotPasswordPage = () => {
  const [forgotPasswordMutation, { isSuccess }] = useMutation(forgotPassword)
  useRedirectAuthenticated("/apps")
  return (
    <Layout title="April | Forgot Your Password?">
      <AppHeader />
      <Flex
        minH={"50vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Forgot password?</Heading>
          </Stack>

          {isSuccess ? (
            <div>
              <h2>Request Submitted</h2>
              <p>
                If your email is in our system, you will receive instructions to reset your password
                shortly.
              </p>
            </div>
          ) : (
            <Box rounded={"lg"} bg={useColorModeValue("white", "gray.700")} boxShadow={"lg"} p={8}>
              <Form
                submitText="Send Reset Password Instructions"
                schema={ForgotPassword}
                initialValues={{
                  email: "",
                }}
                onSubmit={async (values) => {
                  try {
                    await forgotPasswordMutation(values)
                  } catch (error) {
                    return {
                      [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
                    }
                  }
                }}
              >
                <LabeledTextField name="email" label="Email" placeholder="Email" />
              </Form>
            </Box>
          )}
        </Stack>
      </Flex>
    </Layout>
  )
}

export default ForgotPasswordPage
