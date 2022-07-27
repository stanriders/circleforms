import React, { memo } from "react";
import { useTranslations } from "next-intl";

interface IItemCheckboxPlaceholder {
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const ItemCheckboxPlaceholder = ({ onClick }: IItemCheckboxPlaceholder) => {
  const t = useTranslations();
  return (
    <div onClick={onClick} className="flex items-center gap-x-2">
      <div className="h-6 w-6 border-2 border-grey" />
      <input
        data-testid="checkboxPlaceholder"
        defaultValue={t("addChoice")}
        className="input--inline relative border-b border-dotted border-white/20 bg-transparent p-2 text-2xl font-medium text-grey transition-colors"
        type="text"
        readOnly
      />
    </div>
  );
};

export default memo(ItemCheckboxPlaceholder);
