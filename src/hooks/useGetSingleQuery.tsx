import { QueryFunction, useQuery } from 'react-query'
import API from '../utils/API'


interface IUseGetSingle {
    key: string,
    id: string
}
const getSingle: QueryFunction = async ({ queryKey }) => {

    const r = await API.get(`${queryKey[0]}`)


    return r.data

}

const useGetSingleQuery = ({ id, key }: IUseGetSingle) => {

    const allData = useQuery(`${key}/${id}`, getSingle)

    return allData
}

export default useGetSingleQuery
