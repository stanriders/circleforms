import Head from 'next/head'
import Image from 'next/image'
import Hero from '../components/Hero'
import DefaultLayout from '../layouts'
import constants from '../constants'
import SVG from 'react-inlinesvg'
import Button from '../components/atoms/Button'
import FormEntry from '../components/atoms/FormEntry'
import useSWR from 'swr'
import api from '../libs/api'
import Loading from '../components/atoms/Loading'
import { useTranslations } from 'next-intl'

export default function Home() {
  const { data, error, isValidating } = useSWR(
    `/posts/page/1?pageSize=4&filter=Active`,
    api
  )
  const t = useTranslations()

  return (
    <DefaultLayout classname="">
      <Head>
        <title>CircleForms - { t('title') }</title>
      </Head>

      <div className="flex flex-col justify-center items-center min-h-screen">
        <SVG
          className="w-3/4 max-w-6xl"
          src="/svg/logo.svg"
          alt="CircleForms" />
          <p className="font-museo lg:text-4xl mt-4 text-center">
            { t('description') }
          </p>
          <div className="flex flex-col lg:flex-row mt-14 gap-8 pb-2 lg:pb-0">
            <Button theme="secondary" large>{ t('createForm') }</Button>
            <Button theme="tertiary" large>{ t('readMore') }</Button>
          </div>
      </div>

      <div className="bg-black-darker w-full py-32">
        <section className="small-container">
          <div className="flex flex-col lg:flex-row justify-between items-center mb-8">
            <h2 className="text-6xl uppercase font-semibold">
              { t('about.title') }
            </h2>
            <SVG className="h-8 lg:h-11 lg:-ml-8" src="/svg/circles-sliders.svg" />
          </div>
          <div className="flex flex-col lg:flex-row gap-8 text-xl font-medium">
            <p className="lg:flex-1">
              { t('about.first') }
            </p>
            <p className="lg:flex-1">
              { t('about.second') }
            </p>
          </div>
        </section>
      </div>

      <div className="bg-black w-full py-24">
        <section className="container">
          <div className="mb-8 text-center">
            <h2 className="type-h1 uppercase">
              { t('recentForms.title') }
            </h2>
            <p className="text-white text-opacity-50 text-2xl">
              { t('recentForms.description') }
            </p>
          </div>
          <div className="rounded-3xl bg-black-darker p-6">
            <div className="flex flex-col gap-y-2 z-10 relative">
            <div className="absolute inset-0 z-20 pointer-events-none" style={{
              background: `linear-gradient(rgba(12, 12, 12, 0) 22%, rgb(12, 12, 12) 113.44%)`
            }}></div>
              <div className="relative space-y-3">
                {isValidating && (
                  <div className="flex justify-center absolute top-4 z-50 left-1/2 transform -translate-x-1/2">
                    <Loading />
                  </div>
                )}

                {data && data.length === 0 && (
                  <p className="font-semibold text-center">
                    { t('noForms') }
                  </p>
                )}

                {data && data.posts.length > 0 && data.posts.map(form => {
                  const user = data.users.find(user => user.id === form.author_id)
                  return (
                    <FormEntry
                      key={form.id}
                      user={user}
                      {...form} />
                  )
                })}
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <Button href="/forms" theme="secondary">
                { t('showMore') }
              </Button>
            </div>
          </div>
        </section>
      </div>
    </DefaultLayout>
  )
}

export async function getStaticProps({ locale }) {
  const [translations, global] = await Promise.all([
    import(`../messages/index/${locale}.json`),
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