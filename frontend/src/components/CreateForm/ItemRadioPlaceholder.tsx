import React, { memo } from "react";
import { useTranslations } from "next-intl";

interface IItemRadioPlaceholder {
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const ItemRadioPlaceholder = ({ onClick }: IItemRadioPlaceholder) => {
  const t = useTranslations();
  return (
    <div onClick={onClick} className="flex items-center gap-x-2">
      <div className="h-6 w-6 rounded-full border-2 border-grey" />
      <input
        data-testid="radioPlaceholder"
        defaultValue={t("addChoice")}
        className="input--inline relative border-b border-dotted border-white/20  bg-transparent p-2 text-2xl font-medium text-grey transition-colors"
        type="text"
        readOnly
      />
    </div>
  );
};

export default memo(ItemRadioPlaceholder);
