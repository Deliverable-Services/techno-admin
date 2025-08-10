import { create } from "zustand";
import { combine } from "zustand/middleware";
// Simple UUID replacement
const generateId = () => Math.random().toString(36).substr(2, 9);
// import { ToastDurations } from "../../ui/ErrorToast";

type Toast = {
  id: string;

  //   duration?: ToastDurations;
  message: string;
};

export const useErrorToastStore = create(
  combine(
    {
      toasts: [] as Toast[],
    },
    (set) => ({
      hideToast: (id: string) =>
        set((x) => ({ toasts: x.toasts.filter((y) => y.id !== id) })),
      showToast: (t: Omit<Toast, "id">) =>
        set((x) => ({ toasts: [...x.toasts, { ...t, id: generateId() }] })),
    })
  )
);
