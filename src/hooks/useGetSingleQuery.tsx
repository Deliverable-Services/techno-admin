import { QueryFunction, useQuery } from 'react-query'
import API from '../utils/API'


interface IUseGetSingle {
    key: string,
    id: string
}
const getSingle = async (key: any, id: any) => {
    const r = await API.get(`${key}/${id}`)


    return r.data

}

const useGetSingleQuery = ({ id, key }: IUseGetSingle) => {

    const allData = useQuery<any>([key], () => getSingle(key, id), {
        enabled: !!id,
    })

    return allData
}

export default useGetSingleQuery
