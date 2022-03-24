import { useState, useEffect } from 'react'
import UserContext from '../components/context/UserContext'
import api from '../libs/api'
import useAuth from '../hooks/useAuth'

import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {
  const { user } = useAuth()

  return (
    <UserContext.Provider value={{ user }}>
      <Component {...pageProps} />
    </UserContext.Provider>
  )
}

export default MyApp
