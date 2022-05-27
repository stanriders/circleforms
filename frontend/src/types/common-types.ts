import { FieldValues, UseFormRegister } from "react-hook-form";
import { Question } from "../../openapi";
import LOCALES from "../libs/i18n";

export type Locales = keyof typeof LOCALES;

export interface IQuestionProps {
  question: Question;
  register: UseFormRegister<FieldValues>;
  errors: { [x: string]: any };
  disableEdit?: boolean;
}
