import axios from 'axios'
import { QueryFunction, useQuery } from 'react-query'
import { appApiBaseUrl } from '../utils/constants'
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
    const token = useTokenStore(state => state.accessToken)
    const setUser = useUserProfileStore(state => state.setUser)

    const removeToken = useTokenStore(state => state.removeToken)
    const removeUser = useUserProfileStore(state => state.removeUser)
    const me = useQuery(["profile", token], getProfile, {
        onSuccess: (data: any) => {
            setUser(data)
        },
        onError: () => {
            removeToken()
            removeUser()
        }
    })

    return me
}

export default useMeQuery
