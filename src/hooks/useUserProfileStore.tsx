import { create } from "zustand";
import { persist, combine } from "zustand/middleware";
import { User } from "../types/interface";

let store = combine(
  { user: null as User | null, permissions: [] },
  (set, get) => ({
    setUser: (user: any) => set((state) => ({ ...state, user })),
    setUserPermssions: (permissions: any) =>
      set((state) => ({ ...state, permissions })),
    removeUser: () => set((state) => ({ user: null })),
    isRestricted: (permission) => {
      let bool;

      if (permission && permission.length > 0) {
        bool = get().permissions.includes(permission);
      } else bool = false;
      return !bool;
    },
  })
);

store = persist(store, { name: "user" });

const useUserProfileStore = create(store);

export default useUserProfileStore;
