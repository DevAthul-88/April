import { Spinner, Center } from "@chakra-ui/react"
import React from "react"

function Loader() {
  return (
    <Center h="50vh">
      <Spinner />
    </Center>
  )
}

export default Loader
