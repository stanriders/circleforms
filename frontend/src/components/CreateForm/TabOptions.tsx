import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Select } from "@mantine/core";
import { DatePicker } from "@mantine/dates";

import { Accessibility, Gamemode, ImageQuery } from "../../../openapi";
import { apiClient } from "../../libs/apiClient";
import Button from "../Button";
import ErrorMessage from "../ErrorMessage";
import { useFormData } from "../FormContext";

const ACCESSABILITY_OPTIONS = Object.values(Accessibility);
const GAMEMODE_OPTIONS = Object.values(Gamemode);

const TabOptions = ({
  defaultValues = { accessibility: "Public", gamemmode: "None", activeTo: null }
}) => {
  // const t = useTranslations();
  const { data, setValues } = useFormData();

  const methods = useForm({
    defaultValues,
    mode: "onBlur"
  });

  async function handleFormSubmit() {
    let resObj = { ...data };

    // format data for backend:
    // question are in format {"value" : "question text"} and we need to flatten them first
    const formattedQuestions = data?.questions?.questions
      ?.map((val: Record<"questionInfo", Array<{ value: string }>>) => {
        const flattenedQuestions = val.questionInfo.map((obj) => obj.value);
        return {
          ...val,
          questionInfo: flattenedQuestions.length > 0 ? flattenedQuestions : null
        };
      })
      // filter if there is no title
      ?.filter((obj: Record<"title", string>) => Boolean(obj.title));

    resObj.questions = formattedQuestions;

    const submittedData = await apiClient.posts.postsPost({ postContract: resObj });
    if (submittedData.id) {
      await submitIcon({ postid: submittedData.id, icon: data?.icon });
      await submitBanner({ postid: submittedData.id, banner: data?.banner });
    }
  }
  async function submitIcon({ postid, icon }: { postid: string; icon: File }) {
    if (icon) {
      await apiClient.posts.postsIdFilesPut({
        id: postid,
        query: ImageQuery.Icon,
        image: icon
      });
    }
  }
  async function submitBanner({ postid, banner }: { postid: string; banner: File }) {
    if (banner) {
      await apiClient.posts.postsIdFilesPut({
        id: postid,
        query: ImageQuery.Banner,
        image: banner
      });
    }
  }

  return (
    <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="flex flex-col gap-6">
      <Controller
        name={`accessibility`}
        control={methods.control}
        rules={{ required: "True" }}
        render={({ field, fieldState: { error } }) => (
          <div>
            <Select
              aria-label="Select post accessibility"
              label="Accessibility"
              required={true}
              {...field}
              onBlur={() => setValues({ accessibility: field.value })}
              data={ACCESSABILITY_OPTIONS.map((type) => ({
                value: type,
                label: type
              }))}
              // https://mantine.dev/core/select/?t=styles
              radius={"lg"}
              size={"md"}
              styles={{
                dropdown: { backgroundColor: "black", color: "#eeeeee" },
                item: { backgroundColor: "black", color: "#eeeeee" },
                input: {
                  backgroundColor: "#1a1a1a",
                  color: "#eeeeee",
                  borderWidth: "2px",
                  fontWeight: "bold"
                },
                hovered: { backgroundColor: "#1672d4", color: "#eeeeee" },
                selected: { backgroundColor: "#1a1a1a", color: "#FF66AA" },
                root: { maxWidth: "fit-content" },
                label: { color: "#eeeeee" }
              }}
            />
            <ErrorMessage text={error?.message} />
          </div>
        )}
      />

      <Controller
        name={`gamemmode`}
        control={methods.control}
        rules={{ required: "Game mode is required" }}
        render={({ field, fieldState: { error } }) => (
          <div>
            <Select
              aria-label="Select game mode"
              label="Game mode"
              required={true}
              {...field}
              onBlur={() => setValues({ gamemmode: field.value })}
              data={GAMEMODE_OPTIONS.map((type) => ({
                value: type,
                label: type
              }))}
              // https://mantine.dev/core/select/?t=styles
              radius={"lg"}
              size={"md"}
              styles={{
                dropdown: { backgroundColor: "black", color: "#eeeeee" },
                item: { backgroundColor: "black", color: "#eeeeee" },
                input: {
                  backgroundColor: "#1a1a1a",
                  color: "#eeeeee",
                  borderWidth: "2px",
                  fontWeight: "bold"
                },
                hovered: { backgroundColor: "#1672d4", color: "#eeeeee" },
                selected: { backgroundColor: "#1a1a1a", color: "#FF66AA" },
                root: { maxWidth: "fit-content" },
                label: { color: "#eeeeee" }
              }}
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
                label: { color: "#eeeeee" },
                root: { maxWidth: "fit-content" },
                input: {
                  backgroundColor: "#1a1a1a",
                  color: "#eeeeee",
                  borderWidth: "2px",
                  fontWeight: "bold"
                }
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
  );
};

export default TabOptions;
