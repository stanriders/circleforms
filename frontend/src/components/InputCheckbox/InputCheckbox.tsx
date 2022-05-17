
import React from "react";

export interface IInputCheckbox {
  inputText: string;
  labelProps?: React.HTMLProps<HTMLLabelElement>;
  inputProps?: React.HTMLProps<HTMLInputElement>;
}

const InputCheckbox = ({ inputText, labelProps, inputProps }: IInputCheckbox) => {
  return (
    <label className="checkbox-input" {...labelProps}>
      <input type="checkbox" value={inputText} {...inputProps} />
      {inputText}
    </label>
  );
};

export default InputCheckbox;
