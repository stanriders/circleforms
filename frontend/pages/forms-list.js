import Head from 'next/head'
import Image from 'next/image'
import Hero from '../components/Hero'
import DefaultLayout from '../layouts'
import constants from '../constants'
import SVG from 'react-inlinesvg'
import bigLogoImg from '../public/images/big-logo.png'
import Button from '../components/atoms/Button'
import FormEntry from '../components/atoms/FormEntry'
import SubTitle from '../components/atoms/SubTitle'
import Radio from '../components/atoms/Radio'
import { useEffect, useState } from 'react'

export default function Home() {
  const [filter, setFilter] = useState('all')

  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - Forms list</title>
      </Head>

      <section className="container mt-12">
        <div className="bg-black-dark2 rounded-70 mb-4">
          <div className="flex justify-between bg-black-lighter rounded-full">
            <div className="pl-20 pt-7 pb-4">
              <h2 className="uppercase text-5xl font-bold">Forms list</h2>
              <p className="text-white text-opacity-50 font-alternates">Get involved in community activities!</p>
            </div>
            <div className="flex flex-col items-center justify-center bg-black-lightest h-auto rounded-full px-8">
              <h3 className="text-3xl font-medium flex gap-x-2 mb-1">
                FILTERS
                <svg width="145" height="23" viewBox="0 0 145 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="122" width="23" height="23" rx="11.5" fill="white"/>
                  <rect width="118" height="23" rx="11.5" fill="white"/>
                </svg>
              </h3>
              <div className="space-x-2">
                <Radio
                  name="filter"
                  value="all"
                  onClick={e => setFilter(e.target.value)}
                  active={'all' === filter}>
                  All
                </Radio>
                <Radio
                  name="filter"
                  value="active"
                  color="bg-green"
                  onClick={e => setFilter(e.target.value)}
                  active={'active' === filter}>
                  Active
                </Radio>
                <Radio
                  name="filter"
                  value="inactive"
                  color="bg-red"
                  onClick={e => setFilter(e.target.value)}
                  active={'inactive' === filter}>
                  Inactive
                </Radio>
              </div>
            </div>
          </div>
          <div className="mt-6 px-7">
            <SubTitle>Pinned Forms</SubTitle>
            <div className="flex flex-col gap-y-3">
              <FormEntry />
            </div>
            <SubTitle>Forms</SubTitle>
            <div className="flex flex-col gap-y-3">
              <FormEntry />
              <FormEntry />
            </div>
            <div className="flex justify-center gap-x-6 py-8">
              <Button theme="grey">PREV</Button>
              <Button theme="grey" rounded active>1</Button>
              <Button theme="grey" rounded>2</Button>
              <Button theme="grey">NEXT</Button>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  )
}
