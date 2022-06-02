import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { InferType } from "yup";

import { ImageQuery, PostContract } from "../../../openapi";
import { apiClient } from "../../utils/apiClient";
import { sleep } from "../../utils/misc";

import { answerSchema } from "./TabOptions.utils";

export const useSubmitPost = () => {
  const t = useTranslations();
  const router = useRouter();

  return useMutation(
    (validatedData: InferType<typeof answerSchema>) => {
      return apiClient.posts.postsPost({
        postContract: validatedData as PostContract
      });
    },
    {
      onSuccess: async () => {
        toast.success(t("toast.success"));
        await sleep(600);
        router.push("/dashboard");
      },
      onError: (err) => {
        if (err instanceof Error) {
          toast.error(err?.message);
        }
        toast.error(t("toast.error"));
      }
    }
  );
};

export const useSubmitImage = () => {
  return useMutation(
    ({ postid, file, isIcon }: { postid: string; file: File; isIcon: boolean }) => {
      return apiClient.posts.postsIdFilesPut({
        id: postid,
        query: isIcon ? ImageQuery.Icon : ImageQuery.Banner,
        image: file
      });
    }
  );
};

export const usePublishPost = () => {
  const t = useTranslations();
  const router = useRouter();
  return useMutation(
    ({ postid }: { postid: string }) => apiClient.posts.postsIdPublishPost({ id: postid }),
    {
      onSuccess: async () => {
        toast.success("Published!");
        await sleep(600);
        router.push("/dashboard");
      },
      onError: (err) => {
        if (err instanceof Error) {
          toast.error(err?.message);
        }
        toast.error(t("toast.error"));
      }
    }
  );
};

export const usePatchPost = () => {
  const t = useTranslations();
  return useMutation(
    ({ postid, data }: { postid: string; data: PostContract }) =>
      apiClient.posts.postsIdPut({ id: postid, postContract: data }),
    {
      onSuccess: async () => {
        toast.success("Form has been updated");
      },
      onError: (err) => {
        if (err instanceof Error) {
          toast.error(err?.message);
        }
        toast.error(t("toast.error"));
      }
    }
  );
};
