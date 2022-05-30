import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

import { QuestionType } from "../../../openapi";
import { useFormData } from "../FormContext";

import QuestionFieldArray from "./QuestionFieldArray";

interface QuestionEntry {
  // questionInfo: Array<string>;
  questionInfo: Array<Record<"value", string>>;
  type: QuestionType;
  required: boolean;
  title: string;
}
export interface IFormValues {
  questions: QuestionEntry[];
}

const QuestionsTab = ({ defaultValues }: { defaultValues?: IFormValues }) => {
  const { setValues } = useFormData();

  const {
    control,
    register,
    getValues,
    setValue,
    formState: { errors }
  } = useForm<IFormValues>({
    defaultValues,
    mode: "onBlur"
  });

  return (
    <div className="">
      <div className="flex flex-col gap-y-4">
        <form className="flex flex-col gap-6" onBlur={() => setValues({ questions: getValues() })}>
          <QuestionFieldArray
            {...{ control, register, defaultValues, getValues, setValue, errors }}
          />

          {/* Dev tools will lag with large amount of nested inputs */}
          {/* doesnt affect prod */}
          <DevTool control={control} />
        </form>
      </div>
    </div>
  );
};

export default QuestionsTab;
