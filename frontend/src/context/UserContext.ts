import React from "react";
import { apiClient } from "src/utils/apiClient";
import { AsyncReturnType } from "src/utils/misc";

interface IUserContext {
  // user: UserContract | null | UserInAnswerContract;
  user: AsyncReturnType<typeof apiClient.users.meGet> | null;
}

const UserContext = React.createContext({} as IUserContext);
UserContext.displayName = "UserContext";

export default UserContext;
