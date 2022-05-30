import React, { memo } from "react";
import { useTranslations } from "next-intl";

interface IItemCheckboxPlaceholder {
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const ItemCheckboxPlaceholder = ({ onClick }: IItemCheckboxPlaceholder) => {
  const t = useTranslations();
  return (
    <div onClick={onClick} className="flex gap-x-2 items-center">
      <div className="h-6 w-6 border-2" />
      <input
        defaultValue={t("addChoice")}
        className="input--inline input--static"
        type="text"
        readOnly
      />
    </div>
  );
};

export default memo(ItemCheckboxPlaceholder);
