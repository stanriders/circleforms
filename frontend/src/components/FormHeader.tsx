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
    <div className="relative p-16 bg-black-dark2 rounded-b-70">
      <div className="flex absolute inset-x-16 top-0 justify-between items-start">
        <div className="flex gap-x-3 items-center">
          <div className="relative shrink-0 min-w-fit">
            <img
              className="object-cover w-20 h-20 rounded-full"
              src={iconImg}
              alt={`${post?.title} thumbnail`}
            />
            <img
              className="absolute right-0 bottom-0 w-10 h-10 rounded-full"
              src={authorUser?.osu?.avatar_url!}
              alt={`${authorUser?.osu?.username}'s avatar`}
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold">{post?.title}</h1>
            <p className="text-2xl text-white text-opacity-50">
              {post?.answer_count ?? post?.answer_count} {t("answersCount")}
            </p>
          </div>
        </div>
        <div className="p-4 pr-0 mt-[-6px]">
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
