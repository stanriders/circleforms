import React from "react";
import { useTranslations } from "next-intl";

interface IItemRadioPlaceholder {
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const ItemRadioPlaceholder = ({ onClick }: IItemRadioPlaceholder) => {
  const t = useTranslations();
  return (
    <div onClick={onClick} className="flex gap-x-2 items-center">
      <div className="h-6 w-6 rounded-full border-2" />
      <input
        defaultValue={t("addChoice")}
        className="input--inline input--static"
        type="text"
        readOnly
      />
    </div>
  );
};

export default ItemRadioPlaceholder;