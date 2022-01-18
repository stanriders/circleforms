import Head from 'next/head'
import Image from 'next/image'
import Hero from '../components/Hero'
import DefaultLayout from '../layouts'
import constants from '../constants'

import bigLogoImg from '../public/images/big-logo.png'

export default function Home() {
  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms</title>
        <meta name="description" content={constants.meta.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero>
        <div className="flex justify-center items-center lg:items-start lg:pt-32">
          <Image
            src={bigLogoImg}
            alt="CircleForms" />
        </div>
      </Hero>

      <main>
        <div className="bg-grey-dark text-white px-14 py-8">
          <h2 className="text-grey-light text-6xl mb-5">ABOUT</h2>

          <p>
            <strong>CircleForms</strong> is an alternative to google forms, aimed at more convenient and faster moderation of various projects on osu!, including registration for tournaments and much more.
          </p>
        </div>
      </main>
    </DefaultLayout>
  )
}
