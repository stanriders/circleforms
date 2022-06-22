import React, { memo } from "react";
import { useTranslations } from "next-intl";

interface IItemRadioPlaceholder {
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const ItemRadioPlaceholder = ({ onClick }: IItemRadioPlaceholder) => {
  const t = useTranslations();
  return (
    <div onClick={onClick} className="flex gap-x-2 items-center">
      <div className="w-6 h-6 rounded-full border-2 border-grey" />
      <input
        data-testid="radioPlaceholder"
        defaultValue={t("addChoice")}
        className="relative p-2 text-2xl font-medium text-grey  bg-transparent border-b border-white/20 border-dotted transition-colors input--inline"
        type="text"
        readOnly
      />
    </div>
  );
};

export default memo(ItemRadioPlaceholder);
