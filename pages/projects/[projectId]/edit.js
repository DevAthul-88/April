import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import Layout from "app/core/layouts/Layout"
import getProject from "app/projects/queries/getProject"
import updateProject from "app/projects/mutations/updateProject"
import { ProjectForm, FORM_ERROR } from "app/projects/components/ProjectForm"
import { useAuthorize } from "@blitzjs/auth"
import { Box, Breadcrumb, BreadcrumbItem, Divider, BreadcrumbLink, Heading } from "@chakra-ui/react"
import Loader from "app/components/Loader"
export const EditProject = () => {
  const router = useRouter()
  const projectId = useParam("projectId")
  const [project, { setQueryData }] = useQuery(
    getProject,
    {
      id: projectId,
    },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateProjectMutation] = useMutation(updateProject)
  useAuthorize()
  return (
    <>
      <Head>
        <title>April | Edit {project.name}</title>
      </Head>

      <Box rounded={"lg"} boxShadow={"lg"} p={8}>
        <Heading fontSize={"2xl"}>Edit {project.name}</Heading>
        <Divider mt="5" mb="5" />

        <ProjectForm
          submitText="Update Project" // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateProject}
          initialValues={project}
          onSubmit={async (values) => {
            try {
              const updated = await updateProjectMutation({
                id: project.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(
                Routes.ShowProjectPage({
                  projectId: updated.id,
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

const EditProjectPage = () => {
  return (
    <div>
      <Breadcrumb mb="8">
        <BreadcrumbItem>
          <Link href={Routes.ProjectsPage()}>
            <BreadcrumbLink>Projects</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Edit Project</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Suspense fallback={<Loader />}>
        <EditProject />
      </Suspense>
    </div>
  )
}

EditProjectPage.authenticate = true

EditProjectPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditProjectPage
