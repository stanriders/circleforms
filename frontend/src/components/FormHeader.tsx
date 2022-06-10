import React from "react";
import { useTranslations } from "next-intl";
import { PostWithQuestionsContract, UserContract } from "openapi";

import Tag from "./Tag";

interface IFormHeader {
  post: PostWithQuestionsContract;
  authorUser: UserContract;
  iconImg: string;
}

const FormHeader = ({ iconImg, post, authorUser }: IFormHeader) => {
  const t = useTranslations();

  return (
    <div className="bg-black-dark2 p-16 relative rounded-b-70">
      <div className="absolute top-0 left-16 right-16 flex items-start justify-between">
        <div className="flex items-center gap-x-3">
          <div className="relative shrink-0 min-w-fit">
            <img
              className="h-20 w-20 rounded-full object-cover"
              src={iconImg}
              alt={`${post.title} thumbnail`}
            />
            <img
              className="h-10 w-10 rounded-full absolute bottom-0 right-0"
              src={authorUser?.osu?.avatar_url}
              alt={`${authorUser.osu?.username}'s avatar`}
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold">{post.title}</h1>
            <p className="text-white text-opacity-50 text-2xl">
              {post.answerCount ?? post.answerCount} {t("answersCount")}
            </p>
          </div>
        </div>
        <div className="p-4 pr-0 mt-[-6px]">
          <Tag
            label={post.isActive ? t("active") : t("inactive")}
            theme={post.isActive ? "success" : "stale"}
          />
        </div>
      </div>
    </div>
  );
};

export default FormHeader;
