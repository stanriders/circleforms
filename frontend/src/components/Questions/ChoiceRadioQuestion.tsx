import React from "react";

import { IQuestionProps } from "../../types/common-types";
import ErrorMessage from "../ErrorMessage";
import InputRadio from "../InputRadio";

// meant to be used inside React Hook Form
const ChoiceRadioQuestion = ({ question, register, errors, disableEdit }: IQuestionProps) => {
  return (
    <div className="flex flex-col gap-2 py-5 px-8 bg-black-lighter rounded-3xl">
      <h2 className="pb-6 text-3xl font-bold">
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
