import React from "react";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import ResponseSubmission from "src/components/ResponseSubmission";
import DefaultLayout from "src/layouts";
import { getApiClient } from "src/utils/getApiClient";

import { convertServerAnswerStateToLocal } from "../form/[formid]/[osuid]";
import { AnswersUsersContract, PostWithQuestionsContract } from "openapi";

export const AnswerPage = () => {
  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - {props.post.title}</title>
      </Head>

      <ResponseSubmission
        post={props.post}
        authorUser={props.authorUser}
        initialUserAnswers={props.filteredUserAnswers}
        urlOsuId={props.osuid as string}
      />
    </DefaultLayout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  // we need to create a new apiClient because cookies are not present on the server
  const apiClient = getApiClient(context.req.headers.cookie);
  const formid = context.params?.id || "";

  const promises = await Promise.allSettled([
    import(`../../../messages/single-form/${context.locale}.json`),
    import(`../../../messages/global/${context.locale}.json`),
    apiClient.posts.postsIdGet({ id: formid as string })
  ]);

  const [translations, global, post] = promises.map((p) =>
    p.status === "fulfilled" ? p?.value : null
  );

  // typescript doesnt infer these types :(
  const typedPost = post as PostWithQuestionsContract;

  // if there are no answers, go look at not found screen
  if (!typedPost.answer) {
    return {
      notFound: true
    };
  }

  // fetch author info
  const authorUser = await apiClient.users.usersIdGet({
    id: typedPost.authorId as string
  });

  // Try to get user`s post answers

  const filteredUserAnswers = convertServerAnswerStateToLocal(
    typedPost.answer,
    typedPost.questions!
  );

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
      filteredUserAnswers,
      osuid
    }
  };
};
