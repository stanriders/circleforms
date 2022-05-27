import React from "react";
import { MdClose } from "react-icons/md";

const ItemCheckbox = () => {
  return (
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
  );
};

export default ItemCheckbox;
