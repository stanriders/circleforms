import React from "react";

interface IInputCheckbox {
  inputText: string;
  labelProps?: React.HTMLProps<HTMLLabelElement>;
  inputProps?: React.HTMLProps<HTMLInputElement>;
}

const InputCheckbox = ({ inputText, labelProps, inputProps }: IInputCheckbox) => {
  return (
    <label className="checkbox-input" htmlFor={inputText} {...labelProps}>
      <input id={inputText} type="checkbox" name={inputText} {...inputProps} />
      {inputText}
    </label>
  );
};

export default InputCheckbox;
