import { AxiosError } from "axios";
import BraftEditor, { EditorState } from "braft-editor";
import { title } from "process";
import React, { useState } from "react";
import { useEffect } from "react";
import { Modal, Button, Container } from "react-bootstrap";
import { BiSad } from "react-icons/bi";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { handleApiError } from "../../hooks/handleApiErrors";
import useUserProfileStore from "../../hooks/useUserProfileStore";
import EditButton from "../../shared-components/EditButton";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import Restricted from "../../shared-components/Restricted";
import API from "../../utils/API";
import { primaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import StaticPageCreateForm from "./StaticPageCreateUpdateForm";

const key = "staticPages";

const updatePageData = ({ formdata, id }: { formdata: any; id: string }) => {
  return API.post(`${key}/${id}`, formdata);
};
const deletePage = (id: any) => {
  return API.post(`${key}/delete`, { id });
};

const StaticPages = () => {
  const history = useHistory();
  const isRestricted = useUserProfileStore((state) => state.isRestricted);

  const { data, isLoading, isFetching } = useQuery<any>([key]);
  const [titles, setTitles] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState(titles[0]);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    if (isLoading || isFetching) return;
    if (!data) return;

    setTitles(data?.data.map((p) => p.title));
  }, [data, isLoading, isFetching]);
  useEffect(() => {
    if (titles.length > 0) {
      setSelectedTitle(titles[0]);
    }
  }, [titles.length]);

  const _onModalHideClick = () => {
    setModalShow(false);
  };

  if (!data && (!isLoading || !isFetching)) {
    return (
      <Container fluid className="d-flex justify-content-center display-3">
        <div className="d-flex flex-column align-items-center">
          <BiSad color={primaryColor} />
          <span className="text-primary display-3">Something went wrong</span>
        </div>
      </Container>
    );
  }

  if (isLoading) return <IsLoading />;

  return (
    <>
      <Container fluid className="component-wrapper view-padding">
        <PageHeading
          title="Static Pages"
          onClick={() => setModalShow(true)}
          permissionReq="create_staticpage"
        />
        {!isRestricted("update_staticpage") && (
          <p className="small text-muted">
            Press "Ctrl+S" inside editor to save content
          </p>
        )}
        <Container fluid className="px-0 my-3">
          {titles?.map((title) => (
            <Button
              size="sm"
              variant={selectedTitle === title ? "primary" : "outline-primary"}
              className="mr-2"
              onClick={() => setSelectedTitle(title)}
            >
              {title}
            </Button>
          ))}
        </Container>

        {data?.data.map((page) => (
          <PageContainer page={page} selectedTitle={selectedTitle} />
        ))}
      </Container>

      <Modal
        show={modalShow}
        onHide={_onModalHideClick}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Create Static Page
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <StaticPageCreateForm onHideModal={_onModalHideClick} />
        </Modal.Body>
      </Modal>
    </>
  );
};

const PageContainer = ({ page, selectedTitle }) => {
  const history = useHistory();
  const isRestricted = useUserProfileStore((state) => state.isRestricted);
  const [contentDetails, setContentDetials] = useState<EditorState>();

  useEffect(() => {
    if (page) setContentDetials(BraftEditor.createEditorState(page.content));
  }, [page]);

  const { mutate, isLoading: isUpdatedLoading } = useMutation(updatePageData, {
    onSuccess: () => {
      showMsgToast("Page saved successfully");
      setTimeout(() => queryClient.invalidateQueries(key), 500);
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });
  const { mutate: mutateDelete, isLoading: isDeleteLoading } = useMutation(
    deletePage,
    {
      onSuccess: () => {
        showMsgToast("Page  deleted successfully");
        setTimeout(() => queryClient.invalidateQueries(key), 500);
      },
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  const handleSave = (editorState: EditorState, pagedata: any) => {
    if (isRestricted("update_staticpage")) return;
    const content = editorState.toHTML();
    const formdata = {
      ...pagedata,
      content,
    };
    mutate({ formdata, id: pagedata.id });
  };
  const _onDeletePage = (pageId: any) => {
    console.log("delete page", pageId);
    mutateDelete(pageId);
  };

  return (
    <Container
      fluid
      className="p-0 mb-3"
      style={{ display: selectedTitle === page.title ? "block" : "none" }}
    >
      <div className="">
        <div className="card-title d-flex align-items-center justify-content-between">
          <p className="text-black px-2 lead font-weight-bold">{page.title}</p>
          <div className="d-flex align-items-center">
            <Restricted to="update_staticpage">
              <Button
                size="sm"
                className="mr-2"
                onClick={() => handleSave(contentDetails, page)}
                disabled={isUpdatedLoading}
              >
                {isUpdatedLoading ? "Loading..." : "Save Changes"}
              </Button>
            </Restricted>
            <Restricted to="delete_staticpage">
              <Button
                size="sm"
                className="mr-2"
                variant="danger"
                onClick={() => _onDeletePage(page.id)}
                disabled={isDeleteLoading}
              >
                {isDeleteLoading ? "Loading..." : "Delete page"}
              </Button>
            </Restricted>
            {/* <EditButton onClick={() => _onEditPageClick(page.id)} /> */}
          </div>
        </div>
        <p className="text-muted px-2">{page.description}</p>
        <div className="mx-auto">
          {isUpdatedLoading ? (
            <IsLoading />
          ) : (
            <div className="bg-light rounded">
              <BraftEditor
                value={contentDetails}
                onSave={(editorState: EditorState) =>
                  handleSave(editorState, page)
                }
                onChange={(editorState: EditorState) =>
                  setContentDetials(editorState)
                }
                language="en"
              />
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default StaticPages;
