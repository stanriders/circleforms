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
import Unauthorized from '../components/pages/Unauthorized'
import { useTranslations } from 'next-intl'

export default function Dashboard() {
  const t = useTranslations()
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
    return <Unauthorized />
  }

  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - { t('title') }</title>
      </Head>

      <Title title={t('subtitle')}>
        { t('description') }
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
          {forms.map((form, index) => (
            <FormCard
              key={form?.id ? form.id : index}
              {...form} />
          ))}
        </div>
      </section>

    </DefaultLayout>
  )
}

export async function getStaticProps({ locale }) {
  const [translations, global] = await Promise.all([
    import(`../messages/dashboard/${locale}.json`),
    import(`../messages/global/${locale}.json`),
  ])


  const messages = {
    ...translations,
    ...global
  }

  return {
    props: {
      messages
    }
  };
}