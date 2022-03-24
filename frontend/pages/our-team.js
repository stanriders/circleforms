import Head from 'next/head'
import Image from 'next/image'
import DefaultLayout from '../layouts'
import constants, { team } from '../constants'
import SVG from 'react-inlinesvg'
import { Fragment } from 'react'
import classNames from 'classnames'

export default function OurTeam() {
  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - Our Team</title>
      </Head>

      <div className="flex justify-center relative py-6">
        <img src="/images/team-decoration.png" className="absolute -ml-32" alt="team" />
        <h1 className="font-alternates text-6xl lg:text-8xl font-bold z-10 mt-4">OUR TEAM</h1>
      </div>

      <div className="grid grid-cols-2  lg:grid-cols-4 mt-4">
        {constants.team.map((member, index) => {
          const MemberImage = () => (
            <img
              className="w-full"
              src={`/images/${member.name.toLowerCase()}.png`}
              alt={member.name} />
          )

          return (
            <Fragment key={member.name}>
              {index >= 0 && index <= 1 && (
                <MemberImage />
              )}
              {index >= 4 && (
                <MemberImage />
              )}
              <div className={classNames(
                "flex flex-col justify-center px-8",
                member.name === 'StanR'
                  ? 'bg-pink text-pink-darker'
                  : 'bg-black-lightest text-white',
                index >= 2  && index <= 3 ? 'text-right' : ''
                )}>
                <h2 className="font-alternates font-bold text-xl lg:text-5xl ">
                  {member.name}
                </h2>
                <p className="font-light lg:text-2xl">
                  {member.role}
                </p>
              </div>
              {index >= 2 && index <= 3 && (
                <MemberImage />
              )}
            </Fragment>
          )
        })}

        <a href="https://discord.gg/rx9RKQsy9H" className="flex justify-center items-center bg-blue-discord col-span-2 text-white focus:brightness-90 hover:brightness-90 transition py-8 lg:py-0">
          <SVG className="w-32" src="/svg/discord.svg" alt="Join our Discord" />
        </a>
      </div>
    </DefaultLayout>
  )
}
