import { create } from "zustand";
import { persist, combine } from "zustand/middleware";
import { User } from "../types/interface";

const useUserProfileStore = create(
  persist(
    combine(
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
    ),
    { name: "user" }
  )
);

export default useUserProfileStore;
