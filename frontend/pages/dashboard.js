import Head from 'next/head'
import Title from '../components/atoms/Title'
import Hero from '../components/Hero'
import DefaultLayout from '../layouts'
import Button from '../components/atoms/Button'
import FormCard from '../components/atoms/FormCard'
import { useContext, useEffect, useState } from 'react'
import SVG from 'react-inlinesvg'
import UserContext from '../components/context/UserContext'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
import classNames from 'classnames'
import useAuth from '../hooks/useAuth'
import Link from 'next/link'

export default function Dashboard() {
  const { user } = useContext(UserContext)
  const { invalidateUserCache } = useAuth()
  const [forms, setForms] = useState(Array.from({ length: 11 }))

  useEffect(() => {
    invalidateUserCache()
  }, [])

  useEffect(() => {
    if (user?.posts.length) {
      const newForms = [...forms]
      user.posts.forEach((el, index) => {
        newForms.splice(index, 1, el)
      })
      setForms(newForms)
    }
  }, [user])

  if (!user) {
    return (
      <DefaultLayout>
        <Head>
          <title>CircleForms - Not Authorized</title>
        </Head>

        <Hero>
          <div className="flex flex-col justify-center items-center py-16 md:py-32 lg:pt-52 lg:pb-72">
              <p className="text-4xl lg:-mt-10 text-center">
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

      <Title title="DASHBOARD">
        The place where your forms are stored.
      </Title>

      <section className="container bg-black-lightest rounded-40 px-8 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <Link href="/create-a-form" passHref>
            <a
              className="flex justify-center items-center bg-pink rounded-20 h-40 transition-transform ease-out-cubic hover:scale-99"
              title="Create your form">
                <SVG src="/svg/plus.svg" />
            </a>
          </Link>
          {forms.map(form => (
            <FormCard key={form.id} {...form} />
          ))}
        </div>
      </section>

    </DefaultLayout>
  )
}
