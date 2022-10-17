import { ErrorComponent, ErrorBoundary } from "@blitzjs/next"
import { AuthenticationError, AuthorizationError } from "blitz"
import React from "react"
import { withBlitz } from "app/blitz-client"
import { ChakraProvider } from "@chakra-ui/react"
// import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import AppBar from "app/components/appBar"
import { Suspense } from "react"
import "../app/style/style.css"
import Loader from "app/components/Loader"

function RootErrorFallback({ error }) {
  if (error instanceof AuthenticationError) {
    return <div>Error: You are not authenticated</div>
  } else if (error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else {
    return (
      <ErrorComponent statusCode={error?.statusCode || 400} title={error.message || error.name} />
    )
  }
}

function RenderComponent({ Component, pageProps }) {
  return (
    <>
      {true ? (
        <AppBar>
          <Component {...pageProps} />
        </AppBar>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  )
}

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <ErrorBoundary FallbackComponent={RootErrorFallback}>
        <Suspense fallback={<Loader />}>
          <RenderComponent Component={Component} pageProps={pageProps} />
        </Suspense>
      </ErrorBoundary>
    </ChakraProvider>
  )
}

export default withBlitz(MyApp)
