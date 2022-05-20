import { GetStaticPropsContext, InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";

import DefaultLayout from "../../layouts";
import { apiClient } from "../../libs/apiClient";

import ResponseSubmission from "../../components/ResponseSubmission";

type StaticSideProps = InferGetStaticPropsType<typeof getStaticProps>;

const Questions: NextPage<StaticSideProps> = (props) => {
  const { post, authorUser } = props;

  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - {post.title}</title>
      </Head>

      <ResponseSubmission post={post} authorUser={authorUser} />
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

  const authorUser = await apiClient.users.usersIdGet({ id: post.authorId as string });

  return {
    props: {
      post,
      messages,
      authorUser
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

// var TEMP_RESP: PostWithQuestionsContract = {
//   id: "627fea5b0f343a3ef130d762",
//   authorId: "6348815",
//   isActive: true,
//   activeTo: new Date("2023-05-14T17:40:06.326Z"),
//   icon: null,
//   banner: null,
//   title: "Multiple questions for each type",

//   description: "sdfsdf sdf sdf sdfsd fsdf sdfsdf sdf",
//   excerpt: "descriptopn",

//   questions: [
//     {
//       questionId: "627fea5b0f343a3ef130d75c",
//       order: 0,
//       type: QuestionType.Checkbox,
//       title: "Checkbox question#1",
//       isOptional: false,
//       questionInfo: ["I am first checkbox", "2nd"]
//     },
//     {
//       questionId: "627fea5b0f343a3ef130d75d",
//       order: 1,
//       type: QuestionType.Checkbox,
//       title: "Checkbox question#2",
//       isOptional: true,
//       questionInfo: ["Check Me!!", "Actually you dont need to"]
//     },
//     {
//       questionId: "627fea5b0f343a3ef130d75e",
//       order: 2,
//       type: QuestionType.Freeform,
//       title: "first paragraph question",
//       isOptional: false,
//       questionInfo: []
//     },
//     {
//       questionId: "627fea5b0f343a3ef130d75f",
//       order: 3,
//       type: QuestionType.Choice,
//       title: "Do you even choice #1?",
//       isOptional: false,
//       questionInfo: ["Yes1", "No1"]
//     },
//     {
//       questionId: "627fea5b0f343a3ef130d760",
//       order: 4,
//       type: QuestionType.Freeform,
//       title: "Parapraph2??",
//       isOptional: true,
//       questionInfo: []
//     },
//     {
//       questionId: "627fea5b0f343a3ef130d761",
//       order: 5,
//       type: QuestionType.Choice,
//       title: "Choice AGAIN hello????",
//       isOptional: true,
//       questionInfo: ["Hello", "Goodbye"]
//     }
//   ]
// };

export default Questions;
