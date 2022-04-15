import Head from 'next/head'
import Title from '../components/atoms/Title'
import Hero from '../components/Hero'
import DefaultLayout from '../layouts'
import Button from '../components/atoms/Button'
import FormCard from '../components/atoms/FormCard'
import { useContext, useEffect, useReducer, useState } from 'react'
import SVG from 'react-inlinesvg'
import UserContext from '../components/context/UserContext'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
import classNames from 'classnames'
import InputFile from '../components/atoms/InputFile'
import Unauthorized from '../components/pages/Unauthorized'
import { useTranslations } from 'next-intl'
import toast, { Toaster } from 'react-hot-toast'
import {
  Listbox,
  ListboxOption,
} from "@reach/listbox";
import api from '../libs/api'
import {
  MdAddCircleOutline,
  MdClose,
  MdDeleteOutline,
  MdRadioButtonChecked,
  MdCheckBox,
  MdShortText
} from 'react-icons/md'

const COMPONENTS_TYPES = {
  'Choice': CreateChoice,
  'Checkbox': CreateCheckbox,
  'Freeform': CreateFreeform,
}

const QUESTIONS_TYPES = [
  'Checkbox',
  'Freeform',
  'Choice'
]

const QUESTIONS_ICONS = {
  'Checkbox': MdCheckBox,
  'Freeform': MdShortText,
  'Choice': MdRadioButtonChecked,
}

const ACCESSIBILITY_OPTIONS = [
  'Public',
  'Link',
  'FriendsOnly',
  'Whitelist',
]

const types = {
  SET_TITLE: "SET_TITLE",
  SET_DESCRIPTION: "SET_DESCRIPTION",
  SET_EXCERPT: "SET_EXCERPT",
  SET_ACCESSIBILITY: "SET_ACCESSIBILITY",
  SET_LIMITATIONS: "SET_LIMITATIONS",
  ADD_QUESTION: "ADD_QUESTION",
  REMOVE_QUESTION: "REMOVE_QUESTION",
  ADD_QUESTION_INFO: "ADD_QUESTION_INFO",
  REMOVE_QUESTION_INFO: "REMOVE_QUESTION_INFO",
  EDIT_QUESTION_TITLE: "EDIT_QUESTION_TITLE",
  EDIT_QUESTION_INFO: "EDIT_QUESTION_INFO",
  SET_ICON: "SET_ICON",
  SET_BANNER: "SET_BANNER",
}

const initialState = {
  title: '',
  description: '',
  excerpt: '',
  accessibility: 'Public',
  limitations: null,
  questions: [],
  icon: [],
  banner: [],
}

function reducer(state, action) {
  switch (action.type) {
    case types.SET_TITLE:
      return {
        ...state,
        title: action.value,
      }
    case types.SET_EXCERPT:
      return {
        ...state,
        excerpt: action.value,
      }
    case types.SET_DESCRIPTION:
      return {
        ...state,
        description: action.value,
      }
    case types.ADD_QUESTION:
      return {
        ...state,
        questions: [...state.questions, action.value]
      }
    case types.REMOVE_QUESTION:
      return {
        ...state,
        questions: state.questions.filter((question, index) => index !== action.value.index)
      }
    case types.ADD_QUESTION_INFO:
      return {
        ...state,
        questions: state.questions.map((question, index) => {
          if (index === action.value.index) {
            return {
              ...question,
              question_info: [
                ...question.question_info,
                `Option ${question.question_info.length + 1}`
              ]
            }
          }
          return question
        })
      }
    case types.REMOVE_QUESTION_INFO:
      return {
        ...state,
        questions: state.questions.map((question, index) => {
          if (index === action.value.index) {
            return {
              ...question,
              question_info: question.question_info.filter((info, index) => index !== action.value.infoIndex)
            }
          }
          return question
        })
      }
    case types.EDIT_QUESTION_TITLE:
      return {
        ...state,
        questions: state.questions.map((question, index) => {
          if (index === action.value.index) {
            return {
              ...question,
              title: action.value.title
            }
          }
          return question
        })
      }
    case types.EDIT_QUESTION_INFO:
      return {
        ...state,
        questions: state.questions.map((question, index) => {
          if (index === action.value.index) {
            return {
              ...question,
              question_info: question.question_info.map((info, infoIndex) => {
                if (infoIndex === action.value.infoIndex) {
                  return action.value.value
                }
                return info
              })
            }
          }
          return question
        })
      }
    case types.SET_ACCESSIBILITY:
      return {
        ...state,
        accessibility: action.value.accessibility
      }
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
  const [errors, setErrors] = useState([])

  if (!user) {
    return <Unauthorized />
  }

  async function submitForm() {
    const response = await api('/posts', {
      method: 'POST',
      body: JSON.stringify(state)
    })
    const data = await response.json()
    return data
  }

  async function submitImages(id) {
    if (state.icon.length > 0) {
      const body = new FormData()
        .append('image', state.icon[0])

      await api(`/posts/${id}/files?query=Icon`, {
        method: 'PUT',
        body
      })
    }

    if (state.banner.length > 0) {
      const body = new FormData()
        .append('image', state.banner[0])

      await api(`/posts/${id}/files?query=Banner`, {
        method: 'PUT',
        body
      })
    }
  }

  async function submit() {
    const data = await submitForm()

    console.log('Uploading images')
    await submitImages(data.id)

    console.log('Done')
    // Redirection to single form?
  }

  async function handleSubmit() {
    if (errors.length > 0) {
      return toast.error(t('toast.userError'))
    }

    toast.promise(
      submit(),
      {
        loading: t('toast.loading'),
        success: t('toast.success'),
        error: t('toast.error')
      }
    )
  }

  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - { t('title') }</title>
      </Head>

      <Toaster />

      <Title title={t('subtitle')}>
        { t('createYour') } "<span className="text-pink">CircleForms</span>".
      </Title>

      <section className="container space-y-8 mb-12">
        <Tabs>
          <TabList>
            <Tab>{ t('tabs.design') }</Tab>
            <Tab>{ t('tabs.questions') }</Tab>
            <Tab>{ t('tabs.options') }</Tab>
          </TabList>

          <TabPanels className="bg-black-lightest px-8 py-5 rounded-b-3xl">
            {/* Design */}
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
            {/* Questions */}
            <TabPanel className="relative">
              <div className="
                absolute -right-28 top-0
                rounded-35 bg-black-lightest py-8 px-2
                flex flex-col items-center
              ">
                <button className="button--icon">
                  <MdAddCircleOutline className="w-10 h-10" />
                </button>

                {QUESTIONS_TYPES.map(type => {
                  const Icon = QUESTIONS_ICONS[type]

                  return (
                    <button
                      key={type}
                      className="button--icon"
                      onClick={() => dispatch({
                      type: types.ADD_QUESTION,
                      value: {
                        title: '',
                        type,
                        is_optional: false,
                        question_info: []
                      }
                    })}>
                      <span className="sr-only">
                        {t('add')} {t(`inputs.${type}`)}
                      </span>
                      <Icon className="w-10 h-10" />
                    </button>
                  )
                })}
              </div>
              <div className="flex flex-col gap-y-4">
                <div className="flex flex-col gap-y-4 rounded-35 bg-black-lighter pt-5 pb-8 px-14 relative overflow-clip">
                  <div
                    className="absolute left-0 top-0 bg-pink h-2 w-full"
                  />
                  <input
                    className="input--inline input--title"
                    type="text"
                    placeholder={t('placeholders.title')}
                    defaultValue={t('placeholders.titleValue')}
                    onChange={(e) => dispatch({
                      type: types.SET_TITLE,
                      value: e.target.value
                    })} />
                  <input
                    className="input--inline"
                    type="text"
                    placeholder={t('placeholders.excerpt')}
                    onChange={(e) => dispatch({
                      type: types.SET_EXCERPT,
                      value: e.target.value
                    })} />
                  <textarea
                    className="input--inline"
                    placeholder={t('placeholders.description')}
                    onChange={(e) => dispatch({
                      type: types.SET_DESCRIPTION,
                      value: e.target.value
                    })}></textarea>
                </div>

                {state.questions.map((question, index) => {
                  const Component = COMPONENTS_TYPES[question.type]

                  return (
                    <Component
                      key={index}
                      {...question}
                      onAdd={() => dispatch({
                        type: types.ADD_QUESTION_INFO,
                        value: { index }
                      })}
                      onRemove={() => dispatch({
                        type: types.REMOVE_QUESTION,
                        value: { index }
                      })}
                      onRemoveInfo={(infoIndex) => dispatch({
                        type: types.REMOVE_QUESTION_INFO,
                        value: { index, infoIndex }
                      })}
                      onEditTitle={(newTitle) => dispatch({
                        type: types.EDIT_QUESTION_TITLE,
                        value: { index, title: newTitle }
                      })}
                      onEdit={(infoIndex, value) => dispatch({
                        type: types.EDIT_QUESTION_INFO,
                        value: { index, infoIndex, value }
                      })}
                      t={t}
                    />
                  )
                })}
              </div>
            </TabPanel>
            {/* Options */}
            <TabPanel>
              <Listbox
                onChange={(accessibility) => dispatch({
                  type: types.SET_ACCESSIBILITY,
                  value: { accessibility }
                })}
                defaultValue={ACCESSIBILITY_OPTIONS[0]}>
                {ACCESSIBILITY_OPTIONS.map((option) => (
                  <ListboxOption
                    key={option}
                    value={option}>
                    {t(`accessibility.${option}`)}
                  </ListboxOption>
                ))}
              </Listbox>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <div className="flex justify-center">
          <Button onClick={handleSubmit}>
            { t('createForm') }
          </Button>
        </div>
      </section>

    </DefaultLayout>
  )
}

function CreateChoice({
  title,
  type,
  is_optional,
  question_info,
  onAdd,
  onRemove,
  onRemoveInfo,
  onEditTitle,
  onEdit,
  t,
}) {
  return (
    <div className="flex flex-col gap-y-4 rounded-35 bg-black-lighter pt-4 pb-6 px-14">
      <input
        className="input--inline"
        type="text"
        placeholder={t(`placeholders.${type}`)}
        value={title}
        onChange={(e) => onEditTitle(e.target.value)}
      />
      {question_info.map((info, index) => (
        <div key={`${title}-${index}`} className="flex gap-x-2 items-center">
          <div className="h-4 w-4 rounded-full border-2" />
          <input
            className="input--inline"
            type="text"
            value={info}
            onChange={(e) => onEdit(index, e.target.value)}
          />
          <button className="button--icon" title={t('removeOption')} onClick={() => onRemoveInfo(index)}>
            <span className="sr-only">{t('removeOption')}</span>
            <MdClose />
          </button>
        </div>
      ))}
      <div className="flex gap-x-2 items-center">
        <div className="h-4 w-4 rounded-full border-2" />
        <input
          className="input--inline"
          type="text"
          defaultValue={t('addChoice')}
          readOnly
          onClick={onAdd}
        />
      </div>
      <button
        title={t('removeQuestion')}
        className="button--icon"
        onClick={onRemove}>
        <span className="sr-only">{t('removeQuestion')}</span>
        <MdDeleteOutline className="h-6 w-6" />
      </button>
    </div>
  )
}

function CreateCheckbox({
  title,
  type,
  is_optional,
  question_info,
  onAdd,
  onRemove,
  onRemoveInfo,
  onEditTitle,
  onEdit,
  t,
}) {
  return (
    <div className="flex flex-col gap-y-4 rounded-35 bg-black-lighter pt-4 pb-6 px-14">
      <input
        className="input--inline"
        type="text"
        value={title}
        placeholder={t(`placeholders.${type}`)}
        onChange={(e) => onEditTitle(e.target.value)}
      />
      {question_info.map((info, index) => (
        <div key={`${title}-${index}`} className="flex gap-x-2 items-center">
          <div className="h-4 w-4 border-2" />
          <input
            className="input--inline"
            type="text"
            value={info}
            onChange={(e) => onEdit(index, e.target.value)}
          />
          <button className="button--icon" title={t('removeOption')} onClick={() => onRemoveInfo(index)}>
            <span className="sr-only">{t('removeOption')}</span>
            <MdClose />
          </button>
        </div>
      ))}
      <div className="flex gap-x-2 items-center">
        <div className="h-4 w-4 border-2" />
        <input
          className="input--inline"
          type="text"
          defaultValue={t('addChoice')}
          readOnly
          onClick={onAdd}
        />
      </div>
      <button
        title={t('removeQuestion')}
        className="button--icon"
        onClick={onRemove}>
        <span className="sr-only">{t('removeQuestion')}</span>
        <MdDeleteOutline className="h-6 w-6" />
      </button>
    </div>
  )
}

function CreateFreeform({
  title,
  type,
  is_optional,
  question_info,
  onAdd,
  onRemove,
  onEditTitle,
  onEdit,
  t,
}) {
  return (
    <div className="flex flex-col gap-y-4 rounded-35 bg-black-lighter pt-4 pb-6 px-14">
      <input
        className="input--inline"
        type="text"
        value={title}
        placeholder={t(`placeholders.${type}`)}
        onChange={(e) => onEditTitle(e.target.value)}
      />
      <p className="border-b border-dotted pb-2 select-none">
        {t(`${type}.description`)}
      </p>
      <button
        title={t('removeQuestion')}
        className="button--icon"
        onClick={onRemove}>
        <span className="sr-only">{t('removeQuestion')}</span>
        <MdDeleteOutline className="h-6 w-6" />
      </button>
    </div>
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