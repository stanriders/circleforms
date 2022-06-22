import React, { useCallback } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import ConditionalInput from "./ConditionalInput";
import ItemCheckboxPlaceholder from "./ItemCheckboxPlaceholder";
import ItemRadioPlaceholder from "./ItemRadioPlaceholder";

interface INestedOptionFieldArray {
  nestIndex: number;
}
const NestedOptionFieldArray = ({ nestIndex }: INestedOptionFieldArray) => {
  const { control } = useFormContext();
  const { fields, remove, append } = useFieldArray({
    control: control,
    name: `questions.${nestIndex}.question_info`
  });

  const questionType = useWatch({
    name: `questions.${nestIndex}.type`,
    control: control
  });

  const onAppend = useCallback(() => append({ value: "" }), [append]);

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
              data-testid={`input-${field}-${ind}`}
              remove={remove}
              nestIndex={nestIndex}
              index={ind}
              control={control}
            />
          </div>
        );
      })}

      {Placeholder}
    </div>
  );
};
export default NestedOptionFieldArray;
