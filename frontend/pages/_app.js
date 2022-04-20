import { useState, useEffect } from 'react'
import UserContext from '../components/context/UserContext'
import api from '../libs/api'
import useAuth from '../hooks/useAuth'
import NextNProgress from "nextjs-progressbar";
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from '../components/pages/ErrorFallback'
import { NextIntlProvider } from 'next-intl'

import "@reach/listbox/styles.css";
import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {
  const { user } = useAuth()

  return (
    <NextIntlProvider messages={pageProps.messages}>
      <UserContext.Provider value={{ user }}>
        <NextNProgress
          color="#FF66AA"
        />
        <ErrorBoundary
          FallbackComponent={ErrorFallback}>
          <Component {...pageProps} />
        </ErrorBoundary>
      </UserContext.Provider>
    </NextIntlProvider>
  )
}

export default MyApp
