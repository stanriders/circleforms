import React from "react";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useMutation } from "react-query";
import { DatePicker } from "@mantine/dates";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { array, date, InferType, mixed, object, string } from "yup";

import { Accessibility, Gamemode, ImageQuery, PostContract, Question } from "../../../openapi";
import { apiClient } from "../../libs/apiClient";
import Button from "../Button";
import DropdownSelect from "../DropdownSelect";
import ErrorMessage from "../ErrorMessage";
import { useFormData } from "../FormContext";

const ACCESSABILITY_OPTIONS = Object.values(Accessibility);
const GAMEMODE_OPTIONS = Object.values(Gamemode);

let answerSchema = object({
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
        const filteredQuestionInfo = flattenedQuestions.length > 0 ? flattenedQuestions : null;
        return { ...currentValue, questionInfo: filteredQuestionInfo };
      })
    )
    .required("Create at least one question")
});

const TabOptions = ({
  accessibility = Accessibility.Public,
  gamemode = Gamemode.None,
  activeTo
}: {
  accessibility?: Accessibility;
  gamemode?: Gamemode;
  activeTo?: Date;
}) => {
  const t = useTranslations();
  const router = useRouter();
  const { data, setValues } = useFormData();
  const defaultValues = { accessibility, gamemode, activeTo };

  const { mutateAsync: mutatePost } = useMutation(
    (validatedData: InferType<typeof answerSchema>) => {
      return apiClient.posts.postsPost({
        postContract: validatedData as PostContract
      });
    },
    {
      onSuccess: () => {
        toast.success(t("toast.success"));
      },
      onError: (err) => {
        if (err instanceof Error) {
          toast.error(err?.message);
        }
        toast.error(t("toast.error"));
      }
    }
  );

  const { mutate: mutateImage } = useMutation(
    ({ postid, file, isIcon }: { postid: string; file: File; isIcon: boolean }) => {
      return apiClient.posts.postsIdFilesPut({
        id: postid,
        query: isIcon ? ImageQuery.Icon : ImageQuery.Banner,
        image: file
      });
    }
  );

  const methods = useForm({
    defaultValues,
    mode: "onBlur"
  });

  async function handleFormSubmit() {
    let resObj = { ...data, questions: data?.questions?.questions };
    let validatedData;

    // show error to user
    try {
      validatedData = await answerSchema.validate(resObj);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Something went wrong");
      }
      return;
    }

    const submitData = await mutatePost(validatedData);

    if (submitData?.id) {
      mutateImage({ postid: submitData.id, file: data.icon, isIcon: true });
      mutateImage({ postid: submitData.id, file: data.banner, isIcon: false });
    }
    router.push("/dashboard");
  }

  return (
    <>
      <Toaster />

      <form
        className="flex flex-col gap-y-4 rounded-35 bg-black-lighter pt-4 pb-6 px-14 relative overflow-clip"
        onSubmit={methods.handleSubmit(handleFormSubmit)}
      >
        <div className="absolute left-0 top-0 bg-pink h-full w-2" />
        <Controller
          name={`accessibility`}
          control={methods.control}
          rules={{ required: "True" }}
          render={({ field, fieldState: { error } }) => (
            <div>
              <DropdownSelect
                aria-label="Select post accessibility"
                label="Accessibility"
                required={true}
                {...field}
                onBlur={() => setValues({ accessibility: field.value })}
                data={ACCESSABILITY_OPTIONS.map((type) => ({
                  value: type,
                  label: type
                }))}
                radius={"lg"}
                size={"md"}
              />
              <ErrorMessage text={error?.message} />
            </div>
          )}
        />
        <Controller
          name={`gamemode`}
          control={methods.control}
          rules={{ required: "Game mode is required" }}
          render={({ field, fieldState: { error } }) => (
            <div>
              <DropdownSelect
                aria-label="Select game mode"
                label="Game mode"
                required={true}
                {...field}
                onBlur={() => setValues({ gamemode: field.value })}
                data={GAMEMODE_OPTIONS.map((type) => ({
                  value: type,
                  label: type
                }))}
                radius={"lg"}
                size={"md"}
              />
              <ErrorMessage text={error?.message} />
            </div>
          )}
        />
        <Controller
          name={`activeTo`}
          control={methods.control}
          rules={{ required: "Please pick post end date" }}
          render={({ field, fieldState: { error } }) => (
            <div>
              <DatePicker
                locale="en"
                label="Active to"
                placeholder="Pick a date"
                required
                {...field}
                onBlur={() => setValues({ activeTo: field.value })}
                radius={"lg"}
                size={"md"}
                styles={{
                  root: { maxWidth: "fit-content" },
                  input: { backgroundColor: "#1a1a1a" }
                }}
              />
              <ErrorMessage text={error?.message} />
            </div>
          )}
        />
        <div className="flex justify-center">
          <Button {...{ type: "submit" }}>Create draft</Button>
        </div>
      </form>
    </>
  );
};

export default TabOptions;
