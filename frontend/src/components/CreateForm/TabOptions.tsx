import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import Switch from "react-switch";
import { DatePicker } from "@mantine/dates";
import { useModals } from "@mantine/modals";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { apiClient } from "src/utils/apiClient";
import { debounce } from "ts-debounce";

import { Accessibility, Gamemode, PostContractRequest } from "../../../openapi";
import { AsyncReturnType, sleep } from "../../utils/misc";
import Button from "../Button";
import DropdownSelect from "../DropdownSelect";
import ErrorMessage from "../ErrorMessage";
import { useFormData } from "../FormContext";

import OptionTabEntry from "./OptionTabEntry";
import { usePatchPost, usePublishPost, useSubmitImage, useSubmitPost } from "./TabOptions.hooks";
import { ACCESSABILITY_OPTIONS, answerSchema, GAMEMODE_OPTIONS } from "./TabOptions.utils";

interface ITabOptions {
  post?: AsyncReturnType<typeof apiClient.posts.postsIdGet>["post"];
  isEdit?: boolean;
}

const TabOptions = ({ post, isEdit }: ITabOptions) => {
  const t = useTranslations();
  const router = useRouter();
  const modals = useModals();
  const { data, setValues } = useFormData();
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: submitPost } = useSubmitPost();
  const { mutateAsync: mutateImage } = useSubmitImage();
  const { mutateAsync: publishPost } = usePublishPost();
  const { mutateAsync: postPUT } = usePatchPost();

  // init form state (if editing)

  const defaultValues = {
    accessibility: post?.accessibility || Accessibility.Public,
    gamemode: post?.gamemode || Gamemode.None,
    active_to: post?.active_to,
    allow_answer_edit: post?.allow_answer_edit || false
  };
  const methods = useForm({
    defaultValues,
    mode: "onBlur"
  });

  const getValidatedData = async () => {
    const resObj = {
      ...data,
      questions: data?.questions?.questions,
      allow_answer_edit: methods.getValues().allow_answer_edit
    };
    let validatedData;

    // show error to user
    try {
      validatedData = await answerSchema.validate(resObj);
      return validatedData;
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message || "Something went wrong");
      }
      return;
    }
  };

  const handleSubmit = async () => {
    const validatedData = await getValidatedData();
    if (!validatedData) return;

    setIsLoading(true);

    await submitPost(validatedData, {
      onSuccess: async (submitData) => {
        toast.success(t("toast.success"));
        if (data.icon) {
          try {
            await mutateImage({ postid: submitData.id!, file: data.icon, isIcon: true });
          } catch (err) {
            toast.error("There was an error uploading your icon image");
            await sleep(500);
          }
        }
        if (data.banner) {
          try {
            await mutateImage({ postid: submitData.id!, file: data.banner, isIcon: false });
          } catch (err) {
            toast.error("There was an error uploading your banner image");
            await sleep(500);
          }
        }
        await sleep(600);
        router.push("/dashboard");
      },

      onSettled: () => {
        setIsLoading(false);
      }
    });
  };

  const handleUpdate = async () => {
    if (!post) return false;
    let validatedData = await getValidatedData();
    if (!validatedData) return false;

    await postPUT(
      { postid: data.id as string, data: validatedData as PostContractRequest },
      {
        onSuccess: async () => {
          if (typeof data.icon !== "string") {
            try {
              await mutateImage({ postid: data.id, file: data.icon, isIcon: true });
            } catch (err) {
              toast.error("There was an error uploading your icon image");
              await sleep(500);
            }
          }
          if (typeof data.banner !== "string") {
            try {
              await mutateImage({ postid: data.id, file: data.banner, isIcon: false });
            } catch (err) {
              toast.error("There was an error uploading your banner image");
              await sleep(500);
            }
          }
          toast.success("Update successful");
        },
        onError: (err) => {
          console.error(err);
          toast.error("There was an error updating your post");
        }
      }
    );

    return true;
  };

  const handlePublish = async () => {
    if (!post?.id) {
      toast.error(t("toast.error"));

      return;
    }

    const didUpdate = await handleUpdate();
    if (!didUpdate) {
      return;
    }

    await publishPost(
      { postid: post?.id },
      {
        onSuccess: async () => {
          toast.success("Post published");
          await sleep(600);
          router.push("/dashboard");
        },
        onError: async () => {
          toast.success("Failed to publish the post");
        }
      }
    );
  };

  const debouncedHandlePublish = debounce(handlePublish, 500);

  const confirmPublishModal = () =>
    modals.openContextModal("publish", {
      centered: true,
      title: "Please confirm your action",
      innerProps: {
        modalBody: "You will not be able to edit the post after publishing it.",
        onConfirm: debouncedHandlePublish,
        confirmLabel: "Publish"
      },
      styles: {
        modal: {
          borderRadius: "55px",
          display: "flex",
          flexDirection: "column",
          flexBasis: " 750px"
        },
        header: {
          paddingTop: "22px",
          paddingLeft: "22px"
        },
        title: {
          fontSize: "2rem"
        },

        body: {
          padding: "22px",
          paddingTop: "0px"
        },
        close: {
          display: "none"
        }
      }
    });

  return (
    <div className="flex flex-col gap-6">
      <Toaster />

      <form
        className="flex relative flex-col gap-y-16 p-9 py-14 text-clip bg-black-lighter rounded-35"
        onSubmit={methods.handleSubmit(handleSubmit)}
      >
        <h2 className="-my-8 text-4xl font-bold ">Settings</h2>
        <hr className="border-t-2 border-t-grey-border" />
        <OptionTabEntry mainHeading="Form Privacy Level" subText="Manage who sees the form">
          <Controller
            name={`accessibility`}
            control={methods.control}
            rules={{ required: "True" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <DropdownSelect
                  aria-label="Select post accessibility"
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
        </OptionTabEntry>

        <OptionTabEntry
          mainHeading="Select Game Mode"
          subText="Leave it as None if it applies to all game modes"
        >
          <Controller
            name={`gamemode`}
            control={methods.control}
            rules={{ required: "Game mode is required" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <DropdownSelect
                  aria-label="Select game mode"
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
        </OptionTabEntry>

        <OptionTabEntry
          mainHeading="Select end date"
          subText=" No new submissions can be made afterwards"
        >
          <Controller
            name={`active_to`}
            control={methods.control}
            rules={{ required: "Please pick post end date" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <DatePicker
                  locale="en"
                  placeholder="Pick a date"
                  required
                  {...field}
                  onBlur={() => setValues({ active_to: field.value })}
                  radius={"lg"}
                  size={"md"}
                  styles={{
                    root: { maxWidth: "fit-content" },
                    input: { backgroundColor: "#1a1a1a", fontSize: "1.5rem", width: "fit-content" }
                  }}
                />
                <ErrorMessage text={error?.message} />
              </div>
            )}
          />
        </OptionTabEntry>

        <OptionTabEntry mainHeading="Answer editing" subText="Allow users to edit their answers">
          <Controller
            name={`allow_answer_edit`}
            control={methods.control}
            render={({ field }) => (
              <Switch
                onChange={field.onChange}
                checked={field.value || false}
                offColor="#0c0c0c"
                onColor="#0c0c0c"
                onHandleColor="#FF66AA"
                handleDiameter={26}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={32}
                width={58}
              />
            )}
          />
        </OptionTabEntry>

        {!isEdit && (
          <Button classname="w-fit self-center" {...{ type: "submit", disabled: isLoading }}>
            Create draft
          </Button>
        )}
        <div className="flex flex-row justify-between">
          {isEdit && (
            <Button
              classname="w-fit"
              {...{ type: "button", disabled: isLoading }}
              onClick={async () => {
                const didUpdate = await handleUpdate();
                if (!didUpdate) return;
                sleep(650);
                router.push(`/dashboard/${post?.id || ""}`);
              }}
            >
              Update draft
            </Button>
          )}
          {isEdit && (
            <Button
              classname="w-fit"
              theme="secondary"
              {...{ type: "button", disabled: isLoading }}
              onClick={confirmPublishModal}
            >
              Publish
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TabOptions;
