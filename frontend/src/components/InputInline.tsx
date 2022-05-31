import React from "react";

const InputInline = ({
  inputProps,
  className
}: {
  inputProps: React.HTMLProps<HTMLInputElement>;
  className: string;
}) => {
  return (
    <input
      className={`input--inline bg-transparent text-2xl font-medium  border-b border-dotted border-white border-opacity-20 p-2 relative transition-colors ${className}`}
      {...inputProps}
    />
  );
};

export default InputInline;
