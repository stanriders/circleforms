import React from "react";
import { useQuery } from "react-query";
import { GetStaticPaths, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { StaticSideProps } from "src/pages/questions/[id]";
import { Locales } from "src/types/common-types";
import { apiClient } from "src/utils/apiClient";
import { AsyncReturnType } from "src/utils/misc";

import { Question, QuestionType } from "../../../../openapi";
import ResponseSubmission from "../../../components/ResponseSubmission";
import DefaultLayout from "../../../layouts";

const UserFormSubmission: NextPage<StaticSideProps> = (props) => {
  const router = useRouter();
  const { formid, osuid } = router.query;

  const { data: postData, isError: isNoPostError } = useQuery(["post", formid], () =>
    apiClient.posts.postsIdGet({ id: formid as string })
  );

  const { data: answers } = useQuery(
    ["answers", formid],
    () => apiClient.posts.postsIdAnswersGet({ id: formid as string }),
    {
      select: React.useCallback(
        (usersAndAnswers: AsyncReturnType<typeof apiClient.posts.postsIdAnswersGet>) => {
          let defaultUserAnswers: Record<string, string[]> = {};
          const userAnswer = usersAndAnswers?.answers?.filter((answer) => answer.user === osuid)[0];

          userAnswer?.submissions?.forEach((submission) => {
            if (submission.question_id) {
              defaultUserAnswers[submission.question_id] = submission.answers || [];
            }
          });

          return convertServerAnswerStateToLocal(defaultUserAnswers, postData?.post?.questions!);
        },
        [osuid, postData?.post?.questions]
      ),
      enabled: !!postData
    }
  );

  const { data: authorUser } = useQuery(
    ["usersIdGet", osuid],
    () =>
      apiClient.users.usersIdGet({
        id: postData?.post?.author_id as string
      }),
    {
      enabled: !!postData
    }
  );

  if (isNoPostError) {
    return (
      <DefaultLayout>
        <p className="text-center">Couldn't fetch post with id: {formid} </p>
      </DefaultLayout>
    );
  }

  const showResponse = postData && answers;
  return (
    <DefaultLayout>
      <Head>
        <title>CircleForms - {postData?.post?.title}</title>
      </Head>

      {showResponse && (
        <ResponseSubmission
          post={postData?.post}
          authorUser={authorUser!}
          initialUserAnswers={answers}
          urlOsuId={osuid as string}
        />
      )}
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

export async function getStaticProps({ locale }: { locale: Locales }) {
  const promises = await Promise.allSettled([
    import(`../../../messages/single-form/${locale}.json`),
    import(`../../../messages/global/${locale}.json`)
  ]);

  const [translations, global] = promises.map((p) => (p.status === "fulfilled" ? p?.value : null));

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

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking" //indicates the type of fallback
  };
};

export default UserFormSubmission;
