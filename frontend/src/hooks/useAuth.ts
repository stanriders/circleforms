import localforage from "localforage";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { UserContract } from "../../openapi";
import { apiClient } from "../utils/apiClient";

// user cache
const FIVE_MINUTES = 1000 * 60 * 5;

export default function useAuth() {
  const [user, setUser] = useState<UserContract | null>(null);
  const router = useRouter();

  // Get user at initial loading
  useEffect(() => {
    getInitialData();
  }, []);

  async function getInitialData() {
    // Get user data from localstorage if it's not expired
    let [user, userUpdatedAt] = await Promise.all([
      localforage.getItem("user"),
      localforage.getItem("user_updated_at")
    ]);
    // FIXME What if there is no data in localstorage?

    // @ts-ignore
    const difference = Date.now() - userUpdatedAt;

    if (user && difference <= FIVE_MINUTES) {
      // @ts-ignore
      return setUser(user);
    }

    // Get user data from the API
    try {
      const user = await apiClient.users.meGet();
      setUser(user);
      localforage.setItem("user", user);
      localforage.setItem("user_updated_at", Date.now());
    } catch (e) {
      console.error(e);
      setUser(null);
    }
  }

  async function invalidateUserCache() {
    await Promise.all([localforage.removeItem("user"), localforage.removeItem("user_updated_at")]);
    getInitialData();
  }

  async function logout() {
    await Promise.all([localforage.removeItem("user"), localforage.removeItem("user_updated_at")]);
    router.push("/api/OAuth/signout");
  }

  return {
    user,
    logout,
    invalidateUserCache
  };
}
