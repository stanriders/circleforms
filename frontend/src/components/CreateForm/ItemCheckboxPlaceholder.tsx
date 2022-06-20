import React, { memo } from "react";
import { useTranslations } from "next-intl";

interface IItemCheckboxPlaceholder {
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const ItemCheckboxPlaceholder = ({ onClick }: IItemCheckboxPlaceholder) => {
  const t = useTranslations();
  return (
    <div onClick={onClick} className="flex gap-x-2 items-center">
      <div className="w-6 h-6 border-2 border-grey" />
      <input
        defaultValue={t("addChoice")}
        className="relative p-2 text-2xl font-medium text-grey bg-transparent border-b border-white/20 border-dotted transition-colors input--inline"
        type="text"
        readOnly
      />
    </div>
  );
};

export default memo(ItemCheckboxPlaceholder);
