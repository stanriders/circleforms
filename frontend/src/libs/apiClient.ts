import { Configuration, OAuthApi, PagesApi, PostsApi, UsersApi } from "../../openapi";

const isDevelopment = process.env.NODE_ENV === "development";
let API_URL = `https://circleforms.net/api`;
if (isDevelopment) {
  API_URL = `http://localhost:3001/api`;
}

const configuration = new Configuration({
  basePath: API_URL,
  credentials: "include"
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
