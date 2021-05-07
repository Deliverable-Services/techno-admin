import axios, { AxiosError } from 'axios'
import { QueryFunction, useQuery } from 'react-query'
import { useHistory } from "react-router-dom"
import API from '../utils/API'
import { appApiBaseUrl } from '../utils/constants'
import { queryClient } from '../utils/queryClient'
import { showErrorToast } from '../utils/showErrorToast'
import useTokenStore from './useTokenStore'
import useUserProfileStore from './useUserProfileStore'


const getProfile: QueryFunction = async ({ queryKey }) => {
    if (!queryKey[1])
        return false

    const r = await axios.get(`${appApiBaseUrl}${queryKey[0]}`, {
        headers: {
            Authorization: `Bearer ${queryKey[1]}`
        }
    })
    return r.data

}


const useMeQuery = () => {
    const history = useHistory()
    const token = useTokenStore(state => state.accessToken)
    const setToken = useTokenStore(state => state.setToken)
    const removeToken = useTokenStore(state => state.removeToken)
    const setUser = useUserProfileStore(state => state.setUser)


    const me = useQuery(["profile", token], getProfile, {
        retry: false,
        onSuccess: (data: any) => {
            setUser(data)
        },
        onError: async (err: AxiosError | Error) => {
            if (axios.isAxiosError(err)) {
                const { response } = err;

                if (response?.status === 401) {
                    try {
                        const res = await API.post('/auth/refresh');
                        const data = await res.data;
                        if (data) {
                            setToken(data.access_token)
                            queryClient.invalidateQueries("profile")
                        }
                    } catch (error) {
                        history.push('./login')
                        showErrorToast(error.message)
                    }

                } else {
                    history.push('/login')
                }

            } else {
                history.push("./login")
            }
        }
    })


    return me
}

export default useMeQuery
