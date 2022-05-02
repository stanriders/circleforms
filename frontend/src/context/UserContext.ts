import React from "react";
import { OsuUser } from "../types/osu-user";

// I am not sure if the type should be UserResponse or OsuUser
interface IUserContext {
  user: OsuUser | null;
}

const UserContext = React.createContext({} as IUserContext);
UserContext.displayName = "UserContext";

export default UserContext;
