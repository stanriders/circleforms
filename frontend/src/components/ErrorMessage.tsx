import React from "react";

const ErrorMessage = ({
  text,
  children,
  classname
}: {
  text?: string;
  children?: React.ReactNode;
  classname?: string;
}) => {
  return (
    <p data-testid="errorMessage" className={`text-pink ${classname}`} role="alert">
      {text}
      {children}
    </p>
  );
};

export default ErrorMessage;
