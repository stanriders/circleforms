import { useMutation } from "react-query";
import { InferType } from "yup";

import { ImageQuery, PostContract } from "../../../openapi";
import { apiClient } from "../../utils/apiClient";

import { answerSchema } from "./TabOptions.utils";

export const useSubmitPost = () => {
  const mutatation = useMutation((validatedData: InferType<typeof answerSchema>) => {
    return apiClient.posts.postsPost({
      postContract: validatedData as PostContract
    });
  });

  return mutatation;
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
  return useMutation(({ postid }: { postid: string }) =>
    apiClient.posts.postsIdPublishPost({ id: postid })
  );
};

export const usePatchPost = () => {
  return useMutation(({ postid, data }: { postid: string; data: PostContract }) =>
    apiClient.posts.postsIdPut({ id: postid, postContract: data })
  );
};
