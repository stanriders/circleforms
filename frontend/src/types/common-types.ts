import { components } from "../types/generated-schema";
import { Osu } from "./osu-user";

export type PostResponse = components["schemas"]["PostResponseContract"];

type UserResponseContract = components["schemas"]["UserResponseContract"];
export interface UserResponse extends UserResponseContract {
  osu?: Osu;
}

export type MinimalUserResponse = components["schemas"]["UserMinimalResponseContract"];
