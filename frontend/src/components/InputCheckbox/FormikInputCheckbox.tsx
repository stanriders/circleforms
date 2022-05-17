import { Field } from "formik";
import React from "react";
import { IInputCheckbox } from "./InputCheckbox";

const FormikInputCheckbox = ({ inputText, labelProps, inputProps }: IInputCheckbox) => {
  return (
    <label className="checkbox-input" {...labelProps}>
      <Field type="checkbox" value={inputText} {...inputProps} />
      {inputText}
    </label>
  );
};

export default FormikInputCheckbox;
