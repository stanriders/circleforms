import React from "react";

interface ISubTitleProps {
  children: React.ReactNode;
}

export default function SubTitle({ children }: ISubTitleProps) {
  return (
    <p className="mt-3 mb-4 ml-10 w-full rounded-full bg-black-lighter py-2 pl-10 text-xl lg:w-96">
      {children}
    </p>
  );
}
