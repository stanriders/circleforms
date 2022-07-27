import React, { memo } from "react";
import { MdClose } from "react-icons/md";
import { useTranslations } from "next-intl";

interface IITemRadio {
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  onDelete: React.MouseEventHandler<HTMLButtonElement>;
}

const ItemRadio = ({ inputProps, onDelete }: IITemRadio) => {
  const t = useTranslations();
  return (
    <div className="flex items-center gap-x-2">
      <div className="h-6 w-6 rounded-full border-2" />
      <input
        className="input--inline relative border-b border-dotted  border-white/20 bg-transparent p-2  text-2xl font-medium transition-colors"
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

export default memo(ItemRadio);
