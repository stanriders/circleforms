import { useState, useEffect } from 'react'
import UserContext from '../components/context/UserContext'
import api from '../libs/api'
import useAuth from '../hooks/useAuth'
import NextNProgress from "nextjs-progressbar";

import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {
  const { user } = useAuth()

  return (
    <UserContext.Provider value={{ user }}>
      <NextNProgress
        color="#FF66AA"
      />
      <Component {...pageProps} />
    </UserContext.Provider>
  )
}

export default MyApp
