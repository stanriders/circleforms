import React from "react";
import { Control, Controller } from "react-hook-form";
import { MdDeleteOutline, MdMoreVert } from "react-icons/md";
import Switch from "react-switch";
import { Select } from "@mantine/core";
import { useTranslations } from "next-intl";

import { QUESTIONS_TYPES } from "./QuestionFieldArray";
import { IFormValues } from "./QuestionsTab";

interface IQuestionFooter {
  onRemove: React.MouseEventHandler<HTMLButtonElement>;
  control: Control<IFormValues, any>;
  nestIndex: number;
}
const QuestionFooter = ({ onRemove, control, nestIndex }: IQuestionFooter) => {
  const t = useTranslations();

  return (
    <div className="flex justify-between border-t-2 border-white border-opacity-5 pt-4 mt-14">
      <Controller
        name={`questions.${nestIndex}.type`}
        control={control}
        render={({ field }) => (
          <Select
            aria-label="Select question type"
            value={field.value || QUESTIONS_TYPES[0]}
            onChange={field.onChange}
            data={QUESTIONS_TYPES.map((type) => ({
              value: type,
              label: t(`inputs.${type}`)
            }))}
            // https://mantine.dev/core/select/?t=styles
            radius={"lg"}
            size={"md"}
            styles={{
              dropdown: { backgroundColor: "black", color: "#eeeeee" },
              item: { backgroundColor: "black", color: "#eeeeee" },
              input: {
                backgroundColor: "#1a1a1a",
                color: "#eeeeee",
                borderWidth: "2px",
                fontWeight: "bold"
              },
              hovered: { backgroundColor: "#1672d4", color: "#eeeeee" },
              selected: { backgroundColor: "#1a1a1a", color: "#FF66AA" }
              // wrapper: {}
            }}
          />
        )}
      />

      <div className="flex gap-x-2">
        {/* TODO add me later */}
        {/* <button onClick={onDuplicate} className="button--icon">
          <MdContentCopy className="h-8 w-8" />
        </button> */}
        <button onClick={onRemove} className="button--icon mr-4">
          <span className="sr-only">{t("removeQuestion")}</span>
          <MdDeleteOutline className="h-8 w-8" />
        </button>
        <label className="flex items-center gap-x-4 text-2xl font-medium border-l-2 border-white border-opacity-5 pl-8">
          <span>Required</span>

          <Controller
            name={`questions.${nestIndex}.required`}
            control={control}
            render={({ field }) => (
              <Switch
                onChange={field.onChange}
                checked={field.value}
                offColor="#0c0c0c"
                onColor="#0c0c0c"
                onHandleColor="#FF66AA"
                handleDiameter={26}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={32}
                width={58}
                className="border-[2px] border-current"
              />
            )}
          />
        </label>
        <button type="button" className="button--icon">
          <MdMoreVert className="h-8 w-8" />
        </button>
      </div>
    </div>
  );
};

QuestionFooter.displayName = "QuestionFooter";

export default QuestionFooter;
