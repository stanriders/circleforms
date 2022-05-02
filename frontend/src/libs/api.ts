import { POSTS_PAGE } from "../mocks/posts-page";
import { POSTS_PAGE_PINNED } from "../mocks/posts-page-pinned";
import { PostsId, User, UserMe } from "../types/common-types";

export default async function api(endpoint: string, options?: RequestInit) {
  if (process.env.NODE_ENV === "development") {
    const mocks = await import("../mocks");
    await sleep(350);

    if (endpoint.includes("/posts/page/pinned")) {
      return POSTS_PAGE_PINNED;
    }

    if (endpoint.includes("/posts/page")) {
      return POSTS_PAGE;
    }

    if (endpoint.includes("/posts/")) {
      return mocks.form as PostsId;
    }

    if (endpoint.includes("/minimal")) {
      return mocks.userMinimal as User;
    }

    if (endpoint === "/me/posts") {
      return mocks.mePosts as PostsId[];
    }

    if (endpoint === "/me") {
      return mocks.me as UserMe;
    }
  }

  const response = await fetch(`https://circleforms.net/api${endpoint}`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    ...options
  });

  if (response.status === 204) {
    return null;
  }

  const responseData = await response.json();

  if (response.ok) {
    return responseData;
  }

  throw responseData;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
