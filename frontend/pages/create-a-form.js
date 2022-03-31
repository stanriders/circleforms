import Head from 'next/head'
import Title from '../components/atoms/Title'
import Hero from '../components/Hero'
import DefaultLayout from '../layouts'
import Button from '../components/atoms/Button'
import FormCard from '../components/atoms/FormCard'
import { useContext, useEffect, useReducer } from 'react'
import SVG from 'react-inlinesvg'
import UserContext from '../components/context/UserContext'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
import classNames from 'classnames'
import InputFile from '../components/atoms/InputFile'

const types = {
  SET_ICON: "SET_ICON",
  SET_BANNER: "SET_BANNER",
}

const initialState = {
  icon: [],
  banner: [],
}

function reducer(state, action) {
  switch (action.type) {
    case types.SET_ICON:
      return {
        ...state,
        icon: action.value,
      }
    case types.SET_BANNER:
      return {
        ...state,
        banner: action.value,
      }
    default:
      return state
  }
};

export default function Dashboard() {
  const { user } = useContext(UserContext)
  const [state, dispatch] = useReducer(reducer, initialState)

  if (!user) {
    return (
      <DefaultLayout>
        <Head>
          <title>CircleForms - Not Authorized</title>
        </Head>

        <Hero>
          <div className="flex flex-col justify-center items-center py-16 md:py-32 lg:pt-52 lg:pb-72">
              <p className="text-4xl lg:-mt-10 text-center">
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
        <title>CircleForms - Create a form</title>
      </Head>

      <Title title="CREATE FORM">
        Create your "<span className="text-pink">CircleForms</span>".
      </Title>

      <div className="space-y-9 px-4">
        <section className="container transition-opacity ease-out-cubic">
          <Tabs>
            <TabList>
              <Tab>Design</Tab>
              <Tab>Questions</Tab>
              <Tab>Options</Tab>
            </TabList>

            <TabPanels className="bg-black-lightest px-8 py-5 rounded-b-3xl">
              <TabPanel>
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-y-8 gap-x-24">
                  <div className="lg:col-span-2">
                    <InputFile
                      classname="aspect-square"
                      label="Icon"
                      name="icon"
                      value={state.icon}
                      onChange={(files) => dispatch({
                        type: types.SET_ICON,
                        value: files
                      })} />
                  </div>
                  <div className="lg:col-span-4">
                    <InputFile
                      label="Banner"
                      name="banner"
                      value={state.banner}
                      onChange={(files) => dispatch({
                        type: types.SET_BANNER,
                        value: files
                      })} />
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <span className="font-semibold text-3xl">
                  Questions
                </span>
              </TabPanel>
              <TabPanel>
                <span className="font-semibold text-3xl">
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
