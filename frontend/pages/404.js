import Head from 'next/head'
import Hero from '../components/Hero'
import DefaultLayout from '../layouts'
import Button from '../components/atoms/Button'

export default function Home() {
  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - 404</title>
      </Head>

      <Hero>
        <div className="flex flex-col justify-center items-center py-16 md:py-32 lg:pt-52 lg:pb-72">
            <p className="text-4xl font-alternates lg:-mt-10 text-center">
              There's nothing here.
            </p>
            <div className="flex flex-col lg:flex-row mt-14 gap-8 pb-2 lg:pb-0">
              <Button theme="secondary" large href="/">Go back!</Button>
            </div>
        </div>
      </Hero>
    </DefaultLayout>
  )
}
