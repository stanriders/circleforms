import Head from 'next/head'
import Hero from '../components/Hero'
import DefaultLayout from '../layouts'
import Button from '../components/atoms/Button'
import { useContext } from 'react'
import UserContext from '../components/context/UserContext'

export default function Dashboard() {
  const { user } = useContext(UserContext)

  if (!user) {
    return (
      <DefaultLayout>
        <Head>
          <title>CircleForms - Not Authorized</title>
        </Head>

        <Hero>
          <div className="flex flex-col justify-center items-center py-16 md:py-32 lg:pt-52 lg:pb-72">
              <p className="text-4xl font-alternates lg:-mt-10 text-center">
                You are not logged in.
              </p>
              <div className="flex flex-col lg:flex-row mt-14 gap-8 pb-2 lg:pb-0">
                <Button large href="/api/OAuth/auth">Login to access your dashboard</Button>
              </div>
          </div>
        </Hero>
      </DefaultLayout>
    )
  }

  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - Dashboard</title>
      </Head>


      <div className="flex justify-center relative py-6">
        <svg className="absolute -ml-32" width="499" height="76" viewBox="0 0 499 76" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="182.553" height="75.893" rx="37.9465" fill="#FF66AA"/>
          <rect x="283.061" width="129.223" height="75.893" rx="37.9465" fill="#FF66AA"/>
          <rect x="195" width="72" height="76" rx="35.8953" fill="#FF66AA"/>
          <rect x="424.59" width="73.8418" height="75.893" rx="36.9209" fill="#FF66AA"/>
        </svg>
        <h1 className="font-alternates text-6xl lg:text-8xl font-bold z-10 mt-4">CREATE FORM</h1>
      </div>

    </DefaultLayout>
  )
}
