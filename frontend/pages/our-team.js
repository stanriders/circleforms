import Head from 'next/head'
import Image from 'next/image'
import DefaultLayout from '../layouts'
import constants, { team } from '../constants'
import SVG from 'react-inlinesvg'
import { Fragment } from 'react'
import classNames from 'classnames'

export default function Home() {
  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - Our Team</title>
      </Head>

      <div className="flex justify-center relative py-6">
        <svg className="absolute -ml-32" width="499" height="76" viewBox="0 0 499 76" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="182.553" height="75.893" rx="37.9465" fill="#FF66AA"/>
          <rect x="283.061" width="129.223" height="75.893" rx="37.9465" fill="#FF66AA"/>
          <rect x="195" width="72" height="76" rx="35.8953" fill="#FF66AA"/>
          <rect x="424.59" width="73.8418" height="75.893" rx="36.9209" fill="#FF66AA"/>
        </svg>
        <h1 className="font-display text-6xl lg:text-8xl font-bold z-10 mt-4">OUR TEAM</h1>
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
                <h2 className="font-display font-bold text-xl lg:text-5xl ">
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

        <SVG className="w-full lg:w-auto col-span-2 text-white" src="/svg/logo.svg" alt="circle forms" />
      </div>
    </DefaultLayout>
  )
}
