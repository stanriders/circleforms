import { useTranslations } from "next-intl";
import React from "react";
import { MdClose } from "react-icons/md";

interface IITemCheckbox {
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  onDelete: React.MouseEventHandler<HTMLButtonElement>;
}

const ItemCheckbox = ({ inputProps, onDelete }: IITemCheckbox) => {
  const t = useTranslations();
  return (
    <div className="flex gap-x-2 items-center">
      <div className="h-6 w-6 border-2" />
      <input className="input--inline" autoComplete="off" {...inputProps} />
      <button className="button--icon" title={t("removeOption")} onClick={onDelete}>
        <span className="sr-only">{t("removeOption")}</span>
        <MdClose />
      </button>
    </div>
  );
};

export default ItemCheckbox;
