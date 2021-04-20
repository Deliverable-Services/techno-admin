import axios from 'axios'
import { QueryFunction, useQuery } from 'react-query'
import { adminApiBaseUrl } from '../utils/constants'


interface IUseGetSingle {
    key: string,
    id: string
}
const getSingle: QueryFunction = async ({ queryKey }) => {
    if (!queryKey[1])
        return

    const r = await axios.get(`${adminApiBaseUrl}${queryKey[0]}/${queryKey[1]}`)


    return r.data

}

const useGetSingleQuery = ({ id, key }: IUseGetSingle) => {

    const allData = useQuery([key, id], getSingle, {

    })

    return allData
}

export default useGetSingleQuery
