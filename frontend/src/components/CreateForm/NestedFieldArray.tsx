import React from "react";
import { Control, FieldErrors, useFieldArray, useWatch } from "react-hook-form";

import ConditionalInput from "./ConditionalInput";
import ItemCheckboxPlaceholder from "./ItemCheckboxPlaceholder";
import ItemRadioPlaceholder from "./ItemRadioPlaceholder";
import { IFormValues } from "./QuestionsTab";
interface INestedOptionFieldArray {
  nestIndex: number;
  control: Control<IFormValues, any>;
  errors: FieldErrors<IFormValues>;
}
const NestedOptionFieldArray = ({ nestIndex, control, errors }: INestedOptionFieldArray) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `questions.${nestIndex}.questionInfo`
  });

  const questionType = useWatch({
    name: `questions.${nestIndex}.type`,
    control
  });

  const onAppend = () => append({ value: "" });

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
      {fields.map((field, ind) => {
        return (
          <div key={field.id} className="flex gap-x-2 items-center">
            <ConditionalInput
              remove={remove}
              control={control}
              nestIndex={nestIndex}
              index={ind}
              errors={errors}
            />
          </div>
        );
      })}

      {Placeholder}
    </div>
  );
};
export default NestedOptionFieldArray;
