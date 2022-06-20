import React from "react";

import { IQuestionProps } from "../../types/common-types";
import ErrorMessage from "../ErrorMessage";
import InputCheckbox from "../InputCheckbox";

// meant to be used inside React Hook Form
const CheckboxQuestion = ({ question, register, errors, disableEdit }: IQuestionProps) => {
  const questionId = question.question_id;
  const questionIsRequired = !question.is_optional;

  return (
    <div className="flex flex-col gap-2 py-5 px-8 bg-black-lighter rounded-3xl">
      <h2 className="pb-6 text-3xl font-bold">
        {question.title} {question.is_optional ? null : <span className="text-pink">*</span>}
      </h2>
      <div className="flex flex-col gap-4">
        {question.question_info?.map((text, index) => {
          return (
            <InputCheckbox
              key={questionId + text}
              inputText={text}
              inputProps={{
                ...register(`${question.question_id}.${index}`, {
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
        {errors[question.question_id as string] &&
          ErrorMessage({ text: "This question is required*" })}
      </div>
    </div>
  );
};

export default CheckboxQuestion;
