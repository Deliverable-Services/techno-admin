import { useState } from 'react'

type CurrentStatus = "default" | "editing" | "creating";
interface IUseToggle {
    status: CurrentStatus
    setStatusDefault: () => void;
    setStatusEdit: () => void;
    setStatusCreate: () => void
}

const useToggle = (): IUseToggle => {


    const [status, setStatus] = useState<CurrentStatus>("default")

    const setStatusDefault = () => setStatus("default")
    const setStatusCreate = () => setStatus("creating")
    const setStatusEdit = () => setStatus("editing")



    return {
        status,
        setStatusDefault, setStatusCreate, setStatusEdit

    }
}

export default useToggle;
