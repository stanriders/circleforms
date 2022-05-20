export interface IRadioProps {
  labelText: string;
  labelProps?: React.HTMLProps<HTMLLabelElement>;
  inputProps?: React.HTMLProps<HTMLInputElement>;
}

export default function InputRadio({ labelText, labelProps, inputProps }: IRadioProps) {
  return (
    <label className="radio-input" {...labelProps}>
      <input type="radio" value={labelText} {...inputProps} />
      {labelText}
    </label>
  );
}
