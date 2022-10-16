import React from "react"
import { chakra, Box, Stack, Image, Flex, Button } from "@chakra-ui/react"

export default function AppHero() {
  return (
    <Flex direction={{ base: "column", md: "row" }} px={8} py={24} mx="auto">
      <Box w={{ base: "full", md: 11 / 12, xl: 9 / 12 }} mx="auto" pr={{ md: 20 }}>
        <chakra.h2
          fontSize={{ base: "3xl", sm: "4xl" }}
          fontWeight="extrabold"
          lineHeight="shorter"
          _dark={{ color: "gray.100" }}
          mb={6}
        >
          <chakra.span display="block">Ready to dive in?</chakra.span>
          <chakra.span display="block" _dark={{ color: "gray.500" }}>
            Start your free trial today.
          </chakra.span>
        </chakra.h2>
        <chakra.p
          mb={6}
          fontSize={{ base: "lg", md: "xl" }}
          color="gray.500"
          _dark={{ color: "gray.300" }}
        >
          Hellonext is a feature voting software where you can allow your users to vote on features,
          publish roadmap, and complete your customer feedback loop.
        </chakra.p>
        <Stack direction={{ base: "column", sm: "row" }} mb={{ base: 4, md: 8 }} spacing={2}>
          <Box display="inline-flex" rounded="md" shadow="md">
            <Button colorScheme={"whatsapp"}>Get Started</Button>
          </Box>
        </Stack>
      </Box>
      <Box w={{ base: "full", md: 10 / 12 }} mx="auto" textAlign="center">
        <Image
          w="full"
          rounded="lg"
          shadow="2xl"
          src="https://kutty.netlify.app/hero.jpg"
          alt="Hellonext feedback boards software screenshot"
        />
      </Box>
    </Flex>
  )
}
