import { Field } from "formik";

interface IRadioProps {
  labelText: string;
  labelProps?: React.HTMLProps<HTMLLabelElement>;
  inputProps?: React.HTMLProps<HTMLInputElement>;
}

export default function InputRadio({ labelText, labelProps, inputProps }: IRadioProps) {
  return (
    <label className="radio-input" {...labelProps}>
      <Field type="radio" value={labelText} {...inputProps} />
      {labelText}
    </label>
  );
}
