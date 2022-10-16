import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Layout from "app/core/layouts/Layout"
import createProject from "app/projects/mutations/createProject"
import { ProjectForm, FORM_ERROR } from "app/projects/components/ProjectForm"
import { Box, Breadcrumb, BreadcrumbItem, Divider, BreadcrumbLink, Heading } from "@chakra-ui/react"
import { Project } from "app/auth/validations"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

const NewProjectPage = () => {
  const router = useRouter()
  const [createProjectMutation] = useMutation(createProject)
  const currentUser = useCurrentUser()
  return (
    <Layout title={"April | Create New Project"}>
      <Breadcrumb mb="8">
        <BreadcrumbItem>
          <Link href={Routes.ContactsPage()}>
            <BreadcrumbLink>Contacts</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <Link href={Routes.NewContactPage()}>
            <BreadcrumbLink>New Contact</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>
      </Breadcrumb>
      <Box rounded={"lg"} boxShadow={"lg"} p={8}>
        <Heading fontSize={"2xl"}>New Contact</Heading>
        <Divider mt="5" mb="5" />
        <ProjectForm
          submitText="Create Project"
          schema={Project}
          initialValues={{
            name: null,
            note: null,
            userId: currentUser.id,
            start: null,
            status: null,
          }}
          onSubmit={async (values) => {
            try {
              const project = await createProjectMutation(values)
              router.push(
                Routes.ShowProjectPage({
                  projectId: project.id,
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

NewProjectPage.authenticate = true
export default NewProjectPage
