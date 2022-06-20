import React from "react";

interface ISubTitleProps {
  children: React.ReactNode;
}

export default function SubTitle({ children }: ISubTitleProps) {
  return (
    <p className="py-2 pl-10 mt-3 mb-4 ml-10 w-full text-xl bg-black-lighter rounded-full lg:w-96">
      {children}
    </p>
  );
}
