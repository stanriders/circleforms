import React, { memo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { MdDeleteOutline, MdMoreVert } from "react-icons/md";
import Switch from "react-switch";
import { useTranslations } from "next-intl";

import DropdownSelect from "../DropdownSelect";

import { QUESTIONS_TYPES } from "./QuestionFieldArray";

interface IQuestionFooter {
  onRemove: React.MouseEventHandler<HTMLButtonElement>;
  nestIndex: number;
}
const QuestionFooter = ({ onRemove, nestIndex }: IQuestionFooter) => {
  const t = useTranslations();
  const { control } = useFormContext();

  return (
    <div className="flex justify-between border-t-2 border-white border-opacity-5 pt-4 mt-14">
      <Controller
        name={`questions.${nestIndex}.type`}
        control={control}
        render={({ field }) => (
          <DropdownSelect
            aria-label="Select question type"
            value={field.value || QUESTIONS_TYPES[0]}
            onChange={field.onChange}
            data={QUESTIONS_TYPES.map((type) => ({
              value: type,
              label: t(`inputs.${type}`)
            }))}
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

export default memo(QuestionFooter);
