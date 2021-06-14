import create from 'zustand'
import { persist, combine } from 'zustand/middleware'
import { LocalStorageKey } from '../utils/constants'

interface IFilter {
    status: string | null;
    user_id: string | null;
    agent_id: string | null;
    inside_cart: string | null;
    order_type: string | null;
}
const INITIAL_FILTER: IFilter = {
    status: "",
    user_id: "",
    agent_id: "",
    inside_cart: "",
    order_type: "",

}

let store = combine(
    { filter: INITIAL_FILTER, rows_per_page: "25" },
    (set) => ({
        onFilterChange: (idx: string, value: any) => set((state) => ({ ...state, filter: { ...state.filter, [idx]: value } })),
        onRowsChange: (idx: string, value: any) => set((state) => ({ ...state, rows_per_page: value })),
        resetFilter: () => set((state) => ({ filter: INITIAL_FILTER })),
    })
)

store = persist(store, { name: LocalStorageKey + "order_filter" })

const useOrderStoreFilter = create(store)

export default useOrderStoreFilter