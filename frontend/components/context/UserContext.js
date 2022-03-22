import React from 'react'

const UserContext = React.createContext({
  user: null,
  setUser: (user) => {}
})
UserContext.displayName = 'UserContext'

export default UserContext