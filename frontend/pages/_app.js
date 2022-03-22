import { useState, useEffect } from 'react'
import UserContext from '../components/context/UserContext'
import api from '../libs/api'
import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null)

  useEffect(getInitialData, [])

  async function getInitialData() {
    try {
      const user = await api('/me')
      console.log(user)
      setUser(user)
    } catch (e) {
      console.error(e)
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
