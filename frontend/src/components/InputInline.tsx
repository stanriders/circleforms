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
      className={`input--inline relative border-b border-dotted  border-white/20 bg-transparent p-2 text-2xl font-medium transition-colors ${className}`}
      {...inputProps}
    />
  );
};

export default InputInline;
