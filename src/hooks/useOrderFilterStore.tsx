import { create } from "zustand";
import { persist, combine } from "zustand/middleware";
import { LocalStorageKey } from "../utils/constants";

interface IFilter {
  status: string | null;
  user_id: string | null;
  agent_id: string | null;
  order_type: string | null;
}
export const INITIAL_FILTER: IFilter = {
  status: "",
  user_id: "",
  agent_id: "",
  order_type: "",
};

const useOrderStoreFilter = create(
  persist(
    combine({ filter: INITIAL_FILTER }, (set) => ({
      onFilterChange: (idx: string, value: any) =>
        set((state) => ({ ...state, filter: { ...state.filter, [idx]: value } })),
      resetFilter: () => set((state) => ({ filter: INITIAL_FILTER })),
    })),
    { name: LocalStorageKey + "order_filter" }
  )
);

export default useOrderStoreFilter;
