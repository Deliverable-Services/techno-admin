import { QueryClient, QueryFunction } from "react-query";
import API from "./API";
import { showErrorToast } from "./showErrorToast";

export const defaultQueryFn: QueryFunction = async ({ queryKey }) => {




    const r = await API.get<any>(`${queryKey[0]}?page=${queryKey[1]}`);

    if (r.status !== 200) {
        showErrorToast(r.status.toString())
        queryClient.invalidateQueries("profile")
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
            onError: (error: any) => {
                showErrorToast(error.message)
                queryClient.invalidateQueries("profile")
            },
            keepPreviousData: true
        },
    },
});
