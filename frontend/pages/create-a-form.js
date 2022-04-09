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
import Unauthorized from '../components/pages/Unauthorized'
import { useTranslations } from 'next-intl'

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
  const t = useTranslations()
  const { user } = useContext(UserContext)
  const [state, dispatch] = useReducer(reducer, initialState)

  if (!user) {
    return <Unauthorized />
  }

  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - { t('title') }</title>
      </Head>

      <Title title={t('subtitle')}>
        { t('createYour') } "<span className="text-pink">CircleForms</span>".
      </Title>

      <div className="space-y-9 px-4">
        <section className="container transition-opacity ease-out-cubic">
          <Tabs>
            <TabList>
              <Tab>{ t('tabs.design') }</Tab>
              <Tab>{ t('tabs.answers') }</Tab>
              <Tab>{ t('tabs.options') }</Tab>
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

export async function getStaticProps({ locale }) {
  const [translations, global] = await Promise.all([
    import(`../messages/create-a-form/${locale}.json`),
    import(`../messages/global/${locale}.json`),
  ])


  const messages = {
    ...translations,
    ...global
  }

  return {
    props: {
      messages
    }
  };
}