import axios, { AxiosError } from 'axios'
import { useState } from 'react'
import { QueryFunction, useQuery } from 'react-query'
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
    const token = useTokenStore(state => state.accessToken)
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
