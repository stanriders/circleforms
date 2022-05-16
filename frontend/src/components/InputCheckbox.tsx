import { Field } from "formik";
import React from "react";

interface IInputCheckbox {
  inputText: string;
  labelProps?: React.HTMLProps<HTMLLabelElement>;
  inputProps?: React.HTMLProps<HTMLInputElement>;
}

const InputCheckbox = ({ inputText, labelProps, inputProps }: IInputCheckbox) => {
  return (
    <label className="checkbox-input" {...labelProps}>
      <Field type="checkbox" value={inputText} {...inputProps} />
      {inputText}
    </label>
  );
};

export default InputCheckbox;
