import { Control, Controller, FieldErrors, useWatch } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import ItemCheckbox from "./ItemCheckbox";
import ItemRadio from "./ItemRadio";
import { IFormValues } from "./QuestionsTab";

interface IConditionalInput {
  index: number;
  nestIndex: number;
  control: Control<IFormValues, any>;
  remove: (index: number) => void;
  errors: FieldErrors<IFormValues>;
}
const ConditionalInput = ({ control, index, nestIndex, remove, errors }: IConditionalInput) => {
  const value = useWatch({
    name: `questions.${nestIndex}.type`,
    control
  });

  const onDelete = () => remove(index);

  return (
    <div>
      <Controller
        control={control}
        // @ts-ignore
        // so we have two options here:
        // 1) with the current approach, the result looks like: questionInfo: [string1, string2]
        // 2) to avoid the TS error, we must do: questionInfo.${index}.value , but then the output will look like: questionInfo: [{value : string1}, {value : string2}] , which is not really what we want
        name={`questions.${nestIndex}.questionInfo.${index}.`}
        rules={{ required: "Option text cannot be blank" }}
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
      />
      <ErrorMessage>{errors?.questions?.[nestIndex]?.questionInfo?.[index]?.message}</ErrorMessage>
    </div>
  );
};

export default ConditionalInput;
