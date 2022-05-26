import React from "react";
import { IQuestionProps } from "../../types/common-types";
import InputRadio from "../InputRadio";
import QuestionError from "../QuestionError";

// meant to be used inside React Hook Form
const ChoiceRadioQuestion = ({ question, register, errors, disableEdit }: IQuestionProps) => {
  return (
    <div className="flex flex-col gap-2 bg-black-lighter px-8 py-5 rounded-3xl">
      <h2 className="text-3xl font-bold pb-6">
        {question.title}
        {question.isOptional ? null : <span className="text-pink">*</span>}
      </h2>
      <div className="flex flex-col gap-4">
        {question.questionInfo?.map((text) => {
          const questionId = question.questionId;
          const formProps = {
            ...register(String(questionId), {
              required: !question.isOptional,
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
        {errors[String(question.questionId)] &&
          QuestionError({ text: "This question is required*" })}
      </div>
    </div>
  );
};

export default ChoiceRadioQuestion;
