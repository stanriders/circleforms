import React, { memo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { GrTextAlignFull } from "react-icons/gr";
import { MdCheckBox, MdDeleteOutline, MdMoreVert, MdRadioButtonChecked } from "react-icons/md";
import Switch from "react-switch";
import VisuallyHidden from "@reach/visually-hidden";
import { useTranslations } from "next-intl";
import { QuestionType } from "openapi";

import DropdownSelect from "../DropdownSelect";

import { QUESTIONS_TYPES } from "./QuestionFieldArray";

interface IQuestionFooter {
  onRemove: React.MouseEventHandler<HTMLButtonElement>;
  nestIndex: number;
}
const QuestionFooter = ({ onRemove, nestIndex }: IQuestionFooter) => {
  const t = useTranslations();
  const { control } = useFormContext();

  const getIconFromType = (type: QuestionType) => {
    if (!type) return null;
    switch (type) {
      case "Checkbox":
        return <MdCheckBox size={25} color="white" />;
      case "Freeform":
        return <GrTextAlignFull size={20} color="white" />;
      case "Choice":
        return <MdRadioButtonChecked size={25} color="white" />;
      default:
        console.error(`icon for type ${type} not found`);
        return null;
    }
  };

  return (
    <div className="flex justify-between pt-4 mt-auto border-t-2 border-white/5">
      <Controller
        name={`questions.${nestIndex}.type`}
        control={control}
        render={({ field }) => (
          <DropdownSelect
            icon={getIconFromType(field.value)}
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
        <button onClick={onRemove} className="mr-4 button--icon">
          <span className="sr-only">{t("removeQuestion")}</span>
          <MdDeleteOutline className="w-8 h-8" />
        </button>
        <label className="flex gap-x-4 items-center pl-8 text-2xl font-medium border-l-2 border-white/5">
          <span>Optional</span>

          <Controller
            name={`questions.${nestIndex}.is_optional`}
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
          <VisuallyHidden>Show more</VisuallyHidden>
          <MdMoreVert className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

QuestionFooter.displayName = "QuestionFooter";

export default memo(QuestionFooter);
