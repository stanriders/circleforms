import React from "react";
import { UserContract } from "../../openapi";

interface IUserContext {
  user: UserContract | null;
}

const UserContext = React.createContext({} as IUserContext);
UserContext.displayName = "UserContext";

export default UserContext;
