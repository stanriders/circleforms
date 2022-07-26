import { DeepRequired, FieldErrorsImpl, FieldValues, UseFormRegister } from "react-hook-form";
import { PostContract, Question, QuestionType, SubmissionContract } from "openapi";

import CheckboxQuestion from "./Questions/CheckboxQuestion";
import ChoiceRadioQuestion from "./Questions/ChoiceRadioQuestion";
import FreeformInputQuestion from "./Questions/FreeformInputQuestion";

export const switchQuestionType = (
  question: Question,
  register: UseFormRegister<FieldValues>,
  errors: FieldErrorsImpl<DeepRequired<FormData>>,
  disableEditCondition: boolean
) => {
  switch (question.type) {
    case QuestionType.Freeform:
      return (
        <FreeformInputQuestion
          key={question.question_id}
          question={question}
          register={register}
          errors={errors}
          disableEdit={disableEditCondition}
        />
      );
    case QuestionType.Checkbox:
      return (
        <CheckboxQuestion
          key={question.question_id}
          question={question}
          register={register}
          errors={errors}
          disableEdit={disableEditCondition}
        />
      );
    case QuestionType.Choice:
      return (
        <ChoiceRadioQuestion
          key={question.question_id}
          question={question}
          register={register}
          errors={errors}
          disableEdit={disableEditCondition}
        />
      );
    default:
      console.error("Question type doesnt exist");
      break;
  }
};

export const convertDataToAnswers = (
  data: { [x: string]: string | string[] | undefined },
  post: PostContract | undefined
) => {
  const answers: SubmissionContract[] = [];
  const postTypes = post?.questions?.map((question) => question.type);
  const postQuestions = post?.questions?.map((question) => question.question_info);

  Object.entries(data).map((curr, index) => {
    const [question_id, question_info] = curr;

    switch (postTypes?.[index]) {
      case "Freeform":
        question_info &&
          answers.push({
            question_id: question_id,
            answers: [question_info as string]
          });
        break;

      case "Choice":
        const questionPosition = postQuestions?.[index]?.indexOf(question_info as string);
        if (questionPosition === -1) break;
        answers.push({
          question_id: question_id,
          answers: [String(questionPosition)]
        });
        break;

      case "Checkbox":
        const questionIndex = (question_info as string[])?.map((q, ind) => {
          const questionPosition = postQuestions?.[index]?.indexOf(q);
          if (questionPosition !== -1) return String(ind);
        });
        answers.push({
          question_id: question_id,
          answers: questionIndex.filter(Boolean) as string[]
        });
        break;

      default:
        console.error("Unknown question type: ", postTypes?.[index]);
        break;
    }
  });
  return answers;
};
