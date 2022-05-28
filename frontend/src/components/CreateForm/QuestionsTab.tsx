import { useTranslations } from "next-intl";
import React from "react";
import {  useForm } from "react-hook-form";
import QuestionFieldArray from "./QuestionFieldArray";

const defaultValues = {
  questions: [
    {
      title: "",
      type: "Checkbox"
    }
  ]
};

const QuestionsTab = () => {
  const t = useTranslations();

  const { control, register, handleSubmit, getValues, reset, setValue } = useForm({
    defaultValues
  });
  const onSubmit = (data) => console.log("data", data);

  return (
    <div className="">
      <div className="flex flex-col gap-y-4">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <QuestionFieldArray
            {...{ control, register, defaultValues, getValues, setValue }}
          />
          {/* <button type="button" onClick={() => reset(defaultValues)}>
            Reset
          </button> */}
          <button type="submit" >
            submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuestionsTab;
