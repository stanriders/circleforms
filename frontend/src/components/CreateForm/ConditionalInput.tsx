import { Control, Controller, FieldValues, useFormContext, useWatch } from "react-hook-form";

import { QuestionType } from "../../../openapi";
import ErrorMessage from "../ErrorMessage";
import { useFormData } from "../FormContext";

import ItemCheckbox from "./ItemCheckbox";
import ItemRadio from "./ItemRadio";

interface IConditionalInput {
  index: number;
  nestIndex: number;
  remove: (index: number) => void;
  control: Control<FieldValues, any>;
}

const ConditionalInput = ({ index, nestIndex, remove, control }: IConditionalInput) => {
  const { getValues } = useFormContext();
  const { setValues } = useFormData();

  const questionType: QuestionType = useWatch({
    name: `questions.${nestIndex}.type`,
    control: control
  });

  const onDelete = () => {
    remove(index);
    // we have to setValues here because remove doesnt trigger onBlur event
    // and we could be missing data, if user instantly switches tabs after deleting
    setValues({ questions: getValues() });
  };

  return (
    <div>
      <Controller
        control={control}
        name={`questions.${nestIndex}.questionInfo.${index}.value`}
        rules={{ required: "Option text cannot be blank" }}
        render={({ field, fieldState: { error } }) => {
          switch (questionType) {
            case "Freeform":
              return <></>;
            case "Checkbox":
              return (
                <>
                  <ItemCheckbox inputProps={{ ...field }} onDelete={onDelete} />
                  <ErrorMessage>{error?.message}</ErrorMessage>
                </>
              );
            case "Choice":
              return (
                <div>
                  <ItemRadio inputProps={{ ...field }} onDelete={onDelete} />
                  <ErrorMessage>{error?.message}</ErrorMessage>
                </div>
              );
            case undefined:
              return <></>;
            default:
              console.error("Cant render question of type: ", questionType);
              return <></>;
          }
        }}
      />
    </div>
  );
};

export default ConditionalInput;
