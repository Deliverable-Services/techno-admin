import axios, { AxiosError } from "axios";
import { QueryFunction, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import API from "../utils/API";
import { adminApiBaseUrl, appApiBaseUrl } from "../utils/constants";
import { handleApiError } from "./handleApiErrors";
import useTokenStore from "./useTokenStore";
import useUserProfileStore from "./useUserProfileStore";

const getProfile: QueryFunction = async ({ queryKey }) => {
  const r = await axios.get(`${adminApiBaseUrl}${queryKey[0]}`, {
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

  const me = useQuery(["profile", token], getProfile, {
    onSuccess: (data: any) => {
      const roles = {
        role: "admin",
        permissions: [
          "update_brand",
          "create_brand",
          "delete_brand",
          "read_brand",
        ],
      };
      setUser({ ...data, roles });
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  return me;
};

export default useMeQuery;
