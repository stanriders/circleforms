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

export default function Home() {
  const { data, error, isValidating } = useSWR(
    `/posts/page/1?pageSize=4&filter=Active`,
    api
  )

  return (
    <DefaultLayout classname="">
      <Head>
        <title>CircleForms - Home</title>
      </Head>

      <div className="flex flex-col justify-center items-center h-screen">
        <SVG
          src="/svg/logo.svg"
          alt="CircleForms" />
          <p className="text-4xl font-alternates mt-4 text-center">
            an innovative solution for your osu! projects.
          </p>
          <div className="flex flex-col lg:flex-row mt-14 gap-8 pb-2 lg:pb-0">
            <Button theme="secondary" large>Create form!</Button>
            <Button theme="tertiary" large>Read more</Button>
          </div>
      </div>

      <div className="bg-black-darker w-full py-32">
        <section className="small-container">
          <div className="flex flex-col lg:flex-row justify-between items-center mb-8">
            <h2 className="text-6xl uppercase font-semibold">About project</h2>
            <SVG className="h-8 lg:h-11 lg:-ml-8" src="/svg/circles-sliders.svg" />
          </div>
          <div className="flex flex-col lg:flex-row gap-8 text-xl font-medium">
            <p className="lg:flex-1">
              CircleForms is an alternative to google forms, aimed at more convenient and faster moderation of various projects on osu!, including registration for tournaments and much more.
            </p>
            <p className="lg:flex-1">
              We are not associated with osu! staff in any way, this is only a community project. Furthermore, we haven't taken assets from osu!, nor we are making profit from this project. It is something we created in our free time, for the people.
            </p>
          </div>
        </section>
      </div>

      <div className="bg-black w-full py-24">
        <section className="container">
          <div className="mb-8 text-center">
            <h2 className="type-h1 uppercase">Recently created forms</h2>
            <p className="text-white text-opacity-50 text-2xl">See the latest projects from the community hosts!</p>
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
                  <p className="font-alternates font-semibold text-center">
                    No found forms.<br/>
                    Come back later!
                  </p>
                )}

                {data && data.length > 0 && data.map(form => (
                  <FormEntry key={form.id} {...form} />
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <Button href="/forms-list" theme="secondary">
                Show more!
              </Button>
            </div>
          </div>
        </section>
      </div>
    </DefaultLayout>
  )
}
