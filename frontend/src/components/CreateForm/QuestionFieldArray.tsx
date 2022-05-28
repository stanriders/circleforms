import { useTranslations } from "next-intl";
import React from "react";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import { MdCheckBox, MdRadioButtonChecked, MdShortText } from "react-icons/md";
import Wysiwyg from "../Wysiwyg";

import NestedOptionFieldArray from "./NestedFieldArray";
import QuestionFooter from "./QuestionFooter";

export const QUESTIONS_TYPES = ["Checkbox", "Freeform", "Choice"];

export const QUESTIONS_ICONS = {
  Checkbox: MdCheckBox,
  Freeform: MdShortText,
  Choice: MdRadioButtonChecked
};

const QuestionFieldArray = ({ control, register, setValue, getValues }) => {
  const t = useTranslations();
  const { fields, append, remove, prepend } = useFieldArray({
    control,
    name: "questions"
  });

  return (
    <>
      <ul className="flex flex-col gap-6">
        {fields.map((item, index) => (
          <li key={item.id}>
            <div className="flex flex-col gap-y-4 rounded-35 bg-black-lighter pt-4 pb-6 px-14 relative overflow-clip">
              <div className="absolute left-0 top-0 bg-pink h-full w-2" />
              {/* wysiwyg acts as input for question title */}
              <Controller
                name={`questions.${index}.title`}
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Wysiwyg
                    placeholder="Write your question here"
                    value={field.value}
                    onTextAreaChange={field.onChange}
                  />
                )}
              />

              <NestedOptionFieldArray nestIndex={index} {...{ control, register }} />

              <QuestionFooter
                onRemove={() => remove(index)}
                isOptional={false}
                nestIndex={index}
                control={control}
                type={QUESTIONS_TYPES[0]}
                register={register}
              />
            </div>
          </li>
        ))}
      </ul>

      {/* sidebar for adding questions  */}
      <div className="absolute -right-28 top-0 h-full">
        <div className="sticky top-72 flex flex-col items-center  rounded-35 bg-black-lightest py-8 px-2">
          {QUESTIONS_TYPES.map((type) => {
            const Icon = QUESTIONS_ICONS[type];
            return (
              <button
                key={type}
                className="button--icon"
                onClick={() => {
                  append({ title: "", type: type });
                }}
              >
                <span className="sr-only">
                  {t("add")} {t(`inputs.${type}`)}
                </span>
                <Icon className="w-10 h-10" />
              </button>
            );
          })}
        </div>
      </div>

      <section className="flex flex-row gap-6">
        <button
          type="button"
          onClick={() => {
            append({ name: "append" });
          }}
        >
          append
        </button>

        <button
          type="button"
          onClick={() => {
            append({ name: "thing", type: "Choice" });
          }}
        >
          APPEND ANOTHER COMPONENT
        </button>

        <button
          type="button"
          onClick={() => {
            setValue("questions", [
              ...(getValues().questions || []),
              {
                name: "append",
                questionInfo: [{ field1: "append" }]
              }
            ]);
          }}
        >
          Append Nested
        </button>

        <button
          type="button"
          onClick={() => {
            prepend({ name: "append" });
          }}
        >
          prepend
        </button>

        <button
          type="button"
          onClick={() => {
            setValue("questions", [
              {
                name: "append",
                questionInfo: [{ field1: "Prepend", field2: "Prepend" }]
              },
              ...(getValues().questions || [])
            ]);
          }}
        >
          prepend Nested
        </button>
      </section>
    </>
  );
};

export default QuestionFieldArray;
