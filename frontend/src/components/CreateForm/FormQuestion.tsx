import React from "react";
import Wysiwyg from "../Wysiwyg";

const FormQuestion = ({ children, title, type, onEditTitle, t }) => {
  return (
    <div className="flex flex-col gap-y-4 rounded-35 bg-black-lighter pt-4 pb-6 px-14 relative overflow-clip">
      <div className="absolute left-0 top-0 bg-pink h-full w-2" />

      <Wysiwyg
        value={title}
        onTextAreaChange={onEditTitle}
        placeholder={t(`placeholders.${type}`)}
      />

      {children}
    </div>
  );
};

export default FormQuestion;
