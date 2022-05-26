import React from "react";
import { IQuestionProps } from "../../types/common-types";
import InputCheckbox from "../InputCheckbox";
import QuestionError from "../QuestionError";

// meant to be used inside React Hook Form
const CheckboxQuestion = ({ question, register, errors, disableEdit }: IQuestionProps) => {
  const questionId = question.questionId;
  const questionIsRequired = !question.isOptional;

  return (
    <div className="flex flex-col gap-2 bg-black-lighter px-8 py-5 rounded-3xl">
      <h2 className="text-3xl font-bold pb-6">
        {question.title} {question.isOptional ? null : <span className="text-pink">*</span>}
      </h2>
      <div className="flex flex-col gap-4">
        {question.questionInfo?.map((text, index) => {
          return (
            <InputCheckbox
              key={questionId + text}
              inputText={text}
              inputProps={{
                ...register(`${question.questionId}.${index}`, {
                  required: questionIsRequired,
                  disabled: disableEdit
                }),
                ...{
                  "aria-invalid": errors[questionId!]?.[index] ? "true" : "false"
                }
              }}
            />
          );
        })}
        {errors[question.questionId as string] &&
          QuestionError({ text: "This question is required*" })}
      </div>
    </div>
  );
};

export default CheckboxQuestion;
