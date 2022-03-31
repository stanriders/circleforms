import Head from 'next/head'
import Title from '../components/atoms/Title'
import Hero from '../components/Hero'
import DefaultLayout from '../layouts'
import Button from '../components/atoms/Button'
import { useContext, useEffect } from 'react'
import SVG from 'react-inlinesvg'
import UserContext from '../components/context/UserContext'
import FormThumbnail from '../components/atoms/FormThumbnail'
import useAuth from '../hooks/useAuth'
import Unauthorized from '../components/pages/Unauthorized'

export default function Settings() {
  const { user } = useContext(UserContext)
  const { invalidateUserCache } = useAuth()

  useEffect(() => {
    invalidateUserCache()
  }, [])

  if (!user) {
    return <Unauthorized />
  }

  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - Settings</title>
      </Head>

      <Title title="SETTINGS">
        <p className="text-2xl mt-2">
          Link your accounts and edit recently submitted forms.
        </p>
      </Title>

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
                <p className="text-sm">osu! integration for CircleForms</p>
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
                <p className="text-sm">Discord integration for CircleForms</p>
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
      </section>
    </DefaultLayout>
  )
}
