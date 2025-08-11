import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/modal";

interface CommonModalProps {
  title: string;
  modalShow: boolean;
  onModalHideClick: () => void;
  children: JSX.Element;
}

export const CommonModal = ({
  modalShow,
  onModalHideClick,
  title,
  children,
}: CommonModalProps) => {
  return (
    <Dialog
      open={modalShow}
      onOpenChange={(open) => !open && onModalHideClick()}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
};
