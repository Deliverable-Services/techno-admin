import { useErrorToastStore } from "../shared-components/ErrorToast/useErrorToastStore";


export const showErrorToast = (m: string) => {
    useErrorToastStore.getState().showToast({ message: m });
};