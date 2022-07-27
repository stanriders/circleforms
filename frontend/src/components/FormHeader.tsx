import React from "react";
import { useTranslations } from "next-intl";
import { UserContract } from "openapi";
import { apiClient } from "src/utils/apiClient";
import { AsyncReturnType } from "src/utils/misc";

import Tag from "./Tag";

interface IFormHeader {
  post: AsyncReturnType<typeof apiClient.posts.postsIdGet>["post"];
  authorUser: UserContract;
  iconImg: string;
}

const FormHeader = ({ iconImg, post, authorUser }: IFormHeader) => {
  const t = useTranslations();

  return (
    <div className="relative rounded-b-70 bg-black-dark2 p-16">
      <div className="absolute inset-x-16 top-0 flex items-start justify-between">
        <div className="flex items-center gap-x-3">
          <div className="relative min-w-fit shrink-0">
            <img
              className="h-20 w-20 rounded-full object-cover"
              src={iconImg}
              alt={`${post?.title} thumbnail`}
            />
            <img
              className="absolute right-0 bottom-0 h-10 w-10 rounded-full"
              src={authorUser?.osu?.avatar_url!}
              alt={`${authorUser.osu?.username}'s avatar`}
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold">{post?.title}</h1>
            <p className="text-2xl text-white text-opacity-50">
              {post?.answer_count ?? post?.answer_count} {t("answersCount")}
            </p>
          </div>
        </div>
        <div className="mt-[-6px] p-4 pr-0">
          <Tag
            label={post?.is_active ? t("active") : t("inactive")}
            theme={post?.is_active ? "success" : "stale"}
          />
        </div>
      </div>
    </div>
  );
};

export default FormHeader;
