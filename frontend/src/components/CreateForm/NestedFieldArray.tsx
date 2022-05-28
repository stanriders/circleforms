import { useTranslations } from "next-intl";
import React from "react";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import ItemCheckbox from "./ItemCheckbox";
import ItemCheckboxPlaceholder from "./ItemCheckboxPlaceholder";
import ItemRadio from "./ItemRadio";
import ItemRadioPlaceholder from "./ItemRadioPlaceholder";

const ConditionalInput = ({ control, index, field, nestIndex, remove }) => {
  const value = useWatch({
    name: `questions.${nestIndex}.type`,
    control
  });

  const onDelete = () => remove(index);

  return (
    <Controller
      control={control}
      name={`questions.${nestIndex}.questionInfo.${index}.`}
      render={({ field }) => {
        switch (value) {
          case "Freeform":
            return <></>;

          case "Checkbox":
            return <ItemCheckbox inputProps={{ ...field }} onDelete={onDelete} />;

          case "Choice":
            return <ItemRadio inputProps={{ ...field }} onDelete={onDelete} />;

          case undefined:
            return <></>;

          default:
            console.error("Cant render question of type: ", value);
            return <></>;
        }
      }}
      // defaultValue={field.firstName}
    />
  );
};

const NestedOptionFieldArray = ({ nestIndex, control, register }) => {
  const t = useTranslations();
  const { fields, remove, append, prepend } = useFieldArray({
    control,
    name: `questions.${nestIndex}.questionInfo`
  });

  const questionType = useWatch({
    name: `questions.${nestIndex}.type`,
    control
  });

  const onAppend = () => append("");

  let Placeholder = <></>;
  switch (questionType) {
    case "Freeform":
      Placeholder = <></>;
      break;

    case "Checkbox":
      Placeholder = <ItemCheckboxPlaceholder onClick={onAppend} />;
      break;

    case "Choice":
      Placeholder = <ItemRadioPlaceholder onClick={onAppend} />;
      break;

    case undefined:
      Placeholder = <></>;
      break;

    default:
      console.error("Cant render placeholder of type: ", questionType);
      Placeholder = <></>;
  }

  return (
    <div className="flex flex-col gap-6">
      {fields.map((item, k) => {
        return (
          <div key={item.id}>
            <div className="flex gap-x-2 items-center">
              {/* <input
                className="input--inline"
                {...register(`questions.${nestIndex}.questionInfo.${k}.field1`, {
                  required: true
                })}
              /> */}
              <ConditionalInput
                remove={remove}
                control={control}
                field={item}
                nestIndex={nestIndex}
                index={k}
              />

              {/* <button className="button--icon" title={t("removeOption")} onClick={() => remove(k)}>
                <span className="sr-only">{t("removeOption")}</span>
                <MdClose />
              </button> */}
            </div>
          </div>
        );
      })}

      {Placeholder}

      {/* <div className="flex gap-x-2 items-center">
        <div className="h-6 w-6 border-2" />
        <input
          className="input--inline input--static"
          type="text"
          defaultValue={t("addChoice")}
          readOnly
          onClick={() =>
            append({
              field1: ""
            })
          }
        />
      </div> */}
    </div>
  );
};
export default NestedOptionFieldArray;
