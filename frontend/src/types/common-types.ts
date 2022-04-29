import { components } from "../types/generated-schema";
import { Osu } from "./osu-user";
import LOCALES from "../libs/i18n";

export type Locales = keyof typeof LOCALES;
export type PostResponse = components["schemas"]["FullPostContract"];
export type PostRequest = components["schemas"]["PostContract"];
export type PinnedPosts = components["schemas"]["PageContract"];
export type PostFilter = components["schemas"]["PostFilter"] | null;

type UserResponseContract = components["schemas"]["UserContract"];
export interface UserResponse extends UserResponseContract {
  osu?: Osu;
}

export type User = components["schemas"]["UserMinimalContract"];
