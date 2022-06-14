import { FormProvider, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

import { QuestionType } from "../../../openapi";
import { useFormData } from "../FormContext";

import QuestionFieldArray from "./QuestionFieldArray";

export interface QuestionEntry {
  question_info: Array<Record<"value", string>>;
  type: QuestionType;
  is_optional: boolean;
  title: string;
}
export interface IFormValues {
  questions?: QuestionEntry[];
}

const TabQuestions = ({ defaultValues }: { defaultValues?: IFormValues }) => {
  const { setValues } = useFormData();

  const methods = useForm<IFormValues>({
    defaultValues,
    mode: "onBlur"
  });

  return (
    <div className="">
      <div className="flex flex-col gap-y-4">
        <FormProvider {...methods}>
          <form
            className="flex flex-col gap-6"
            onBlur={() => setValues({ questions: methods.getValues() })}
          >
            <QuestionFieldArray />
            {/* Dev tools will lag with large amount of nested inputs */}
            {/* doesnt affect prod */}
            <DevTool control={methods.control} />
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default TabQuestions;
