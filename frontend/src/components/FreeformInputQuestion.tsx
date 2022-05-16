import React from "react";
import { Question } from "../../openapi";

const FreeformInputQuestion = ({ question }: { question: Question }) => {
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
        id={question.questionId as string}
        required={!question.isOptional}
      />
    </div>
  );
};

export default FreeformInputQuestion;
