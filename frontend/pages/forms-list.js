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
import useSWR from 'swr'
import api from '../libs/api'
import Loading from '../components/atoms/Loading'

export default function FormsList() {
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)

  const { data, error, isValidating } = useSWR(
    `/posts/page/${page}?filter=${filter}&pageSize=10`,
    api
  )

  // Handle direct link to page and/or filter
  useEffect(() => {
    const qs = new URLSearchParams(window.location.search)
    setFilter(qs.get('filter') || 'all')
    setPage(qs.get('page') || 1)
  }, [])

  // Update history and url when filter/page changes
  useEffect(() => {
    history.pushState(null, null, `/forms-list?page=${page}&filter=${filter}`)
  }, [filter, page])

  // Go to first page when filter changes
  useEffect(() => {
    setPage(1)
  }, [filter])

  function handlePrevClick() {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  return (
    <DefaultLayout classname="items-stretch">
      <Head>
        <title>CircleForms - Forms list (page {page})</title>
      </Head>

      <section className="container mt-12 h-full">
        <div className="bg-black-dark2  rounded-70 mb-4">
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
              <FormEntry
                title="nik's winter cup 2022 Registration"
                description="osu!standard, scorev2, 1v1 tournament"
                author_id="nik"
              />
            </div>
            <SubTitle>Forms</SubTitle>
            <div className="flex flex-col gap-y-3 relative">
              {isValidating && (
                <div className="flex justify-center absolute top-4 z-50 left-1/2 transform -translate-x-1/2">
                  <Loading />
                </div>
              )}
              {data && data.length > 0 && data.map(form => (
                <FormEntry key={form.id} {...form} />
              ))}
            </div>
            <div className="flex justify-center gap-x-6 py-8">
              <Button theme="grey" onClick={handlePrevClick}>PREV</Button>
              <Button theme="grey" rounded active>{page}</Button>
              <Button theme="grey" onClick={() => setPage(page + 1)}>NEXT</Button>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  )
}
