interface IRadioProps {
  labelText: string;
  labelProps?: React.HTMLProps<HTMLLabelElement>;
  inputProps?: React.HTMLProps<HTMLInputElement>;
}

export default function InputRadio({ labelText, labelProps, inputProps }: IRadioProps) {
  return (
    <label className="radio-input" htmlFor={labelText} {...labelProps}>
      <input id={labelText} type="radio" {...inputProps} />
      {labelText}
    </label>
  );
}
