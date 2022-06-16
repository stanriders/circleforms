import React from "react";

import { IQuestionProps } from "../../types/common-types";
import ErrorMessage from "../ErrorMessage";
import InputRadio from "../InputRadio";

// meant to be used inside React Hook Form
const ChoiceRadioQuestion = ({ question, register, errors, disableEdit }: IQuestionProps) => {
  return (
    <div className="flex flex-col gap-2 bg-black-lighter px-8 py-5 rounded-3xl">
      <h2 className="text-3xl font-bold pb-6">
        {question.title}
        {question.is_optional ? null : <span className="text-pink">*</span>}
      </h2>
      <div className="flex flex-col gap-4">
        {question.question_info?.map((text) => {
          const questionId = question.question_id;
          const formProps = {
            ...register(String(questionId), {
              required: !question.is_optional,
              disabled: disableEdit
            })
          };
          return (
            <InputRadio
              key={text}
              labelText={text}
              inputProps={{
                ...formProps,
                "aria-invalid": errors[questionId!] ? "true" : "false"
              }}
            />
          );
        })}
        {errors[String(question.question_id)] &&
          ErrorMessage({ text: "This question is required*" })}
      </div>
    </div>
  );
};

export default ChoiceRadioQuestion;
