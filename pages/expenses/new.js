import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Layout from "app/core/layouts/Layout"
import createExpense from "app/expenses/mutations/createExpense"
import { ExpenseForm, FORM_ERROR } from "app/expenses/components/ExpenseForm"
import { Box, Breadcrumb, BreadcrumbItem, Divider, BreadcrumbLink, Heading } from "@chakra-ui/react"
import { Expense } from "app/auth/validations"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useAuthorize } from "@blitzjs/auth"
const NewExpensePage = () => {
  const router = useRouter()
  const [createExpenseMutation] = useMutation(createExpense)
  const currentUser = useCurrentUser()
  useAuthorize()
  return (
    <Layout title={"April | Create New Expense"}>
      <Breadcrumb mb="8">
        <BreadcrumbItem>
          <Link href={Routes.ExpensesPage()}>
            <BreadcrumbLink>Expense</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <Link href={Routes.NewExpensePage()}>
            <BreadcrumbLink>New Expense</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>
      </Breadcrumb>
      <Box rounded={"lg"} boxShadow={"lg"} p={8}>
        <Heading fontSize={"2xl"}>New Expense</Heading>
        <Divider mt="5" mb="5" />
        <ExpenseForm
          submitText="Create Expense"
          schema={Expense}
          initialValues={{
            userId: currentUser.id,
            name: null,
            currency: null,
            client: null,
            amount: null,
            note: null,
            project: null,
            date: null,
            paid: false,
            should: false,
          }}
          onSubmit={async (values) => {
            try {
              const expense = await createExpenseMutation(values)
              router.push(
                Routes.ShowExpensePage({
                  expenseId: expense.id,
                })
              )
            } catch (error) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </Box>
    </Layout>
  )
}

NewExpensePage.authenticate = true
export default NewExpensePage
