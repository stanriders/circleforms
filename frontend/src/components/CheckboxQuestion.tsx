import React from "react";
import { Question } from "../../openapi";
import FormikInputCheckbox from "./InputCheckbox/FormikInputCheckbox";

const CheckboxQuestion = ({ question }: { question: Question }) => {
  return (
    <div className="flex flex-col gap-2 bg-black-lighter px-8 py-5 rounded-3xl">
      <h2 className="text-3xl font-bold pb-6">
        {question.title} {question.isOptional ? null : <span className="text-pink">*</span>}
      </h2>
      <div className="flex flex-col gap-4">
        {question.questionInfo?.map((text) => {
          const questionId = question.questionId;
          return (
            <FormikInputCheckbox
              key={questionId + text}
              inputText={text}
              inputProps={{ name: String(questionId), required: !question.isOptional }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CheckboxQuestion;
