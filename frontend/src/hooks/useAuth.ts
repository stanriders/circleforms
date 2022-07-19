import { useQuery } from "react-query";

import { apiClient } from "../utils/apiClient";

export default function useAuth() {
  return useQuery("meGet", () => apiClient.users.meGet(), {
    staleTime: Infinity,
    retry: process.env.NODE_ENV === "production",
    refetchOnWindowFocus: process.env.NODE_ENV === "production"
  });
}
