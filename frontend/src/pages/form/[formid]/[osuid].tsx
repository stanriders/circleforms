import React from "react";
import InferNextPropsType from "infer-next-props-type";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { AsyncReturnType } from "src/utils/misc";

import { Question, QuestionType } from "../../../../openapi";
import ResponseSubmission from "../../../components/ResponseSubmission";
import DefaultLayout from "../../../layouts";
import { getApiClient } from "../../../utils/getApiClient";

// https://github.com/vercel/next.js/issues/15913#issuecomment-950330472
type ServerSideProps = InferNextPropsType<typeof getServerSideProps>;

const UserFormSubmission = (props: ServerSideProps) => {
  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - {props.postData.post.title}</title>
      </Head>

      <ResponseSubmission
        post={props.postData.post}
        authorUser={props.authorUser}
        initialUserAnswers={props.filteredUserAnswers}
        urlOsuId={props.osuid as string}
      />
    </DefaultLayout>
  );
};

export const convertServerAnswerStateToLocal = (
  submissions: Record<string, string[]>,
  questions: Question[]
) => {
  // we need a data structure to check which type question id is
  const questionTypeById: Record<string, QuestionType> = Object.fromEntries(
    questions.map((q) => [q.question_id, q.type])
  );
  const questionInfoById: Record<string, string[]> = Object.fromEntries(
    questions.map((q) => [q.question_id, q.question_info])
  );

  return Object.fromEntries(
    Object.entries(submissions).map(([question_id, answers]) => {
      let resultQuestionInfo;
      switch (questionTypeById[question_id]) {
        case "Choice":
          resultQuestionInfo = questionInfoById?.[question_id]?.[Number(answers?.[0])];
          break;

        case "Checkbox":
          const questionInfo = questionInfoById[question_id];
          let resArr = Array(questionInfo?.length).fill(false);
          for (const answer of answers!) {
            const answerInd = Number(answer);
            resArr[answerInd] = questionInfo?.[answerInd];
          }
          resultQuestionInfo = resArr;
          break;

        case "Freeform":
          resultQuestionInfo = answers?.[0];
          break;

        default:
          console.error("Question type doesnt exist: ", questionTypeById[question_id]);
          break;
      }
      return [question_id, resultQuestionInfo];
    })
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  // we need to create a new apiClient because cookies are not present on the server
  const apiClient = getApiClient(context.req.headers.cookie);
  const formid = context.params?.formid || "";
  const osuid = context.params?.osuid || "";

  const promises = await Promise.allSettled([
    import(`../../../messages/single-form/${context.locale}.json`),
    import(`../../../messages/global/${context.locale}.json`),
    apiClient.posts.postsIdGet({ id: formid as string })
  ]);
  const [translations, global, postData] = promises.map((p) =>
    p.status === "fulfilled" ? p?.value : null
  );
  const messages = {
    ...translations,
    ...global
  };

  // typescript doesnt infer these types :(
  const typedPost = postData as AsyncReturnType<typeof apiClient.posts.postsIdGet>;

  // fetch author info
  const authorUser = await apiClient.users.usersIdGet({
    id: typedPost.post?.author_id as string
  });

  if (osuid !== typedPost.post?.author_id) {
    return {
      props: {
        postData,
        authorUser,
        messages,
        osuid
      }
    };
  }

  const usersAndAnswers = await apiClient.posts.postsIdAnswersGet({ id: formid as string });

  // if there are no answers, you are unauthorized, so go look at not found screen
  if (!usersAndAnswers) {
    return {
      notFound: true
    };
  }

  // Try to get user`s post answers
  let defaultUserAnswers: Record<string, string[]> = {};
  const userAnswer = usersAndAnswers?.answers?.filter((answer) => answer.user === osuid)[0];

  userAnswer?.submissions?.forEach((submission) => {
    if (submission.question_id) {
      defaultUserAnswers[submission.question_id] = submission.answers || [];
    }
  });

  const filteredUserAnswers = convertServerAnswerStateToLocal(
    defaultUserAnswers,
    typedPost.post?.questions!
  );

  // if there are no answers from this osu id, return not found
  if (Object.keys(filteredUserAnswers).length === 0) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      postData,
      authorUser,
      messages,
      filteredUserAnswers,
      osuid
    }
  };
};
export default UserFormSubmission;
