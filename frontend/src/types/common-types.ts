import { components } from "../types/generated-schema";
import { Osu } from "./osu-user";
import LOCALES from "../libs/i18n";

export type Locales = keyof typeof LOCALES;
export type PostResponse = components["schemas"]["PostResponseContract"];
export type PostRequest = components["schemas"]["PostRequestContract"];
export type PinnedPosts = components["schemas"]["PageResponseContract"];
export type PostFilter = components["schemas"]["PostFilter"] | null;

type UserResponseContract = components["schemas"]["UserResponseContract"];
export interface UserResponse extends UserResponseContract {
  osu?: Osu;
}

export type User = components["schemas"]["UserMinimalResponseContract"];
