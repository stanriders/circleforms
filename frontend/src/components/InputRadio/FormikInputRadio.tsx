import { Field } from "formik";
import { IRadioProps } from "./InputRadio";

// we should reuse InputRadio instead of duplicating it, but i guess its fine for now
export const FormikInputRadio = ({ labelText, labelProps, inputProps }: IRadioProps) => {
  return (
    <label className="radio-input" {...labelProps}>
      <Field type="radio" value={labelText} {...inputProps} />
      {labelText}
    </label>
  );
};
