import Head from 'next/head'
import Hero from '../components/Hero'
import DefaultLayout from '../layouts'
import Button from '../components/atoms/Button'
import { useContext, useEffect } from 'react'
import SVG from 'react-inlinesvg'
import UserContext from '../components/context/UserContext'
import FormThumbnail from '../components/atoms/FormThumbnail'
import useAuth from '../hooks/useAuth'

export default function Settings() {
  const { user } = useContext(UserContext)
  const { invalidateCache } = useAuth()

  useEffect(() => {
    invalidateCache()
  }, [])

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
        <title>CircleForms - Settings</title>
      </Head>


      <div className="flex justify-center relative py-6">
        <svg className="absolute -ml-32" width="499" height="76" viewBox="0 0 499 76" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="182.553" height="75.893" rx="37.9465" fill="#FF66AA"/>
          <rect x="283.061" width="129.223" height="75.893" rx="37.9465" fill="#FF66AA"/>
          <rect x="195" width="72" height="76" rx="35.8953" fill="#FF66AA"/>
          <rect x="424.59" width="73.8418" height="75.893" rx="36.9209" fill="#FF66AA"/>
        </svg>
        <div className="z-10 text-center">
          <h1 className="text-6xl lg:text-8xl font-bold  mt-4">SETTINGS</h1>
          <p className="text-2xl font-alternates mt-2">Link your accounts and edit recently submitted forms.</p>
        </div>
      </div>

      <section className="container bg-black-dark2 rounded-70 px-10 py-8">
        <div className="space-y-8">
          {/* osu! integration */}
          <div className="flex justify-between bg-black-lightest rounded-40 px-6 py-4">
            <div className="flex items-center">
              <img
                className="h-28 w-28 rounded-full"
                src={user.avatar_url}
                alt={user.username} />
              <div className="pl-3">
                <h2 className="font-bold text-3xl">osu!</h2>
                <p className="font-alternates text-sm">osu! integration for CircleForms</p>
              </div>
            </div>
            <div className="flex flex-col justify-center text-right text-lg text-white text-opacity-50">
              <p>Connected to {user.id} ({user.username})</p>
              <p>with {user.posts.length} submitted forms</p>
            </div>
          </div>

          {/* Discord integration */}
          <div className="flex justify-between bg-black-lightest rounded-40 px-6 py-4">
            <div className="flex items-center">
              <div className="w-28 h-28 flex items-center justify-center">
                <SVG
                  className="w-full p-4"
                  src="/svg/discord.svg" />
              </div>
              <div className="pl-3">
                <h2 className="font-bold text-3xl">Discord</h2>
                <p className="font-alternates text-sm">Discord integration for CircleForms</p>
              </div>
            </div>
            <div className="flex flex-col justify-center text-right text-lg text-white text-opacity-50">
              <Button disabled style={{
                outlineColor: '#5865F2',
                color: '#5865F2'
              }}>Connect</Button>
            </div>
          </div>
        </div>

        <h2 className="text-6xl font-bold text-center mt-9 mb-8">RECENTLY SUBMITTED FORMS</h2>

        <div className="flex flex-wrap gap-4 bg-black-lightest rounded-40 px-4 py-3">
          {user.posts.length === 0 && (
            <p className="text-center flex-1 text-xl font-alternates">No recent forms submitted.</p>
          )}

          {user.posts.map(post => (
            <FormThumbnail key={post.id} {...post} />
          ))}
        </div>
      </section>

    </DefaultLayout>
  )
}
