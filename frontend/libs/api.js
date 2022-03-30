import * as mocks from '../mocks'

export default async function api (endpoint, options) {
  if (process.env.NODE_ENV === 'development') {
    await wait(350)

    if (endpoint.includes('/posts/page')) {
      return mocks.forms
    }

    if (endpoint === '/me') {
      return mocks.me
    }
  }

  const response = await fetch(`https://circleforms.net/api${endpoint}`, {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    ...options
  })

  if (response.status === 204) {
    return null
  }

  const responseData = await response.json()

  if (response.ok) {
    return responseData
  }

  throw responseData
}

function wait (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}