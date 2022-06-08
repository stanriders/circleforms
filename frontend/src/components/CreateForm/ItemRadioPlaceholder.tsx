import React, { memo } from "react";
import { useTranslations } from "next-intl";

interface IItemRadioPlaceholder {
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const ItemRadioPlaceholder = ({ onClick }: IItemRadioPlaceholder) => {
  const t = useTranslations();
  return (
    <div onClick={onClick} className="flex gap-x-2 items-center">
      <div className="h-6 w-6 rounded-full border-2 border-grey" />
      <input
        defaultValue={t("addChoice")}
        className="input--inline bg-transparent text-2xl font-medium  border-b border-dotted border-white border-opacity-20 p-2 relative transition-colors text-grey"
        type="text"
        readOnly
      />
    </div>
  );
};

export default memo(ItemRadioPlaceholder);
