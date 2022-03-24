import Head from 'next/head'
import Hero from '../components/Hero'
import DefaultLayout from '../layouts'
import Button from '../components/atoms/Button'
import FormCard from '../components/atoms/FormCard'
import { useContext, useState } from 'react'
import SVG from 'react-inlinesvg'
import UserContext from '../components/context/UserContext'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
import classNames from 'classnames'

export default function Dashboard() {
  const { user } = useContext(UserContext)
  const [isFormOpen, setIsFormOpen] = useState(false)

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
        <title>CircleForms - Dashboard</title>
      </Head>

      <div className="flex justify-center relative py-6">
        <svg className="absolute -ml-32" width="499" height="76" viewBox="0 0 499 76" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="182.553" height="75.893" rx="37.9465" fill="#FF66AA"/>
          <rect x="283.061" width="129.223" height="75.893" rx="37.9465" fill="#FF66AA"/>
          <rect x="195" width="72" height="76" rx="35.8953" fill="#FF66AA"/>
          <rect x="424.59" width="73.8418" height="75.893" rx="36.9209" fill="#FF66AA"/>
        </svg>
        <div className="z-10 text-center">
          <h1 className="font-alternates text-6xl lg:text-8xl font-bold z-10 mt-4">DASHBOARD</h1>
          <p className="text-2xl font-alternates mt-2">
            Create your "<span className="text-pink">CircleForms</span>".
          </p>
        </div>
      </div>

      <div className="space-y-9">
        <section className="container bg-black-lightest rounded-40 px-8 py-5">
          <div class="grid grid-cols-4 gap-x-10">
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex justify-center items-center bg-pink rounded-20 h-40 transition-transform ease-out-cubic hover:scale-99"
              title="Create your form">
                <SVG src="/svg/plus.svg" />
            </button>
            <FormCard />
            <FormCard />
            <FormCard />
          </div>
        </section>

        {/* Form design */}
        <section className={classNames(
          "container transition-opacity ease-out-cubic", isFormOpen ? 'opacity-100': 'opacity-0'
        )}>
          <Tabs>
            <TabList>
              <Tab>Design</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <span className="font-alternates font-semibold text-3xl">
                  Icon
                </span>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </section>

        {/* Questions / Responses / Options */}
        <section className={classNames(
          "container transition-opacity ease-out-cubic", isFormOpen ? 'opacity-100': 'opacity-0'
        )}>
          <Tabs>
            <TabList>
              <Tab>Questions</Tab>
              <Tab>Responses</Tab>
              <Tab>Options</Tab>
            </TabList>

            <TabPanels className="bg-black-lightest px-8 py-5 rounded-b-3xl">
              <TabPanel>
                <span className="font-alternates font-semibold text-3xl">
                  Questions
                </span>
              </TabPanel>
              <TabPanel>
                <span className="font-alternates font-semibold text-3xl">
                  Responses
                </span>
              </TabPanel>
              <TabPanel>
                <span className="font-alternates font-semibold text-3xl">
                  Options
                </span>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </section>
      </div>

    </DefaultLayout>
  )
}
