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
import { Fragment, useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import api from '../libs/api'
import Loading from '../components/atoms/Loading'
import { useRouter } from 'next/router'
import FormEntrySkeletonList from '../components/molecules/FormEntrySkeletonList'

export default function FormsList() {
  const router = useRouter()
  const [filter, setFilter] = useState('Both')
  const [page, setPage] = useState(1)

  const {
    data: pinnedForms,
    error: pinnedError,
    isValidating: pinnedValidating
  } = useSWR(
    `/posts/page/pinned`,
    api
  )

  const { data, error, isValidating } = useSWR(
    `/posts/page/${page}?filter=${filter}&pageSize=10`,
    api
  )

  // Handle direct link to page and/or filter
  useEffect(() => {
    const qs = new URLSearchParams(window.location.search)
    const qsPage = Number(qs.get('page'))
    const qsFilter = qs.get('filter')

    if (qsPage > 0) {
      setPage(qsPage)
    }

    if (['Both', 'Active', 'Inactive'].includes(qsFilter)) {
      setFilter(qsFilter)
    }
  }, [])

  // Update history and url when filter/page changesp
  useEffect(() => {
    router.push({
      query: {
        page,
        filter,
      },
    }, undefined, {
      scroll: false,
    })
  }, [filter, page])


  function handlePrevClick() {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  function handleFilterClick(value) {
    setFilter(value)

    if (page === 1) return
    setPage(1)
  }

  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - Forms (page {page})</title>
      </Head>

      <section className="container max-height">
        <div className="flex flex-col justify-between mb-12 bg-black-dark2 rounded-70 h-full">
          <div className="h-full">
            <div className="flex flex-col lg:flex-row justify-between bg-black-lighter rounded-full">
              <div className="pl-20 pt-7 pb-4">
                <h2 className="uppercase text-5xl font-bold">Forms list</h2>
                <p className="text-white text-opacity-50">Get involved in community activities!</p>
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
                    value="Both"
                    onClick={e => handleFilterClick(e.target.value)}
                    active={'Both' === filter}>
                    All
                  </Radio>
                  <Radio
                    name="filter"
                    value="Active"
                    color="bg-green"
                    onClick={e => handleFilterClick(e.target.value)}
                    active={'Active' === filter}>
                    Active
                  </Radio>
                  <Radio
                    name="filter"
                    value="Inactive"
                    color="bg-red"
                    onClick={e => handleFilterClick(e.target.value)}
                    active={'Inactive' === filter}>
                    Inactive
                  </Radio>
                </div>
              </div>
            </div>
            <div className="mt-6 px-7">
              {pinnedForms && pinnedForms.posts.length > 0 && (
                <Fragment>
                  <SubTitle>Pinned Forms</SubTitle>
                  <div className="flex flex-col gap-y-3">
                    {pinnedForms && pinnedForms.posts.length > 0 && pinnedForms.posts.map(form => (
                      <FormEntry
                        key={form.id}
                        author={pinnedForms.authors[form.author_id]}
                        {...form} />
                    ))}
                  </div>
                </Fragment>
              )}

              <SubTitle>Forms</SubTitle>
              <div className="flex flex-col gap-y-3 relative">
                {!data && isValidating && (
                  <FormEntrySkeletonList length={10} />
                )}
                {data && data.posts.length === 0 && (
                  <p className="font-semibold text-center">
                    No found forms.<br/>
                    Come back later!
                  </p>
                )}
                {data && data.posts.length > 0 && data.posts.map(form => (
                  <FormEntry
                    key={form.id}
                    author={data.authors[form.author_id]}
                    {...form} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-x-6 py-8">
            <Button theme="grey" onClick={handlePrevClick}>PREV</Button>
            <Button theme="grey" rounded active>{page}</Button>
            <Button theme="grey" onClick={() => setPage(page + 1)}>NEXT</Button>
          </div>
        </div>
      </section>
    </DefaultLayout>
  )
}
