import axios, { AxiosError } from "axios";
import { QueryFunction, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { config } from "../utils/constants";
import { handleApiError } from "./handleApiErrors";
import useTokenStore from "./useTokenStore";
import useUserProfileStore from "./useUserProfileStore";

const getProfile: QueryFunction = async ({ queryKey }) => {
  const r = await axios.get(`${config.adminApiBaseUrl}${queryKey[0]}`, {
    headers: {
      Authorization: `Bearer ${queryKey[1]}`,
    },
  });
  return r.data;
};

const useMeQuery = () => {
  const history = useHistory();
  const token = useTokenStore((state) => state.accessToken);
  const setUser = useUserProfileStore((state) => state.setUser);
  const setUserPermissions = useUserProfileStore(
    (state) => state.setUserPermssions
  );

  const me = useQuery(["profile", token], getProfile, {
    onSuccess: (data: any) => {
      setUser(data.user);
      setUserPermissions(data?.permissions);
    },
    onError: (error: AxiosError) => {
      if (!token) history.push("/login");
      handleApiError(error, history);
    },
  });

  return me;
};

export default useMeQuery;
