import React from "react";

const ErrorMessage = ({ text, children }: { text?: string; children?: React.ReactNode }) => {
  return (
    <p className="text-pink" role="alert">
      {text}
      {children}
    </p>
  );
};

export default ErrorMessage;
