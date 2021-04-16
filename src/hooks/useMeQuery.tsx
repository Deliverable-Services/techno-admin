import axios from 'axios'
import { QueryFunction, useQuery } from 'react-query'
import { appApiBaseUrl } from '../utils/constants'
import useTokenStore from './useTokenStore'


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

    const me = useQuery(["profile", token], getProfile)

    return me
}

export default useMeQuery
