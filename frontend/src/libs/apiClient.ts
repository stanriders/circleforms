import { Configuration, OAuthApi, PagesApi, PostsApi, UsersApi } from "../../openapi";

const configuration = new Configuration({
  basePath: "http://localhost/api",
  credentials: "include",

});

const posts = new PostsApi(configuration);
const oauth = new OAuthApi(configuration);
const pages = new PagesApi(configuration);
const users = new UsersApi(configuration);

export const apiClient = {
  posts,
  oauth,
  pages,
  users
};
