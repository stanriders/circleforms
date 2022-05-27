import React from "react";

const QuestionError = ({ text }: { text: string }) => {
  return (
    <p className="text-pink" role="alert">
      {text}
    </p>
  );
};

export default QuestionError;
