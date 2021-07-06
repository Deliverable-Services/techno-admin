import { AxiosError } from "axios";
import { QueryFunction, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import API from "../utils/API";
import { handleApiError } from "./handleApiErrors";

interface IUseGetSingle {
  key: string;
  id: string;
}
const getSingle: QueryFunction = async ({ queryKey }) => {
  const r = await API.get(`${queryKey[0]}/${queryKey[1]}`);

  return r.data;
};

const useGetSingleQuery = ({ id, key }: IUseGetSingle) => {
  const history = useHistory();
  const allData = useQuery<any>([key, id], getSingle, {
    enabled: !!id,
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  return allData;
};

export default useGetSingleQuery;
