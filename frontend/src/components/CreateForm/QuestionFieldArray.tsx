import React from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { IconType } from "react-icons";
import { MdCheckBox, MdRadioButtonChecked, MdShortText } from "react-icons/md";
import { useTranslations } from "next-intl";

import { QuestionType } from "../../../openapi";
import ErrorMessage from "../ErrorMessage";
import { useFormData } from "../FormContext";
import Wysiwyg from "../Wysiwyg";

import NestedOptionFieldArray from "./NestedFieldArray";
import QuestionFooter from "./QuestionFooter";

export const QUESTIONS_TYPES = Object.values(QuestionType);

export const QUESTIONS_ICONS: Record<QuestionType, IconType> = {
  Checkbox: MdCheckBox,
  Freeform: MdShortText,
  Choice: MdRadioButtonChecked
};

const QuestionFieldArray = () => {
  const t = useTranslations();
  const { setValues } = useFormData();
  const { control, getValues } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: `questions`
  });
  const showEmptyMessage = fields.length === 0;

  return (
    <div>
      {showEmptyMessage && (
        <p data-testid="no-questions-text" className="py-6 text-center text-lg">
          No questions created yet. Press any button on the right to create a question.
        </p>
      )}
      <>
        <ul className="flex flex-col gap-6">
          {fields.map((item, index) => (
            <li key={item.id}>
              <div className="relative flex min-h-[360px] flex-col gap-y-4 text-clip rounded-35 bg-black-lighter px-14 pt-4 pb-6">
                <div className="absolute top-0 left-0 h-full w-2 bg-pink" />
                {/* wysiwyg acts as input for question title */}
                <div>
                  <Controller
                    name={`questions.${index}.title`}
                    control={control}
                    rules={{ required: "Question title is required" }}
                    render={({ field, fieldState }) => (
                      <div>
                        <Wysiwyg
                          data-testid={`questionInput${index}`}
                          placeholder="Write your question here"
                          value={field.value}
                          onTextAreaChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                        />
                        <ErrorMessage>{fieldState.error?.message}</ErrorMessage>
                      </div>
                    )}
                  />
                </div>

                <NestedOptionFieldArray nestIndex={index} />
                <QuestionFooter
                  onRemove={() => {
                    remove(index);
                    // we have to setValues here because remove doesnt trigger onBlur event
                    // and we could be missing data, if user instantly switches tabs after deleting
                    setValues({ questions: getValues() });
                  }}
                  nestIndex={index}
                />
              </div>
            </li>
          ))}
        </ul>
        {/* sidebar for adding questions  */}
        <div className="absolute top-0 -right-28 h-full">
          <div className="sticky top-72 flex flex-col items-center rounded-35 bg-black-lightest py-8 px-2">
            {QUESTIONS_TYPES.map((type) => {
              const Icon = QUESTIONS_ICONS[type];
              return (
                <button
                  data-testid={`questions-button-${type}`}
                  type="button"
                  key={type}
                  className="button--icon"
                  onClick={() => {
                    append({ title: undefined, type: type, is_optional: false });
                  }}
                >
                  <span className="sr-only">
                    {t("add")} {t(`inputs.${type}`)}
                  </span>
                  <Icon className="h-10 w-10" />
                </button>
              );
            })}
          </div>
        </div>
      </>
    </div>
  );
};

export default QuestionFieldArray;
