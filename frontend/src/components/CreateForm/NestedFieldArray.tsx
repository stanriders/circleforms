import { useTranslations } from "next-intl";
import React from "react";
import { useFieldArray } from "react-hook-form";
import { MdClose } from "react-icons/md";

const NestedFieldArray = ({ nestIndex, control, register }) => {
  const t = useTranslations();
  const { fields, remove, append, prepend } = useFieldArray({
    control,
    name: `test.${nestIndex}.nestedArray`
  });

  return (
    <div className="flex flex-col gap-6">
      {fields.map((item, k) => {
        return (
          <div key={item.id}>
            <div className="flex gap-x-2 items-center">
              <div className="h-6 w-6 border-2" />
              <input
                className="input--inline"
                {...register(`test.${nestIndex}.nestedArray.${k}.field1`, {
                  required: true
                })}
              />
              <button className="button--icon" title={t("removeOption")} onClick={() => remove(k)}>
                <span className="sr-only">{t("removeOption")}</span>
                <MdClose />
              </button>
            </div>
          </div>
        );
      })}

      <div className="flex gap-x-2 items-center">
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
      </div>
    </div>
  );
};
export default NestedFieldArray;
