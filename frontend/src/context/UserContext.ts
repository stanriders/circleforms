import React from "react";

import { UserContract, UserInAnswerContract } from "../../openapi";

interface IUserContext {
  user: UserContract | null | UserInAnswerContract;
}

const UserContext = React.createContext({} as IUserContext);
UserContext.displayName = "UserContext";

export default UserContext;
