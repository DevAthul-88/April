import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation, usePaginatedQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import Layout from "app/core/layouts/Layout"
import getProject from "app/projects/queries/getProject"
import deleteProject from "app/projects/mutations/deleteProject"
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"
import {
  Box,
  Breadcrumb,
  Button,
  BreadcrumbItem,
  Divider,
  BreadcrumbLink,
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
  ListItem,
  UnorderedList,
  Link as A,
  Flex,
  Spacer,
  Code,
  Text,
} from "@chakra-ui/react"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import getSymbolFromCurrency from "currency-symbol-map"
import { Country } from "country-state-city"
import getExpenses from "app/expenses/queries/getExpenses"
import { useAuthorize } from "@blitzjs/auth"
import Loader from "app/components/Loader"
export const Project = () => {
  const router = useRouter()
  const projectId = useParam("projectId")
  const currentUser = useCurrentUser()
  const [deleteProjectMutation] = useMutation(deleteProject)
  const [project] = useQuery(getProject, {
    id: projectId,
  })
  const [{ expenses }] = usePaginatedQuery(getExpenses, {
    orderBy: {
      id: "asc",
    },
    where: {
      project: projectId,
    },
  })
  useAuthorize()
  return (
    <>
      <Head>
        <title>April | {project.name}</title>
      </Head>
      <Box rounded={"lg"} boxShadow={"lg"} p={8}>
        <Flex>
          <Heading fontSize={"2xl"}>{project.name}</Heading>
          <Spacer />

          <Link
            href={Routes.EditProjectPage({
              projectId: project.id,
            })}
          >
            <Button colorScheme="whatsapp">Edit</Button>
          </Link>

          <Button
            colorScheme="red"
            type="button"
            onClick={async () => {
              if (window.confirm("This will be deleted")) {
                await deleteProjectMutation({
                  id: project.id,
                })
                router.push(Routes.ProjectsPage())
              }
            }}
            style={{
              marginLeft: "0.5rem",
            }}
          >
            Delete
          </Button>
        </Flex>

        <Tabs mt="5" mb="5" colorScheme={"whatsapp"}>
          <TabList>
            <Tab>Details</Tab>
            <Tab>Activity</Tab>
            <Tab>Expense</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <UnorderedList mb="5" spacing="2" size="2xl">
                <ListItem fontSize="lg">Name: {project.name}</ListItem>
                <ListItem fontSize="lg">
                  About:{" "}
                  <Text fontWeight={"bold"} as="span" fontStyle="italic">
                    {project.note}
                  </Text>
                </ListItem>
                <ListItem fontSize="lg">Starting date: {project.start}</ListItem>
                <ListItem fontSize="lg">Status: {project.status}</ListItem>
              </UnorderedList>
            </TabPanel>
            <TabPanel>
              <Code colorScheme={"whatsapp"}>
                <Text>
                  {currentUser.email} created project {project.name}
                </Text>
                <span>{JSON.stringify(project.createdAt)}</span>
              </Code>
              <Divider mt="5" mb="5" />
              <Code colorScheme={"whatsapp"}>
                <Text>
                  {currentUser.email} updated project {project.name} at
                </Text>
                <span>{JSON.stringify(project.updatedAt)}</span>
              </Code>
            </TabPanel>
            <TabPanel>
              <TableContainer>
                <Table variant="striped">
                  <TableCaption>Your expenses</TableCaption>
                  <Thead>
                    <Tr>
                      <Th>Expense name</Th>
                      <Th>Date</Th>
                      <Th>Amount</Th>
                      <Th>View</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {expenses.map((expense) => (
                      <Tr key={expense.id}>
                        <Td>{expense.name}</Td>
                        <Td>{expense.date}</Td>
                        <Td>
                          {getSymbolFromCurrency(
                            Country.getCountryByCode(expense.currency).currency
                          )}{" "}
                          {expense.amount}
                        </Td>
                        <Td>
                          <Link href={`/expenses/${expense.id}`}>View invoice</Link>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
              <Text mt="4" fontStyle={"italic"}>
                View the expenses which is belongs to this project.
              </Text>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  )
}

const ShowProjectPage = () => {
  return (
    <div>
      <Breadcrumb mb="8">
        <BreadcrumbItem>
          <Link href={Routes.ProjectsPage()}>
            <BreadcrumbLink>Projects</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>View Project</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Suspense fallback={<Loader />}>
        <Project />
      </Suspense>
    </div>
  )
}

ShowProjectPage.authenticate = true

ShowProjectPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowProjectPage
