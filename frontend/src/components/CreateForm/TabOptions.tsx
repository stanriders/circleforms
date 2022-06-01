import React from "react";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { DatePicker } from "@mantine/dates";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { isEqual, isMatch } from "underscore";
import { InferType } from "yup";

import { Accessibility, Gamemode, PostContract, PostWithQuestionsContract } from "../../../openapi";
import Button from "../Button";
import DropdownSelect from "../DropdownSelect";
import ErrorMessage from "../ErrorMessage";
import { useFormData } from "../FormContext";

import { usePublishPost, useSubmitImage, useSubmitPost } from "./TabOptions.hooks";
import { ACCESSABILITY_OPTIONS, answerSchema, GAMEMODE_OPTIONS } from "./TabOptions.utils";
import { arraysEqual } from "../../utils/misc";

interface ITabOptions {
  post?: PostWithQuestionsContract;
  isEdit?: boolean;
}

const TabOptions = ({ post, isEdit }: ITabOptions) => {
  const t = useTranslations();
  const router = useRouter();
  const { data, setValues } = useFormData();
  const { mutateAsync: submitPost } = useSubmitPost();
  const { mutate: mutateImage } = useSubmitImage();
  const { mutateAsync: publishPost } = usePublishPost();

  // init form state (if editing)
  const defaultValues = {
    accessibility: post?.accessibility || Accessibility.Public,
    gamemode: post?.gamemode || Gamemode.None,
    activeTo: post?.activeTo
  };
  const methods = useForm({
    defaultValues,
    mode: "onBlur"
  });

  const getValidatedData = async () => {
    let resObj = { ...data, questions: data?.questions?.questions };
    let validatedData;

    // show error to user
    try {
      validatedData = await answerSchema.validate(resObj);
      return validatedData;
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Something went wrong");
      }
      return;
    }
  };

  async function handleFormSubmit() {
    const validatedData = await getValidatedData();
    if (!validatedData) return;

    const submitData = await submitPost(validatedData);
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
        {!isEdit && (
          <div className="flex justify-center">
            <Button {...{ type: "submit" }}>Create draft</Button>
          </div>
        )}

        {isEdit && (
          <div className="flex flex-row gap-16 self-center">
            <Button
              {...{ type: "button" }}
              onClick={async () => {
                if (!post) return;
                let validatedData = await getValidatedData();
                if (!validatedData) return;

                const validatedQuestions = [...validatedData.questions];
                // typescript is yelling, so we delete property questions in object that references the original
                let tmp: Partial<InferType<typeof answerSchema>> = validatedData;
                delete tmp["questions"];

                console.log(post);
                console.log("VALIDATED DATA: ");

                console.log(validatedData);

                const getNonObjectFieldChanges = (
                  oldObj: Record<string, any>,
                  newObj: Record<string, any>
                ) => {
                  // only append fields that changed compared to old object
                  let resObj: any = {};
                  for (const [key, value] of Object.entries(newObj)) {
                    if (typeof value === "object") continue;
                    if (oldObj?.[key] !== value) {
                      resObj[key] = value;
                    }
                  }
                  return resObj;
                };

                // parse all strings and dates that changed
                let resObj: any = {};
                for (const [key, value] of Object.entries(validatedData)) {
                  const keyWithType = key as keyof typeof post;
                  if (
                    typeof value === "object" &&
                    key !== "questions" &&
                    !isMatch(post[keyWithType], value)
                  ) {
                    resObj[key] = value;
                    continue;
                  }

                  if (post?.[keyWithType] !== value) {
                    resObj[key] = value;
                  }
                }

                const resultQuestions = [];

                console.log("res obj: ", resObj);
                console.log("questions ", validatedQuestions);

                // iterate over post.questions
                // if question info is the same, add changes to the title
                // if the question info changes add it with delete:true

                for (let question of validatedQuestions) {
                  // console.log(question);

                  const apiId = question?.questionId;

                  // question came from api, because it has questionId
                  if (apiId) {
                    console.log("apiId", apiId);

                    const sameQuestion = post.questions?.find(
                      ({ questionId }) => questionId === apiId
                    );
                    // check if question info did change
                    // or if some property has changed
                    if (
                      !arraysEqual(
                        question?.questionInfo as string[],
                        sameQuestion?.questionInfo as string[]
                      ) ||
                      !isMatch(sameQuestion, question)
                    ) {
                      // add old post marked as delete
                      resultQuestions.push({ ...sameQuestion, delete: true });
                      // also add new one
                      resultQuestions.push(question);
                    } else {
                      // question info is the same, check for changes in title/type etc
                      // const filteredQuestion = question?.filter(Object);
                      // if ()
                    }
                    console.log("SAMEE:");
                    console.log(sameQuestion);
                  }
                }
                console.log(resultQuestions);
              }}
            >
              Update draft
            </Button>
            <Button
              theme="secondary"
              {...{ type: "button" }}
              onClick={() => {
                if (!post?.id) {
                  toast.error(t("toast.error"));
                  return;
                }
                publishPost({ postid: post?.id });
              }}
            >
              Publish
            </Button>
          </div>
        )}
      </form>
    </>
  );
};

export default TabOptions;
