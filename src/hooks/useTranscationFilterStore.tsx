import { create } from "zustand";
import { persist, combine } from "zustand/middleware";
import { LocalStorageKey } from "../utils/constants";

interface IFilter {
  status: string | null;
  user_id: string | null;
  payment_method: string | null;
}
export const INITIAL_FILTER: IFilter = {
  status: "",
  user_id: "",
  payment_method: "",
};

let store = combine({ filter: INITIAL_FILTER }, (set) => ({
  onFilterChange: (idx: string, value: any) =>
    set((state) => ({ ...state, filter: { ...state.filter, [idx]: value } })),
  resetFilter: () => set((state) => ({ filter: INITIAL_FILTER })),
}));

store = persist(store, { name: LocalStorageKey + "transaction_filter" });

const useTransactionStoreFilter = create(store);

export default useTransactionStoreFilter;
