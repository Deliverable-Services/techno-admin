import { useMsgToastStore } from "../shared-components/MsgToast/useMsgToastStore";


export const showMsgToast = (m: string) => {
    useMsgToastStore.getState().showToast({ message: m });
};