import { Configuration, PagesApi, PostsApi, UsersApi } from "../../openapi";

export const getApiClient = (cookie?: string | undefined) => {
  const isDev = process.env.NODE_ENV === "development";
  const configuration = new Configuration({
    basePath: isDev ? "http://localhost/api" : "https://circleforms.net/api",
    credentials: "include",
    headers: {
      Cookie: cookie || ""
    }
  });
  const posts = new PostsApi(configuration);
  const pages = new PagesApi(configuration);
  const users = new UsersApi(configuration);

  const apiClient = {
    posts,
    pages,
    users
  };

  return apiClient;
};
