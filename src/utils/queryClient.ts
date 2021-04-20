import axios from "axios";
import { QueryClient, QueryFunction } from "react-query";
import { adminApiBaseUrl } from "./constants";
import { showErrorToast } from "./showErrorToast";

export const defaultQueryFn: QueryFunction = async ({ queryKey }) => {




    const r = await axios.get(`${adminApiBaseUrl}${queryKey[0]}?page=${queryKey[1]}`);

    if (r.status !== 200) {
        console.log("status", r.status)
        throw new Error();
    }


    return await r.data;
};

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {

            // refetchOnWindowFocus: "always",
            staleTime: 60 * 1000 * 5,
            queryFn: defaultQueryFn,
            onError: (error) => {
                showErrorToast((error as Error).message)
            },
            keepPreviousData: true
        },
    },
});