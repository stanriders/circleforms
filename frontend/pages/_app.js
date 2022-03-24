import { useState, useEffect } from 'react'
import UserContext from '../components/context/UserContext'
import api from '../libs/api'
import Cookies from 'js-cookie'
import '../styles/globals.scss'
import localforage from 'localforage'

const ONE_HOUR = 1000 * 60 * 60

function isLoggedIn() {
  if (process.env.NODE_ENV === 'development') return true
  return Cookies.get('.AspNetCore.InternalCookies')
}

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    getInitialData()
  }, [])

  async function getInitialData() {
    if (!isLoggedIn()) {
      return
    }

    // Get user data from localstorage if it's not expired (1 hour)
    const [user, userUpdatedAt] = await Promise.all([
      localforage.getItem('user'),
      localforage.getItem('user_updated_at'),
    ])

    const difference = Date.now() - userUpdatedAt

    if (user && difference <= ONE_HOUR) {
      return setUser(user)
    }

    // Get user data from the API
    try {
      const user = await api('/me')
      setUser(user)
      localforage.setItem('user', user)
      localforage.setItem('user_updated_at', Date.now())
    } catch (e) {
      setUser(null)
    }
  }

  return (
    <UserContext.Provider value={{
      user,
      setUser
    }}>
      <Component {...pageProps} />
    </UserContext.Provider>
  )
}

export default MyApp
