import React from "react";
import InferNextPropsType from "infer-next-props-type";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";

import { Question } from "../../../../openapi";
import ResponseSubmission from "../../../components/ResponseSubmission";
import DefaultLayout from "../../../layouts";
import { getApiClient } from "../../../utils/getApiClient";

// https://github.com/vercel/next.js/issues/15913#issuecomment-950330472
type ServerSideProps = InferNextPropsType<typeof getServerSideProps>;

const UserFormSubmission = (props: ServerSideProps) => {
  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - {props.post.title}</title>
      </Head>

      <ResponseSubmission
        post={props.post}
        authorUser={props.authorUser}
        defaultUserAnswers={props.filteredUserAnswers}
      />
    </DefaultLayout>
  );
};

const convertServerAnswerStateToLocal = (
  answers: Record<string, string | string[]>,
  questions: Question[]
) => {
  // we need a data structure to check which type question id is
  const checkType = Object.fromEntries(questions.map((q) => [q.questionId, q.type]));

  // we need to convert radio answers back to string
  return Object.fromEntries(
    Object.entries(answers).map(([questionId, answer]) => {
      if (checkType[questionId] === "Choice") {
        return [questionId, answer[0]];
      } else return [questionId, answer];
    })
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  // we need to create a new apiClient because cookies are not present on the server
  const apiClient = getApiClient(context.req.headers.cookie);
  const formid = context.params?.formid || "";
  const osuid = context.params?.osuid || "";

  const [translations, global, post, usersAndAnswers] = await Promise.all([
    import(`../../../messages/single-form/${context.locale}.json`),
    import(`../../../messages/global/${context.locale}.json`),
    apiClient.posts.postsIdGet({ id: formid as string }),
    apiClient.posts.postsIdAnswersGet({ id: formid as string })
  ]);

  const authorUser = await apiClient.users.usersIdGet({ id: post.authorId as string });

  // Try to get user`s post answers
  let defaultUserAnswers: Record<string, string | string[]> = {};
  const userAnswer = usersAndAnswers.answers?.filter((answer) => answer.user === osuid)[0];

  userAnswer?.submissions?.forEach((submission) => {
    if (submission.questionId) {
      defaultUserAnswers[submission.questionId] = submission.answers || [];
    }
  });

  const filteredUserAnswers = convertServerAnswerStateToLocal(defaultUserAnswers, post.questions!);

  // if there are no answers from this osu id, return not found
  if (Object.keys(filteredUserAnswers).length === 0) {
    return {
      notFound: true
    };
  }

  const messages = {
    ...translations,
    ...global
  };

  return {
    props: {
      post,
      authorUser,
      messages,
      filteredUserAnswers
    }
  };
};
export default UserFormSubmission;
