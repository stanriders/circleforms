import Head from 'next/head'
import Hero from '../Hero'
import DefaultLayout from '../../layouts'
import Button from '../atoms/Button'

export default function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - An error has occured</title>
      </Head>

      <div className="container text-center bg-black-light p-4 rounded-20">
        <h2 className="text-red-300 text-xl">Sorry, something went wrong:</h2>
        <pre>{error.toString()}</pre>
      </div>
    </DefaultLayout>
  )
}