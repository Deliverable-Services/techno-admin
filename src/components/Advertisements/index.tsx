import React, { useState } from "react";
import {
  Container,
  Button,
  Row,
  Col,
  Card,
  Modal,
  Spinner,
} from "react-bootstrap";
import { AiFillDelete, AiFillEdit, AiFillPlusSquare } from "react-icons/ai";
import { BiArrowFromRight } from "react-icons/bi";
import { useMutation } from "react-query";
import useToggle from "../../hooks/useToggle";
import API from "../../utils/API";
import { secondaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showErrorToast } from "../../utils/showErrorToast";
import UpdateCreateForm from "./AdvertisementUpdateCreateForm";
import AdCardsContainer from "./AdCardsContainer";

const deleteBanner = (id: string) => {
  return API.delete(`banners/${id}`, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
const Advertisements = () => {
  const { setStatusCreate, setStatusDefault, status, setStatusEdit } =
    useToggle();
  const [selectedRowId, setSelectedRowId] = useState<string>("");
  const [deletePopup, setDeletePopup] = useState(false);

  const { mutate, isLoading: isDeleteLoading } = useMutation(deleteBanner, {
    onSuccess: () => {
      queryClient.invalidateQueries("banners/list");
      setDeletePopup(false);
    },
    onError: () => {
      showErrorToast("Something went wrong deleteing the records");
    },
  });

  return (
    <>
      <Container fluid className="component-wrapper px-0 py-2">
        <Container fluid className="d-flex justify-content-between py-2">
          <h2 className="font-weight-bold">Advertisements</h2>
          {status !== "default" ? (
            <Button variant="primary" onClick={setStatusDefault}>
              <div className="text-white">
                <BiArrowFromRight size={25} /> <b>Back</b>
              </div>
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => {
                setSelectedRowId("");
                setStatusCreate();
              }}
            >
              <div className="text-white">
                <AiFillPlusSquare size={24} /> <b>Create</b>
              </div>
            </Button>
          )}
        </Container>

        <Container fluid className="h-100 p-0">
          {status === "creating" && (
            <Container fluid className="mt-2 py-4">
              <UpdateCreateForm />
            </Container>
          )}

          {status === "editing" && (
            <Container fluid className="mt-2 py-4">
              <UpdateCreateForm id={selectedRowId} />
            </Container>
          )}

          {status === "default" && (
            <AdCardsContainer
              setDeletePopup={setDeletePopup}
              setSelectedRowId={setSelectedRowId}
              setStatusEdit={setStatusEdit}
            />
          )}
        </Container>
      </Container>
      <Modal show={deletePopup} onHide={() => setDeletePopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Do you really want to delete this record? This process cannot be
          undone
        </Modal.Body>
        <Modal.Footer>
          <Button variant="bg-light" onClick={() => setDeletePopup(false)}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              mutate(selectedRowId);
            }}
          >
            {isDeleteLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Delete"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Advertisements;
