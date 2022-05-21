// @ts-nocheck
// TODO: Keziah, HEEEELP

import Head from "next/head";
import DefaultLayout from "../layouts";
import { useContext, useEffect, useReducer, useState } from "react";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
import { useTranslations } from "next-intl";
import toast, { Toaster } from "react-hot-toast";
import Switch from "react-switch";

import {
  MdAddCircleOutline,
  MdClose,
  MdDeleteOutline,
  MdRadioButtonChecked,
  MdCheckBox,
  MdShortText,
  MdContentCopy,
  MdMoreVert
} from "react-icons/md";
import Title from "../components/Title";
import InputFile from "../components/InputFile";
import Wysiwyg from "../components/Wysiwyg";
import Select from "../components/Select";
import Button from "../components/Button";
import UserContext from "../context/UserContext";
import Unauthorized from "../components/Unauthorized";
import { Locales } from "../types/common-types";
import { apiClient } from "../libs/apiClient";
import { ImageQuery } from "../../openapi";

const COMPONENTS_TYPES = {
  Choice: CreateChoice,
  Checkbox: CreateCheckbox,
  Freeform: CreateFreeform
};

const QUESTIONS_TYPES = ["Checkbox", "Freeform", "Choice"];

const QUESTIONS_ICONS = {
  Checkbox: MdCheckBox,
  Freeform: MdShortText,
  Choice: MdRadioButtonChecked
};

const ACCESSIBILITY_OPTIONS = ["Public", "Link", "FriendsOnly", "Whitelist"];

const types = {
  SET_TITLE: "SET_TITLE",
  SET_DESCRIPTION: "SET_DESCRIPTION",
  SET_EXCERPT: "SET_EXCERPT",
  SET_ACCESSIBILITY: "SET_ACCESSIBILITY",
  SET_LIMITATIONS: "SET_LIMITATIONS",
  ADD_QUESTION: "ADD_QUESTION",
  DUPLICATE_QUESTION: "DUPLICATE_QUESTION",
  REMOVE_QUESTION: "REMOVE_QUESTION",
  ADD_QUESTION_INFO: "ADD_QUESTION_INFO",
  SET_QUESTION_TYPE: "SET_QUESTION_TYPE",
  REMOVE_QUESTION_INFO: "REMOVE_QUESTION_INFO",
  EDIT_QUESTION_TITLE: "EDIT_QUESTION_TITLE",
  EDIT_QUESTION_OPTIONAL: "EDIT_QUESTION_OPTIONAL",
  EDIT_QUESTION_INFO: "EDIT_QUESTION_INFO",
  SET_ICON: "SET_ICON",
  SET_BANNER: "SET_BANNER"
};

const initialState = {
  title: "",
  description: "",
  excerpt: "",
  accessibility: "Public",
  limitations: null,
  questions: [],
  // FIXME!!!
  gamemode: "osu",
  icon: [],
  banner: [],
  // hardcoded a year from now
  activeTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case types.SET_TITLE:
      return {
        ...state,
        title: action.value
      };
    case types.SET_EXCERPT:
      return {
        ...state,
        excerpt: action.value
      };
    case types.SET_DESCRIPTION:
      return {
        ...state,
        description: action.value
      };
    case types.ADD_QUESTION:
      return {
        ...state,
        questions: [...state.questions, action.value]
      };
    case types.DUPLICATE_QUESTION:
      return {
        ...state,
        questions: [...state.questions, action.value.question]
      };
    case types.REMOVE_QUESTION:
      return {
        ...state,
        questions: state.questions.filter(
          (_question: any, index: any) => index !== action.value.index
        )
      };
    case types.ADD_QUESTION_INFO:
      return {
        ...state,
        questions: state.questions.map((question: { questionInfo: string | any[] }, index: any) => {
          if (index === action.value.index) {
            return {
              ...question,
              questionInfo: [...question.questionInfo, `Option ${question.questionInfo.length + 1}`]
            };
          }
          return question;
        })
      };
    case types.SET_QUESTION_TYPE:
      return {
        ...state,
        questions: state.questions.map((question: { questionInfo: any }, index: any) => {
          if (index === action.value.index) {
            return {
              ...question,
              questionInfo: action.value.type === "Freeform" ? [] : question.questionInfo,
              type: action.value.type
            };
          }
          return question;
        })
      };
    case types.REMOVE_QUESTION_INFO:
      return {
        ...state,
        questions: state.questions.map((question: { questionInfo: any[] }, index: any) => {
          if (index === action.value.index) {
            return {
              ...question,
              questionInfo: question.questionInfo.filter(
                (info, index) => index !== action.value.infoIndex
              )
            };
          }
          return question;
        })
      };
    case types.EDIT_QUESTION_TITLE:
      return {
        ...state,
        questions: state.questions.map((question: any, index: any) => {
          if (index === action.value.index) {
            return {
              ...question,
              title: action.value.title
            };
          }
          return question;
        })
      };
    case types.EDIT_QUESTION_OPTIONAL:
      return {
        ...state,
        questions: state.questions.map((question: any, index: any) => {
          if (index === action.value.index) {
            return {
              ...question,
              isOptional: action.value.isOptional
            };
          }
          return question;
        })
      };
    case types.EDIT_QUESTION_INFO:
      return {
        ...state,
        questions: state.questions.map((question: { questionInfo: any[] }, index: any) => {
          if (index === action.value.index) {
            return {
              ...question,
              questionInfo: question.questionInfo.map((info, infoIndex) => {
                if (infoIndex === action.value.infoIndex) {
                  return action.value.value;
                }
                return info;
              })
            };
          }
          return question;
        })
      };
    case types.SET_ACCESSIBILITY:
      return {
        ...state,
        accessibility: action.value.accessibility
      };
    case types.SET_ICON:
      return {
        ...state,
        icon: action.value
      };
    case types.SET_BANNER:
      return {
        ...state,
        banner: action.value
      };
    default:
      return state;
  }
}

export default function Dashboard() {
  const t = useTranslations();
  const { user } = useContext(UserContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // TODO: most likely is a bug
  // https://www.joshwcomeau.com/react/the-perils-of-rehydration/
  if (!user) {
    return <Unauthorized />;
  }

  async function submitForm() {
    const data = await apiClient.posts.postsPost({ postContract: state });
    return data;
  }

  async function submitImages(id) {
    if (state.icon.length > 0) {
      await apiClient.posts.postsIdFilesPut({
        id,
        query: ImageQuery.Icon,
        image: state.icon[0]
      });
    }

    if (state.banner.length > 0) {
      await apiClient.posts.postsIdFilesPut({
        id,
        query: ImageQuery.Banner,
        image: state.banner[0]
      });
    }
  }

  async function submit() {
    const data = await submitForm();

    console.log("Uploading images");
    await submitImages(data.id);

    console.log("Done");
    // Redirection to single form?
  }

  async function handleSubmit() {
    setSubmitting(true);

    if (errors.length > 0) {
      return toast.error(t("toast.userError"));
    }

    try {
      await toast.promise(submit(), {
        loading: t("toast.loading"),
        success: t("toast.success"),
        error: t("toast.error")
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - {t("title")}</title>
      </Head>

      <Toaster />

      <Title title={t("subtitle")}>
        {t("createYour")} "<span className="text-pink">CircleForms</span>".
      </Title>

      <section className="container space-y-8 mb-12">
        <Tabs>
          <TabList>
            <Tab>{t("tabs.design")}</Tab>
            <Tab>{t("tabs.questions")}</Tab>
            <Tab>{t("tabs.options")}</Tab>
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
                    onChange={(files) =>
                      dispatch({
                        type: types.SET_ICON,
                        value: files
                      })
                    }
                  />
                </div>
                <div className="lg:col-span-4">
                  <InputFile
                    label="Banner"
                    name="banner"
                    value={state.banner}
                    onChange={(files) =>
                      dispatch({
                        type: types.SET_BANNER,
                        value: files
                      })
                    }
                  />
                </div>
              </div>
            </TabPanel>
            {/* Questions */}
            <TabPanel className="relative">
              <div
                className="
                absolute -right-28 top-0
                rounded-35 bg-black-lightest py-8 px-2
                flex flex-col items-center
              "
              >
                <button className="button--icon">
                  <MdAddCircleOutline className="w-10 h-10" />
                </button>

                {QUESTIONS_TYPES.map((type) => {
                  const Icon = QUESTIONS_ICONS[type];

                  return (
                    <button
                      key={type}
                      className="button--icon"
                      onClick={() =>
                        dispatch({
                          type: types.ADD_QUESTION,
                          value: {
                            title: "",
                            type,
                            isOptional: false,
                            questionInfo: []
                          }
                        })
                      }
                    >
                      <span className="sr-only">
                        {t("add")} {t(`inputs.${type}`)}
                      </span>
                      <Icon className="w-10 h-10" />
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-col gap-y-4">
                <div className="flex flex-col gap-y-4 rounded-35 bg-black-lighter pt-5 pb-8 px-14 relative overflow-clip">
                  <div className="absolute left-0 top-0 bg-pink h-2 w-full" />
                  <input
                    className="input--inline input--title"
                    type="text"
                    placeholder={t("placeholders.title")}
                    defaultValue={t("placeholders.titleValue")}
                    onChange={(e) =>
                      dispatch({
                        type: types.SET_TITLE,
                        value: e.target.value
                      })
                    }
                  />
                  <input
                    className="input--inline"
                    type="text"
                    placeholder={t("placeholders.excerpt")}
                    onChange={(e) =>
                      dispatch({
                        type: types.SET_EXCERPT,
                        value: e.target.value
                      })
                    }
                  />
                  <Wysiwyg
                    value={state.description}
                    placeholder={t("placeholders.description")}
                    onTextAreaChange={(value) =>
                      dispatch({
                        type: types.SET_DESCRIPTION,
                        value
                      })
                    }
                  />
                </div>

                {state.questions.map((question, index) => {
                  const Component = COMPONENTS_TYPES[question.type];

                  return (
                    <Component
                      key={index}
                      {...question}
                      onAdd={() =>
                        dispatch({
                          type: types.ADD_QUESTION_INFO,
                          value: { index }
                        })
                      }
                      onDuplicate={() =>
                        dispatch({
                          type: types.DUPLICATE_QUESTION,
                          value: { question }
                        })
                      }
                      onRemove={() =>
                        dispatch({
                          type: types.REMOVE_QUESTION,
                          value: { index }
                        })
                      }
                      onRemoveInfo={(infoIndex) =>
                        dispatch({
                          type: types.REMOVE_QUESTION_INFO,
                          value: { index, infoIndex }
                        })
                      }
                      onEditQuestionType={(type) =>
                        dispatch({
                          type: types.SET_QUESTION_TYPE,
                          value: { index, type }
                        })
                      }
                      onEditTitle={(newTitle) =>
                        dispatch({
                          type: types.EDIT_QUESTION_TITLE,
                          value: { index, title: newTitle }
                        })
                      }
                      onEditQuestionOptional={(isOptional) =>
                        dispatch({
                          type: types.EDIT_QUESTION_OPTIONAL,
                          value: { index, isOptional: isOptional }
                        })
                      }
                      onEdit={(infoIndex, value) =>
                        dispatch({
                          type: types.EDIT_QUESTION_INFO,
                          value: { index, infoIndex, value }
                        })
                      }
                      t={t}
                    />
                  );
                })}
              </div>
            </TabPanel>
            {/* Options */}
            <TabPanel>
              <Select
                onChange={(accessibility) =>
                  dispatch({
                    type: types.SET_ACCESSIBILITY,
                    value: { accessibility }
                  })
                }
                defaultValue={ACCESSIBILITY_OPTIONS[0]}
                options={ACCESSIBILITY_OPTIONS.map((option) => ({
                  value: option,
                  label: t(`accessibility.${option}`)
                }))}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>

        <div className="flex justify-center">
          <Button onClick={handleSubmit} disabled={submitting}>
            {t("createForm")}
          </Button>
        </div>
      </section>
    </DefaultLayout>
  );
}

/**
 *  Choice
 */
function CreateChoice({
  title,
  type,
  isOptional,
  questionInfo,
  onAdd,
  onDuplicate,
  onRemove,
  onRemoveInfo,
  onEditQuestionType,
  onEditQuestionOptional,
  onEditTitle,
  onEdit,
  t
}) {
  return (
    <Question title={title} type={type} onEditTitle={onEditTitle} t={t}>
      {questionInfo.map((info, index) => (
        <div key={`${title}-${index}`} className="flex gap-x-2 items-center">
          <div className="h-6 w-6 rounded-full border-2" />
          <input
            className="input--inline"
            type="text"
            value={info}
            onChange={(e) => onEdit(index, e.target.value)}
          />
          <button
            className="button--icon"
            title={t("removeOption")}
            onClick={() => onRemoveInfo(index)}
          >
            <span className="sr-only">{t("removeOption")}</span>
            <MdClose />
          </button>
        </div>
      ))}
      <div className="flex gap-x-2 items-center">
        <div className="h-6 w-6 rounded-full border-2" />
        <input
          className="input--inline input--static"
          type="text"
          defaultValue={t("addChoice")}
          readOnly
          onClick={onAdd}
        />
      </div>
      <QuestionActions
        type={type}
        onDuplicate={onDuplicate}
        onRemove={onRemove}
        onEditQuestionType={onEditQuestionType}
        onEditQuestionOptional={onEditQuestionOptional}
        isOptional={isOptional}
        t={t}
      />
    </Question>
  );
}

/**
 *  Checkbox
 */
function CreateCheckbox({
  title,
  type,
  isOptional,
  questionInfo,
  onAdd,
  onDuplicate,
  onRemove,
  onRemoveInfo,
  onEditQuestionType,
  onEditQuestionOptional,
  onEditTitle,
  onEdit,
  t
}) {
  return (
    <Question title={title} type={type} onEditTitle={onEditTitle} t={t}>
      {questionInfo.map((info, index) => (
        <div key={`${title}-${index}`} className="flex gap-x-2 items-center">
          <div className="h-6 w-6 border-2" />
          <input
            className="input--inline"
            type="text"
            value={info}
            onChange={(e) => onEdit(index, e.target.value)}
          />
          <button
            className="button--icon"
            title={t("removeOption")}
            onClick={() => onRemoveInfo(index)}
          >
            <span className="sr-only">{t("removeOption")}</span>
            <MdClose />
          </button>
        </div>
      ))}
      <div className="flex gap-x-2 items-center">
        <div className="h-6 w-6 border-2" />
        <input
          className="input--inline input--static"
          type="text"
          defaultValue={t("addChoice")}
          readOnly
          onClick={onAdd}
        />
      </div>
      <QuestionActions
        type={type}
        onDuplicate={onDuplicate}
        onRemove={onRemove}
        onEditQuestionType={onEditQuestionType}
        onEditQuestionOptional={onEditQuestionOptional}
        isOptional={isOptional}
        t={t}
      />
    </Question>
  );
}

/**
 *  Freeform
 */
function CreateFreeform({
  title,
  type,
  isOptional,
  questionInfo,
  onAdd,
  onDuplicate,
  onRemove,
  onEditQuestionType,
  onEditQuestionOptional,
  onEditTitle,
  onEdit,
  t
}) {
  return (
    <Question title={title} type={type} onEditTitle={onEditTitle} t={t}>
      <p className="text-2xl text-white text-opacity-50 border-b border-dotted pb-2 select-none">
        {t(`${type}.description`)}
      </p>
      <QuestionActions
        type={type}
        onDuplicate={onDuplicate}
        onRemove={onRemove}
        onEditQuestionType={onEditQuestionType}
        onEditQuestionOptional={onEditQuestionOptional}
        isOptional={isOptional}
        t={t}
      />
    </Question>
  );
}

/**
 *  Question Actions (Footer)
 */
function QuestionActions({
  onEditQuestionType,
  onEditQuestionOptional,
  type,
  onDuplicate,
  onRemove,
  isOptional,
  t
}) {
  const Icon = QUESTIONS_ICONS[type];

  return (
    <div className="flex justify-between border-t-2 border-white border-opacity-5 pt-4 mt-14">
      <Select
        onChange={onEditQuestionType}
        Icon={Icon}
        defaultValue={type}
        options={QUESTIONS_TYPES.map((type) => ({
          value: type,
          label: t(`inputs.${type}`)
        }))}
      />

      <div className="flex gap-x-2">
        <button onClick={onDuplicate} className="button--icon">
          <MdContentCopy className="h-8 w-8" />
        </button>
        <button onClick={onRemove} className="button--icon mr-4">
          <span className="sr-only">{t("removeQuestion")}</span>
          <MdDeleteOutline className="h-8 w-8" />
        </button>
        <label className="flex items-center gap-x-4 text-2xl font-medium border-l-2 border-white border-opacity-5 pl-8">
          <span>Required</span>
          <Switch
            onChange={(e) => onEditQuestionOptional(!e)}
            checked={!isOptional}
            offColor="#0c0c0c"
            onColor="#0c0c0c"
            onHandleColor="#FF66AA"
            handleDiameter={26}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            height={32}
            width={58}
          />
        </label>
        <button className="button--icon">
          <MdMoreVert className="h-8 w-8" />
        </button>
      </div>
    </div>
  );
}

/**
 *  Question Wrapper for style
 */
function Question({ children, title, type, onEditTitle, t }) {
  return (
    <div className="flex flex-col gap-y-4 rounded-35 bg-black-lighter pt-4 pb-6 px-14 relative overflow-clip">
      <div className="absolute left-0 top-0 bg-pink h-full w-2" />

      <Wysiwyg
        value={title}
        onTextAreaChange={onEditTitle}
        placeholder={t(`placeholders.${type}`)}
      />

      {children}
    </div>
  );
}

export async function getStaticProps({ locale }: { locale: Locales }) {
  const [translations, global] = await Promise.all([
    import(`../messages/create-a-form/${locale}.json`),
    import(`../messages/global/${locale}.json`)
  ]);

  const messages = {
    ...translations,
    ...global
  };

  return {
    props: {
      messages
    }
  };
}
