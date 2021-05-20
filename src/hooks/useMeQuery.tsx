import axios from 'axios'
import { QueryFunction, useQuery } from 'react-query'
import { useHistory } from "react-router-dom"
import { appApiBaseUrl } from '../utils/constants'
import useTokenStore from './useTokenStore'
import useUserProfileStore from './useUserProfileStore'


const getProfile: QueryFunction = async ({ queryKey }) => {

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
        }
    })


    return me
}

export default useMeQuery
