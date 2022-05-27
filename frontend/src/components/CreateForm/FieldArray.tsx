import { useTranslations } from "next-intl";
import React from "react";
import { Controller, useFieldArray } from "react-hook-form";
import {
  MdAddCircleOutline,
  MdCheckBox,
  MdClose,
  MdRadioButtonChecked,
  MdShortText
} from "react-icons/md";
import Wysiwyg from "../Wysiwyg";
import NestedFieldArray from "./NestedFieldArray";
import QuestionFooter from "./QuestionFooter";

let renderCount = 0;

export const QUESTIONS_TYPES = ["Checkbox", "Freeform", "Choice"];

export const QUESTIONS_ICONS = {
  Checkbox: MdCheckBox,
  Freeform: MdShortText,
  Choice: MdRadioButtonChecked
};

const FakeRadio = () => {
  const t = useTranslations();
  return (
    <div className="flex gap-x-2 items-center">
      <div className="h-6 w-6 rounded-full border-2" />
      <input className="input--inline" type="text" />
      <button className="button--icon" title={t("removeOption")}>
        <span className="sr-only">{t("removeOption")}</span>
        <MdClose />
      </button>
    </div>
  );
};

const FieldArray = ({ control, register, setValue, getValues }) => {
  const t = useTranslations();
  const { fields, append, remove, prepend } = useFieldArray({
    control,
    name: "test"
  });

  renderCount++;

  return (
    <>
      <ul className="flex flex-col gap-6">
        {fields.map((item, index) => (
          <li key={item.id}>
            {/* <input {...register(`test.${index}.name`)} /> */}
            <div className="flex flex-col gap-y-4 rounded-35 bg-black-lighter pt-4 pb-6 px-14 relative overflow-clip">
              <div className="absolute left-0 top-0 bg-pink h-full w-2" />
              <Controller
                name={`test.${index}.name`}
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Wysiwyg
                    placeholder="Write your question here"
                    value={field.value}
                    onTextAreaChange={field.onChange}
                  >
                    {" "}
                  </Wysiwyg>
                )}
              />
              {/* <Wysiwyg
                    placeholder="Write your question here"
                    inputProps={register(`test.${index}.name`)}
                  ></Wysiwyg> */}
              <NestedFieldArray nestIndex={index} {...{ control, register }} />
              {/* delete button */}

              <QuestionFooter
                onRemove={() => remove(index)}
                isOptional={false}
                nestIndex={index}
                control={control}
                type={QUESTIONS_TYPES[0]}
              />
            </div>
          </li>
        ))}
      </ul>

      {/* sidebar for adding questions  */}
      <div className="absolute -right-28 top-0 h-full">
        <div className="sticky top-72 flex flex-col items-center  rounded-35 bg-black-lightest py-8 px-2">
          <button className="button--icon">
            <MdAddCircleOutline className="w-10 h-10" />
          </button>
          {QUESTIONS_TYPES.map((type) => {
            const Icon = QUESTIONS_ICONS[type];
            return (
              <button key={type} className="button--icon">
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
            append({ name: "SECRET" });
          }}
        >
          APPEND ANOTHER COMPONENT
        </button>

        <button
          type="button"
          onClick={() => {
            setValue("test", [
              ...(getValues().test || []),
              {
                name: "append",
                nestedArray: [{ field1: "append" }]
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
            setValue("test", [
              {
                name: "append",
                nestedArray: [{ field1: "Prepend", field2: "Prepend" }]
              },
              ...(getValues().test || [])
            ]);
          }}
        >
          prepend Nested
        </button>
      </section>

      <span className="counter">Render Count: {renderCount}</span>
    </>
  );
};

export default FieldArray;
