import { GetServerSidePropsContext } from "next";
import React from "react";
import ResponseSubmission from "../../../components/ResponseSubmission";
import { getApiClient } from "../../../utils/getApiClient";
import InferNextPropsType from "infer-next-props-type";

// https://github.com/vercel/next.js/issues/15913#issuecomment-950330472
type ServerSideProps = InferNextPropsType<typeof getServerSideProps>;

const UserFormSubmission = (props: ServerSideProps) => {
  return (
    <ResponseSubmission
      post={props.post}
      authorUser={props.authorUser}
      defaultUserAnswers={props.defaultUserAnswers}
    />
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
  const defaultUserAnswers: Record<string, string | string[]> = {};
  const userAnswer = usersAndAnswers.answers?.filter((answer) => answer.user === osuid)[0];
  userAnswer?.submissions?.forEach((submission) => {
    if (submission.questionId) {
      defaultUserAnswers[submission.questionId] = submission.answer || "";
    }
  });

  // if there are no answers from this osu id, return not found
  if (Object.keys(defaultUserAnswers).length === 0) {
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
      defaultUserAnswers
    }
  };
};
export default UserFormSubmission;
