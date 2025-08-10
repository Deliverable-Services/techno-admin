import { create } from "zustand";
import { persist, combine } from "zustand/middleware";

type Token = string | null;

let store = combine({ accessToken: null as Token }, (set) => ({
  setToken: (token: string) => set((state) => ({ accessToken: token })),
  removeToken: () => set((state) => ({ accessToken: null })),
}));

store = persist(store, { name: "accessToken" });

const useTokenStore = create(store);

export default useTokenStore;
