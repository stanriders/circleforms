import { Form, Formik } from "formik";
import { GetStaticPropsContext, InferGetStaticPropsType, NextPage } from "next";
import { useTranslations } from "next-intl";
import Head from "next/head";
import React, { useMemo } from "react";
import {
  PostWithQuestionsContract,
  Question,
  QuestionType,
  SubmissionContract
} from "../../../openapi";
import CheckboxQuestion from "../../components/CheckboxQuestion";
import ChoiceRadioQuestion from "../../components/ChoiceRadioQuestion";
import FreeformInputQuestion from "../../components/FreeformInputQuestion";

import Tag from "../../components/Tag";
import DefaultLayout from "../../layouts";
import { apiClient } from "../../libs/apiClient";
import getImage from "../../utils/getImage";

type StaticSideProps = InferGetStaticPropsType<typeof getStaticProps>;

const Questions: NextPage<StaticSideProps> = (props) => {
  const { post, user } = props;

  const t = useTranslations();

  const bannerImg = getImage({ banner: post.banner, id: post.id, type: "banner" });
  const iconImg = getImage({ banner: post.icon, id: post.id, type: "icon" });

  const switchQuestionType = (question: Question) => {
    switch (question.type) {
      case QuestionType.Freeform:
        return <FreeformInputQuestion question={question} />;
      case QuestionType.Checkbox:
        return <CheckboxQuestion question={question} />;
      case QuestionType.Choice:
        return <ChoiceRadioQuestion question={question} />;
      default:
        console.error("Question type doesnt exist");
        break;
    }
  };

  const computeFormState = () => {
    const formikState: Record<string, string | string[]> = {};
    TEMP_RESP.questions?.forEach((question) => {
      const id = question.questionId ?? "none";
      switch (question.type) {
        case QuestionType.Freeform:
          return (formikState[id] = "");
        case QuestionType.Checkbox:
          return (formikState[id] = []);
        case QuestionType.Choice:
          return (formikState[id] = "");
        default:
          console.error("Question type doesnt exist, cannot assign initial state");
          return (formikState[id] = "");
      }
    });
    return formikState;
  };

  const formikState = useMemo(() => computeFormState(), []);

  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - {post.title}</title>
      </Head>

      <section className="container mb-12">
        {/* background rounded image */}
        <div
          className="bg-cover h-60 w-full rounded-t-70"
          style={{
            backgroundImage: `
            linear-gradient(180deg, rgba(19, 19, 19, 0) -35.06%, #0F0F0F 100%),
            url('${bannerImg}')
          `
          }}
        />

        {/* form header */}
        <div className="bg-black-dark2 p-16 relative rounded-b-70">
          <div className="absolute top-0 left-16 right-16 flex items-start justify-between">
            <div className="flex items-center gap-x-3">
              <div className="relative shrink-0 min-w-fit">
                <img
                  className="h-20 w-20 rounded-full"
                  src={iconImg}
                  alt={`${post.title}'s thumbnail`}
                />
                <img
                  className="h-10 w-10 rounded-full absolute bottom-0 right-0"
                  src={user?.osu?.avatar_url}
                  alt={`${user.osu?.username}'s avatar`}
                />
              </div>

              <div>
                <h1 className="text-4xl font-bold">{post.title}</h1>
                <p className="text-white text-opacity-50 text-2xl">
                  {post.answerCount ?? post.answerCount} {t("answersCount")}
                </p>
              </div>
            </div>

            <div className="p-4 bg-black-lightest rounded-14 mt-[-6px]">
              <Tag
                label={post.isActive ? t("active") : t("inactive")}
                theme={post.isActive ? "success" : "stale"}
              />
            </div>
          </div>
        </div>

        {/* questions */}
        <Formik
          initialValues={formikState}
          onSubmit={async (values, { setSubmitting }) => {
            const answers: SubmissionContract[] = [];
            Object.entries(values).map((curr) =>
              answers.push({ questionId: curr[0], answer: curr[1] })
            );

            console.log(answers);
            apiClient.posts.postsIdAnswersPost({
              id: post.id as string,
              submissionContract: answers
            });
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-6 p-16 pt-12">
              {TEMP_RESP.questions?.map((question) => switchQuestionType(question))}
              <div className="flex justify-between">
                <button className="button dark">Back</button>
                <button type="submit" className="button secondary" disabled={isSubmitting}>
                  Submit response
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </section>
    </DefaultLayout>
  );
};

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps(context: GetStaticPropsContext) {
  const id = context.params?.id;

  const [translations, global, post] = await Promise.all([
    import(`../../messages/single-form/${context.locale}.json`),
    import(`../../messages/global/${context.locale}.json`),
    apiClient.posts.postsIdGet({ id: id as string })
  ]);
  const messages = {
    ...translations,
    ...global
  };

  const user = await apiClient.users.usersIdGet({ id: post.authorId as string });

  return {
    props: {
      post,
      messages,
      user
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 60 seconds
    revalidate: 60 // In seconds
  };
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.
export async function getStaticPaths() {
  // TODO FIXME: breaks after 50 entries. Change to endpoint that returns ids for all published forms
  const pages = await apiClient.pages.postsPagePageGet({ page: 1, pageSize: 50 });
  // console.log(pages);

  // Get the paths we want to pre-render based on posts
  const paths = pages.posts?.map((form) => ({
    params: { id: form.id }
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: "blocking" };
}

var TEMP_RESP: PostWithQuestionsContract = {
  id: "627fea5b0f343a3ef130d762",
  authorId: "6348815",
  isActive: true,
  activeTo: new Date("2023-05-14T17:40:06.326Z"),
  icon: null,
  banner: null,
  title: "Multiple questions for each type",

  description: "sdfsdf sdf sdf sdfsd fsdf sdfsdf sdf",
  excerpt: "descriptopn",

  questions: [
    {
      questionId: "627fea5b0f343a3ef130d75c",
      order: 0,
      type: QuestionType.Checkbox,
      title: "Checkbox question#1",
      isOptional: false,
      questionInfo: ["I am first checkbox", "2nd"]
    },
    {
      questionId: "627fea5b0f343a3ef130d75d",
      order: 1,
      type: QuestionType.Checkbox,
      title: "Checkbox question#2",
      isOptional: true,
      questionInfo: ["Check Me!!", "Actually you dont need to"]
    },
    {
      questionId: "627fea5b0f343a3ef130d75e",
      order: 2,
      type: QuestionType.Freeform,
      title: "first paragraph question",
      isOptional: false,
      questionInfo: []
    },
    {
      questionId: "627fea5b0f343a3ef130d75f",
      order: 3,
      type: QuestionType.Choice,
      title: "Do you even choice #1?",
      isOptional: false,
      questionInfo: ["Yes1", "No1"]
    },
    {
      questionId: "627fea5b0f343a3ef130d760",
      order: 4,
      type: QuestionType.Freeform,
      title: "Parapraph2??",
      isOptional: true,
      questionInfo: []
    },
    {
      questionId: "627fea5b0f343a3ef130d761",
      order: 5,
      type: QuestionType.Choice,
      title: "Choice AGAIN hello????",
      isOptional: true,
      questionInfo: ["Hello", "Goodbye"]
    }
  ]
};

export default Questions;
