import { QueryClient, QueryFunction } from "react-query";
import API from "./API";
import { showErrorToast } from "./showErrorToast";

export const defaultQueryFn: QueryFunction = async ({ queryKey }) => {
  console.log({ queryKey });
  const params = {};
  //@ts-ignore
  for (let k in queryKey[2]) {
    if (queryKey[2][k]) params[k] = queryKey[2][k];
  }

  console.log({ params });

  const r = await API.get<any>(`${queryKey[0]}`, {
    params,
  });

  if (r.status !== 200) {
    showErrorToast(r.status.toString());
    queryClient.invalidateQueries("profile");
    throw new Error();
  }

  return await r.data;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000 * 5,
      queryFn: defaultQueryFn,
      onError: (error: any) => {
        showErrorToast(error.message);
        queryClient.invalidateQueries("profile");
      },
      keepPreviousData: true,
      retry: false,
    },
  },
});
