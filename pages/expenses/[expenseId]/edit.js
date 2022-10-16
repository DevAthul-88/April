import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import Layout from "app/core/layouts/Layout"
import getExpense from "app/expenses/queries/getExpense"
import updateExpense from "app/expenses/mutations/updateExpense"
import { ExpenseForm, FORM_ERROR } from "app/expenses/components/ExpenseForm"
import { Box, Breadcrumb, BreadcrumbItem, Divider, BreadcrumbLink, Heading } from "@chakra-ui/react"
export const EditExpense = () => {
  const router = useRouter()
  const expenseId = useParam("expenseId")
  const [expense, { setQueryData }] = useQuery(
    getExpense,
    {
      id: expenseId,
    },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateExpenseMutation] = useMutation(updateExpense)
  return (
    <>
      <Head>
        <title>April | Edit Expense {expense.name}</title>
      </Head>

      <Box rounded={"lg"} boxShadow={"lg"} p={8}>
        <Heading fontSize={"2xl"}>Edit {expense.name}</Heading>
        <Divider mt="5" mb="5" />

        <ExpenseForm
          submitText="Update Expense" // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateExpense}
          initialValues={expense}
          onSubmit={async (values) => {
            try {
              const updated = await updateExpenseMutation({
                id: expense.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(
                Routes.ShowExpensePage({
                  expenseId: updated.id,
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
    </>
  )
}

const EditExpensePage = () => {
  return (
    <div>
      <Breadcrumb mb="8">
        <BreadcrumbItem>
          <Link href={Routes.ExpensesPage()}>
            <BreadcrumbLink>Expenses</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Edit Expense</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Suspense fallback={<div>Loading...</div>}>
        <EditExpense />
      </Suspense>
    </div>
  )
}

EditExpensePage.authenticate = true

EditExpensePage.getLayout = (page) => <Layout>{page}</Layout>

export default EditExpensePage
