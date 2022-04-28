import React from "react";

interface ISubTitleProps {
  children: React.ReactNode;
}

export default function SubTitle({ children }: ISubTitleProps) {
  return (
    <p className="bg-black-lighter pl-10 py-2 w-full lg:w-96 rounded-full mt-3 mb-4 ml-10 text-xl">
      {children}
    </p>
  );
}
