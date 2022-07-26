import React, { memo } from "react";

interface IOptionTabEntry {
  mainHeading: string;
  subText: string;
  children: React.ReactNode;
}
const OptionTabEntry = ({ mainHeading, subText, children }: IOptionTabEntry) => {
  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <p className="text-3xl">{mainHeading}</p>
          <p className="text-2xl text-grey-secondary">{subText}</p>
        </div>
        {children}
      </div>
      <hr className="border-t-2 border-t-grey-border" />
    </>
  );
};

export default memo(OptionTabEntry);
