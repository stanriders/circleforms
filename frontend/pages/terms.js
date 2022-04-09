import Head from 'next/head'
import Hero from '../components/Hero'
import DefaultLayout from '../layouts'

export default function Terms() {
  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - Terms of Service</title>
      </Head>

      <Hero>
        <div className="flex flex-col justify-center items-center py-16 md:py-32 lg:pt-52 lg:pb-72">
          <p className="text-4xl lg:-mt-10 text-center">
            There's nothing here yet.
          </p>
        </div>
      </Hero>
    </DefaultLayout>
  )
}

export async function getStaticProps({ locale }) {
  const [translations, global] = await Promise.all([
    import(`../messages/terms/${locale}.json`),
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