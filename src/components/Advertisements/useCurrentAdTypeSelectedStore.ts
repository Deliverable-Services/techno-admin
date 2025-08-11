import { create } from "zustand";
import { combine } from "zustand/middleware";
import { AdType, types } from "./AdvertisementTypes";

let store = combine({ type: types[0] as AdType }, (set) => ({
  setCurrentType: (type: AdType) => set((state) => ({ type })),
}));

const useCurrentAdTypeSelectedStore = create(store);

export default useCurrentAdTypeSelectedStore;
