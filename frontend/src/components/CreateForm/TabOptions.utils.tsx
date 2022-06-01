import { array, date, mixed, object, string } from "yup";

import { Accessibility, Gamemode, Question } from "../../../openapi";

export const ACCESSABILITY_OPTIONS = Object.values(Accessibility);
export const GAMEMODE_OPTIONS = Object.values(Gamemode);

export const answerSchema = object({
  title: string().required("Form title is required"),
  excerpt: string().required("Form excerpt description is required"),
  description: string().required("Main post body is required"),
  accessibility: mixed<Accessibility>()
    .oneOf([...ACCESSABILITY_OPTIONS])
    .required("Active to date is required")
    .default(Accessibility.Public),
  activeTo: date().required("Active to date is required").min(new Date()),
  gamemode: mixed<Gamemode>()
    .oneOf([...GAMEMODE_OPTIONS])
    .required("Game mode is required")
    .default(Gamemode.None),
  questions: array()
    .of(
      mixed<Question>().transform((currentValue) => {
        // we need to transform questionInfo
        // from being an array of object: [{value: string1}, {value:string2}]
        // to just array of strings
        const flattenedQuestions = currentValue?.questionInfo?.map(
          (obj: Record<"value", string>) => obj.value
        );
        const filteredQuestionInfo = flattenedQuestions.length > 0 ? flattenedQuestions : [];
        return { ...currentValue, questionInfo: filteredQuestionInfo };
      })
    )
    .required("Create at least one question")
    .min(1, "Create at least one question")
});
