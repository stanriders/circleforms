import React, { memo } from "react";
import { MdClose } from "react-icons/md";
import { useTranslations } from "next-intl";

interface IITemCheckbox {
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  onDelete: React.MouseEventHandler<HTMLButtonElement>;
}

const ItemCheckbox = ({ inputProps, onDelete }: IITemCheckbox) => {
  const t = useTranslations();
  return (
    <div className="flex gap-x-2 items-center">
      <div className="w-6 h-6 border-2" />
      <input
        className="relative p-2 text-2xl font-medium  bg-transparent border-b border-white/20 border-dotted transition-colors input--inline"
        autoComplete="off"
        {...inputProps}
      />
      <button className="button--icon" title={t("removeOption")} onClick={onDelete}>
        <span className="sr-only">{t("removeOption")}</span>
        <MdClose />
      </button>
    </div>
  );
};

export default memo(ItemCheckbox);
