import { create } from "zustand";
import { persist, combine } from "zustand/middleware";

type Token = string | null;

const useTokenStore = create(
  persist(
    combine({ accessToken: null as Token }, (set) => ({
      setToken: (token: string) => set((state) => ({ accessToken: token })),
      removeToken: () => set((state) => ({ accessToken: null })),
    })),
    { name: "accessToken" }
  )
);

export default useTokenStore;
