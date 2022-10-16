import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import Layout from "app/core/layouts/Layout"
import getProjects from "app/projects/queries/getProjects"
import { FaPlus } from "react-icons/fa"
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Heading,
  Divider,
  Button,
  Badge,
  Flex,
  Spacer,
  Box,
} from "@chakra-ui/react"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

const ITEMS_PER_PAGE = 10
export const ProjectsList = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  const page = Number(router.query.page) || 0
  const [{ projects, hasMore }] = usePaginatedQuery(getProjects, {
    orderBy: {
      id: "asc",
    },
    where: {
      userId: currentUser.id,
    },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () =>
    router.push({
      query: {
        page: page - 1,
      },
    })

  const goToNextPage = () =>
    router.push({
      query: {
        page: page + 1,
      },
    })
  function Status(args) {
    switch (args) {
      case "Active":
        return <Badge variant={"solid"}>Active</Badge>
        break
      case "Completed":
        return (
          <Badge variant={"solid"} colorScheme={"whatsapp"}>
            Completed
          </Badge>
        )
        break
      case "Pending":
        return (
          <Badge variant={"solid"} colorScheme="whatsapp">
            Pending
          </Badge>
        )
        break
    }
  }
  return (
    <div>
      <Flex mt="6">
        {" "}
        <Heading fontSize={"3xl"}>Your projects</Heading>
        <Spacer />
        <Link href={Routes.NewProjectPage()}>
          <Button leftIcon={<FaPlus />} colorScheme="whatsapp">
            New Project
          </Button>
        </Link>
      </Flex>
      <Divider mt="5" mb="5" />
      <TableContainer>
        <Table variant="striped">
          <TableCaption>Your projects</TableCaption>
          <Thead>
            <Tr>
              <Th>Project name</Th>
              <Th>Start date</Th>
              <Th>Status</Th>
              <Th>View</Th>
            </Tr>
          </Thead>
          <Tbody>
            {projects.map((project) => (
              <Tr>
                <Td>{project.name}</Td>
                <Td>{project.start}</Td>
                <Td>{Status(project.status)}</Td>
                <Td>
                  <Link href={`/projects/${project.id}`}>View Project</Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Button colorScheme="whatsapp" disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </Button>
      <Button ml="2" colorScheme="whatsapp" disabled={!hasMore} onClick={goToNextPage}>
        Next
      </Button>
    </div>
  )
}

const ProjectsPage = () => {
  return (
    <Layout>
      <Head>
        <title>April | Projects</title>
      </Head>

      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <ProjectsList />
        </Suspense>
      </div>
    </Layout>
  )
}

export default ProjectsPage
