import { AxiosError } from "axios"
import API from "../utils/API"
import useTokenStore from '../hooks/useTokenStore'
import { showErrorToast } from "../utils/showErrorToast";

export const handleApiError = async (error: AxiosError, history: any) => {


    if (!error) return;

    const is401Error = error?.response?.status == 401;

    if (!is401Error) {
        showErrorToast(error?.response?.data?.message || error.message);
        return
    }


    try {
        const { data } = await API.post('/auth/refresh')
        console.log("refresh-data", data)

        if (data) useTokenStore.getState().setToken(data.access_token)
    } catch (error) {
        history.push("/login");
        showErrorToast(error.message)
    }

}