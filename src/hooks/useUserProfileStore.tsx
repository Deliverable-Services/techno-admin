import create from 'zustand'
import { persist, combine } from 'zustand/middleware'
import { User } from '../types/interface'



let store = combine(
    { user: null as User | null },
    (set) => ({
        setUser: (user: any) => set((state) => ({ user: user })),
        removeUser: () => set((state) => ({ user: null })),
    })
)

store = persist(store, { name: "user" })

const useUserProfileStore = create(store)

export default useUserProfileStore;