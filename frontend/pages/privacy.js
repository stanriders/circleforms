import Head from 'next/head'
import Hero from '../components/Hero'
import DefaultLayout from '../layouts'

export default function Privacy() {
  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - Terms of Service</title>
      </Head>

      <Hero>
        <div className="flex flex-col justify-center items-center py-16 md:py-32 lg:pt-52 lg:pb-72">
          <p className="text-4xl font-alternates lg:-mt-10 text-center">
            There's nothing here yet.
          </p>
        </div>
      </Hero>
    </DefaultLayout>
  )
}
