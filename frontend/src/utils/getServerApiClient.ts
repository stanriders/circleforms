import { Configuration, OAuthApi, PagesApi, PostsApi, UsersApi } from "../../openapi";

export const getServerApiClient = (cookie: string | undefined) => {
  const configuration = new Configuration({
    basePath: "http://localhost/api",
    credentials: "include",
    headers: {
      Cookie: cookie || ""
    }
  });
  const posts = new PostsApi(configuration);
  const oauth = new OAuthApi(configuration);
  const pages = new PagesApi(configuration);
  const users = new UsersApi(configuration);

  const apiClient = {
    posts,
    oauth,
    pages,
    users
  };

  return apiClient;
};
