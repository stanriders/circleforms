import React from "react";
import { IQuestionProps } from "../../types/common-types";
import QuestionError from "../QuestionError";

// meant to be used inside React Hook Form
const FreeformInputQuestion = ({ question, register, errors, disableEdit }: IQuestionProps) => {
  return (
    <div className="flex flex-col gap-2 bg-black-lighter px-8 py-5 rounded-3xl">
      <label className="text-3xl font-bold" htmlFor={question.questionId as string}>
        {question.title}
        {question.isOptional ? null : <span className="text-pink">*</span>}
      </label>
      <input
        placeholder="Your answer"
        className="input--inline"
        type="text"
        autoComplete="off"
        {...register(String(question.questionId), {
          required: !question.isOptional,
          disabled: disableEdit
        })}
      />
      {errors[String(question.questionId)] && QuestionError({ text: "This question is required*" })}
    </div>
  );
};

export default FreeformInputQuestion;
