import React, { useState } from "react";
import {
  Button, Container, Modal,
  Spinner
} from "react-bootstrap";
import { useMutation } from "react-query";
import { useHistory } from "react-router-dom";
import PageHeading from "../../shared-components/PageHeading";
import API from "../../utils/API";
import { queryClient } from "../../utils/queryClient";
import { showErrorToast } from "../../utils/showErrorToast";
import AdCardsContainer from "./AdCardsContainer";

const deleteBanner = (id: string) => {
  return API.delete(`banners/${id}`, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
const Advertisements = () => {
  const history = useHistory()
  const [selectedRowId, setSelectedRowId] = useState<string>("");
  const [deletePopup, setDeletePopup] = useState(false);
  const _onCreateClick = () => {
    history.push("/advertisements/create-edit")
  }

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
        <PageHeading title="Advertisements" onClick={_onCreateClick} />
        <Container fluid className="h-100 p-0">
          <AdCardsContainer
            setDeletePopup={setDeletePopup}
            setSelectedRowId={setSelectedRowId}
          />
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
