import React from "react";
import { Modal } from "react-bootstrap";

interface CommonModalProps {
  title: string;
  modalShow: boolean;
  onModalHideClick:  () => void;
  children: JSX.Element;
}

export const CommonModal = ({
  modalShow,
  onModalHideClick,
  title,
  children,
}: CommonModalProps) => {
  return (
    <Modal
      show={modalShow}
      onHide={onModalHideClick}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};
