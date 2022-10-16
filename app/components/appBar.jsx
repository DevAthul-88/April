import {
  Avatar,
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import {
  FaMoneyBill,
  FaUserFriends,
  FaUser,
  FaMoneyCheck,
  FaWrench,
  FaInbox,
  FaMailBulk,
  FaDollarSign,
} from "react-icons/fa"
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react"
import { FiMenu, FiSearch, FiBox } from "react-icons/fi"
import { MdHome } from "react-icons/md"
import React, { Suspense } from "react"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { useRouter } from "next/router"
import Logo from "../../pages/logo.svg"
import Image from "next/image"
import { ChevronDownIcon } from "@chakra-ui/icons"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import logout from "app/auth/mutations/logout"
import { useMutation } from "@blitzjs/rpc"

export default function AppBar({ children }) {
  const sidebar = useDisclosure()
  const router = useRouter()
  const [logoutMutation] = useMutation(logout)
  const NavItem = (props) => {
    const { icon, children, href, ...rest } = props
    return (
      <Flex
        align="center"
        px="4"
        mx="2"
        rounded="md"
        py="3"
        cursor="pointer"
        _hover={{
          bg: "whatsapp.100",
        }}
        role="group"
        fontWeight="semibold"
        color="blackAlpha.800"
        transition=".15s ease"
        {...rest}
      >
        {icon && (
          <Icon
            mr="2"
            boxSize="4"
            color="whatsapp.600"
            _groupHover={{
              color: "whatsapp",
            }}
            as={icon}
          />
        )}
        <Link href={href}>{children}</Link>
      </Flex>
    )
  }

  const SidebarContent = (props) => (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      zIndex="sticky"
      h="full"
      pb="10"
      overflowX="hidden"
      overflowY="auto"
      borderColor="blackAlpha.200"
      borderRightWidth="1px"
      w="60"
      {...props}
    >
      <Flex px="4" py="5" align="center" mb="4">
        <Image src={Logo} alt="logo" />
      </Flex>
      <Flex direction="column" as="nav" fontSize="sm" color="gray.600" aria-label="Main Navigation">
        <NavItem
          bg={router.pathname === "/apps" ? "whatsapp.100" : ""}
          icon={MdHome}
          href={Routes.Home()}
        >
          Dashboard
        </NavItem>
        <NavItem
          icon={FaMoneyBill}
          href={Routes.InvoicesPage()}
          bg={router.pathname === "/invoices" ? "whatsapp.100" : ""}
        >
          Invoices
        </NavItem>
        <NavItem
          icon={FiBox}
          href={Routes.ProjectsPage()}
          bg={router.pathname === "/projects" ? "whatsapp.100" : ""}
        >
          Projects
        </NavItem>
        <NavItem
          icon={FaUserFriends}
          href={Routes.ContactsPage()}
          bg={router.pathname === "/contacts" ? "whatsapp.100" : ""}
        >
          Contacts
        </NavItem>
        <NavItem
          icon={FaUser}
          href={Routes.ClientsPage()}
          bg={router.pathname === "/clients" ? "whatsapp.100" : ""}
        >
          Clients
        </NavItem>
        <NavItem
          icon={FaDollarSign}
          href={Routes.PaymentsPage()}
          bg={router.pathname === "/payments" ? "whatsapp.100" : ""}
        >
          Payments
        </NavItem>
        <NavItem
          icon={FaMoneyCheck}
          href={Routes.ExpensesPage()}
          bg={router.pathname === "/expenses" ? "whatsapp.100" : ""}
        >
          Expenses
        </NavItem>
        <NavItem
          icon={FaMailBulk}
          href={Routes.MailPage()}
          bg={router.pathname === "/mail" ? "whatsapp.100" : ""}
        >
          Mail
        </NavItem>
        <NavItem
          icon={FaInbox}
          href={Routes.InboxesPage()}
          bg={router.pathname === "/inboxes" ? "whatsapp.100" : ""}
        >
          Inbox
        </NavItem>
      </Flex>
    </Box>
  )
  const currentUser = useCurrentUser()
  return (
    <Suspense>
      <Box as="section" bg="gray.50" _dark={{ bg: "gray.700" }} minH="100vh">
        <SidebarContent display={{ base: "none", md: "unset" }} />
        <Drawer isOpen={sidebar.isOpen} onClose={sidebar.onClose} placement="left">
          <DrawerOverlay />
          <DrawerContent>
            <SidebarContent w="full" borderRight="none" />
          </DrawerContent>
        </Drawer>
        <Box ml={{ base: 0, md: 60 }} transition=".3s ease">
          <Flex
            as="header"
            align="center"
            justify="space-between"
            w="full"
            px="4"
            bg="white"
            _dark={{ bg: "gray.800" }}
            borderBottomWidth="1px"
            borderColor="blackAlpha.300"
            h="14"
          >
            <IconButton
              aria-label="Menu"
              display={{ base: "inline-flex", md: "none" }}
              onClick={sidebar.onOpen}
              icon={<FiMenu />}
              size="sm"
            />
            <InputGroup w="96" display={{ base: "none", md: "flex" }}></InputGroup>

            <Flex align="center">
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                  {currentUser.email}
                </MenuButton>
                <MenuList>
                  <MenuItem>Settings</MenuItem>
                  <MenuItem
                    onClick={async () => {
                      await logoutMutation()
                      router.push("/auth/login")
                    }}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </Flex>

          <Box as="main" p="4">
            {children}
          </Box>
        </Box>
      </Box>
    </Suspense>
  )
}
