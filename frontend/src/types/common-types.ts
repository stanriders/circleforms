import { components } from "../types/generated-schema";

import LOCALES from "../libs/i18n";

export type Locales = keyof typeof LOCALES;

export type PostsId = components["schemas"]["PostWithQuestionsContract"];

export type Answers = components["schemas"]["AnswerContract"][] | null | undefined;

export type PostsIdAnswers = components["schemas"]["AnswersUsersContract"];

export type PostRequest = components["schemas"]["PostContract"];

export type PostsPage = components["schemas"]["PageContract"];

export type PostFilter = components["schemas"]["PostFilter"] | null;

export type UserMe = components["schemas"]["UserContract"];

export type UserInAnswer = components["schemas"]["UserInAnswerContract"];

export type User = components["schemas"]["UserMinimalContract"];
