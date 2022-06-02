import React from "react";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { DatePicker } from "@mantine/dates";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { Accessibility, Gamemode, PostContract, PostWithQuestionsContract } from "../../../openapi";
import { sleep } from "../../utils/misc";
import Button from "../Button";
import DropdownSelect from "../DropdownSelect";
import ErrorMessage from "../ErrorMessage";
import { useFormData } from "../FormContext";

import { usePatchPost, usePublishPost, useSubmitImage, useSubmitPost } from "./TabOptions.hooks";
import { ACCESSABILITY_OPTIONS, answerSchema, GAMEMODE_OPTIONS } from "./TabOptions.utils";

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
  const { mutate: postPUT } = usePatchPost();

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

  const handleFormSubmit = async () => {
    const validatedData = await getValidatedData();
    if (!validatedData) return;

    const submitData = await submitPost(validatedData);
    if (submitData?.id) {
      if (data.icon) mutateImage({ postid: submitData.id, file: data.icon, isIcon: true });
      if (data.banner) mutateImage({ postid: submitData.id, file: data.banner, isIcon: false });
    }
    router.push("/dashboard");
  };

  const handleUpdate = async () => {
    if (!post) return;
    let validatedData = await getValidatedData();
    if (!validatedData) return;
    postPUT({ postid: data.id as string, data: validatedData as PostContract });
    if (data.icon) mutateImage({ postid: data.id, file: data.icon, isIcon: true });
    if (data.banner) mutateImage({ postid: data.id, file: data.banner, isIcon: false });
    sleep(600);
    router.push("/dashboard");
  };

  const handlePublish = () => {
    if (!post?.id) {
      toast.error(t("toast.error"));
      return;
    }
    publishPost({ postid: post?.id });
  };

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
            <Button {...{ type: "button" }} onClick={handleUpdate}>
              Update draft
            </Button>
            <Button theme="secondary" {...{ type: "button" }} onClick={handlePublish}>
              Publish
            </Button>
          </div>
        )}
      </form>
    </>
  );
};

export default TabOptions;
