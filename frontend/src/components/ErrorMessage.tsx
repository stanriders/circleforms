import React from "react";

const ErrorMessage = ({ text }: { text: string }) => {
  return (
    <p className="text-pink" role="alert">
      {text}
    </p>
  );
};

export default ErrorMessage;
