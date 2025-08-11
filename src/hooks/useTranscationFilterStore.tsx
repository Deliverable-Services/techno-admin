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

const useTransactionStoreFilter = create(
  persist(
    combine({ filter: INITIAL_FILTER }, (set) => ({
      onFilterChange: (idx: string, value: any) =>
        set((state) => ({ ...state, filter: { ...state.filter, [idx]: value } })),
      resetFilter: () => set((state) => ({ filter: INITIAL_FILTER })),
    })),
    { name: LocalStorageKey + "transaction_filter" }
  )
);

export default useTransactionStoreFilter;
