import axios, { AxiosError } from "axios";
import { QueryFunction, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { config } from "../utils/constants";
import { handleApiError } from "./handleApiErrors";
import useTokenStore from "./useTokenStore";
import useUserProfileStore from "./useUserProfileStore";

const getProfile: QueryFunction = async ({ queryKey }) => {
  if (queryKey[1]) {
    const r = await axios.get(`${config.adminApiBaseUrl}${queryKey[0]}`, {
      headers: {
        Authorization: `Bearer ${queryKey[1]}`,
      },
    });
    return r.data;
  }
};

const useMeQuery = () => {
  const token = useTokenStore((state) => state.accessToken);
  const setUser = useUserProfileStore((state) => state.setUser);
  const setUserPermissions = useUserProfileStore(
    (state) => state.setUserPermssions
  );

  const me = useQuery(["profile", token], getProfile, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!token, // Only run if token exists
    onSuccess: (data: any) => {
      setUser(data?.user);
      setUserPermissions(data?.permissions);
    },
    onError: (error: AxiosError) => {
      console.error("Profile fetch error:", error);
      // Error handling is now managed by useAuthManager interceptors
    },
  });

  return me;
};

export default useMeQuery;
