import React from "react";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { Question } from "openapi";
import { apiClient } from "src/utils/apiClient";
import { AsyncReturnType } from "src/utils/misc";

import BarChartCard from "./BarChartCard";
import PieChartCard from "./PieChartCard";

export const getColorByIndex = (index: number) => {
  // return color from palette else return random color
  const COLORS = ["#FF66AA", "#C270D4", "#FFE4F5", "#5C7EE4", "#007DA5", "#00716B"];
  return COLORS?.[index] || "#" + Math.floor(Math.random() * 16777215).toString(16);
};

interface IResultStatistics {
  postData: AsyncReturnType<typeof apiClient.posts.postsIdGet>;
}

const FormStatistics = ({ postData }: IResultStatistics) => {
  const router = useRouter();
  const { formid } = router.query;

  const {
    data: answers,
    isLoading,
    isError
  } = useQuery(
    ["postsIdAnswersGet", formid],
    () => apiClient.posts.postsIdAnswersGet({ id: formid as string }),
    {
      select(data) {
        // transform server answers into:
        // result = { question_id : { string : count } }
        // for example: "answer0" : 25, "answer1" : 15
        const result = new Map<string, Map<string, number>>();
        for (let userAnswer of data?.answers!) {
          for (let submission of userAnswer.submissions!) {
            const answersCount = result.get(submission?.question_id!) || new Map();
            for (let answer of submission.answers!) {
              if (!answersCount.has(answer)) {
                answersCount.set(answer, 1);
                continue;
              }
              const currentVotes = answersCount.get(answer);
              answersCount.set(answer, currentVotes + 1);
            }
            result.set(submission.question_id!, answersCount);
          }
        }
        return result;
      }
    }
  );

  const getStatsComponentByType = (question: Question) => {
    const answerCounts = answers?.get(question.question_id!);
    switch (question.type) {
      case "Freeform":
        return null;

      case "Choice":
        const resData = question.question_info?.map((questionText, index) => ({
          title: questionText,
          value: answerCounts?.get(String(index)) || 0,
          color: getColorByIndex(index)
        }));

        return <PieChartCard key={question.question_id} heading={question.title} data={resData!} />;

      case "Checkbox":
        const barData = question.question_info?.map((questionText, index) => ({
          questionText: questionText,
          count: answerCounts?.get(String(index)) || 0,
          questionIndex: String(index)
        }));

        return <BarChartCard key={question.question_id} heading={question.title} data={barData!} />;

      default:
        console.error("Unknown question type: ", question.type);
        return null;
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Something went wrong!</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      {postData && postData?.post?.questions?.map((q) => getStatsComponentByType(q))}
    </div>
  );
};

export default FormStatistics;
