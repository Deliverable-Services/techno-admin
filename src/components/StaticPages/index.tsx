import { AxiosError } from "axios";
// Replaced braft-editor; using a simple textarea for now.
type EditorState = string;
import React, { useMemo, useState } from "react";
import { useEffect } from "react";
import { Modal, Button, Container, Dropdown } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { handleApiError } from "../../hooks/handleApiErrors";
import useUserProfileStore from "../../hooks/useUserProfileStore";
import EditButton from "../../shared-components/EditButton";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import Restricted from "../../shared-components/Restricted";
import API from "../../utils/API";
import { isDesktop, primaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import StaticPageCreateForm from "./StaticPageCreateUpdateForm";
import ReactTable from "../../shared-components/ReactTable";
import { Cell } from "react-table";
import { Hammer } from "../ui/icon";

const key = "staticPages";

const updatePageData = ({ formdata, id }: { formdata: any; id: string }) => {
  return API.post(`${key}/${id}`, formdata);
};
const deletePage = (id: any) => {
  return API.post(`${key}/delete`, { id });
};

const intitialFilter = {
  role: "customer",
  q: "",
  page: null,
  perPage: 25,
  disabled: "",
};

const StaticPages = () => {
  const history = useHistory();
  const isRestricted = useUserProfileStore((state) => state.isRestricted);

  const [filter, setFilter] = useState(intitialFilter);
  const { data, isLoading, isFetching } = useQuery<any>([key, , filter]);
  const [titles, setTitles] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState(titles[0]);
  const [modalShow, setModalShow] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

  const _onEditClick = (id: string) => {
    history.push(`/website-pages/create-edit/${id}`, { id });
  };

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

  const _onDeletePage = (pageId: any) => {
    mutateDelete(pageId);
  };

  const columns = useMemo(
    () => [
      {
        Header: "#Id",
        accessor: "id", //accessor is the "key" in the data
      },
      {
        Header: "Name",
        accessor: "title",
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "URL",
        accessor: "url",
      },
      {
        Header: "Organization Id",
        accessor: "organisation_id",
      },
      {
        Header: "Actions",
        Cell: (data: Cell) => {
          return (
            <div className="d-flex align-items-center justify-content-end gap-3">
              <EditButton
                onClick={() => _onEditClick(data?.row?.values?.id)}
                permissionReq="update_banner"
              />
              <Dropdown className="ellipsis-dropdown">
                <Dropdown.Toggle
                  variant="light"
                  size="sm"
                  className="p-1 border-0 shadow-none"
                  id={`dropdown-${data.row.values.id}`}
                >
                  <Hammer size={18} />
                </Dropdown.Toggle>

                <Dropdown.Menu className="menu-dropdown">
                  <Dropdown.Item
                    onClick={() => {
                      setSelectedDeleteId(data?.row?.values?.id);
                      setDeletePopup(true);
                    }}
                    className="text-danger"
                  >
                    <Hammer size={16} className="me-1" />
                    Delete
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          );
        },
      },
    ],
    []
  );

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

  const _onFilterChange = (idx: string, value: any) => {
    setFilter((prev) => {
      return {
        ...prev,
        [idx]: value,
      };
    });
  };

  if (!data && (!isLoading || !isFetching)) {
    return (
      <Container fluid className="d-flex justify-content-center display-3">
        <div className="d-flex flex-column align-items-center">
          <Hammer color={primaryColor} />
          <span className="text-primary display-3">Something went wrong</span>
        </div>
      </Container>
    );
  }

  if (isLoading) return <IsLoading />;

  return (
    <>
      <Modal show={deletePopup} onHide={() => setDeletePopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Do you really want to delete this user? This process cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="bg-light" onClick={() => setDeletePopup(false)}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (selectedDeleteId) {
                _onDeletePage(selectedDeleteId);
                setDeletePopup(false);
                setSelectedDeleteId(null);
              }
            }}
            disabled={isDeleteLoading}
          >
            {isDeleteLoading ? "Loading..." : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
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
      </Container>
      <ReactTable
        data={data?.data}
        columns={columns}
        onFilterChange={_onFilterChange}
        filter={filter}
        isDataLoading={isFetching}
        searchPlaceHolder="Search using name"
        deletePermissionReq="delete_banner"
      />

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
  const [contentDetails, setContentDetials] = useState<EditorState>("");

  useEffect(() => {
    if (page) setContentDetials(page.content || "");
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
    mutateDelete(pageId);
  };

  return (
    <>
      <Container
        fluid
        className="p-0 mb-3"
        style={{ display: selectedTitle === page.title ? "block" : "none" }}
      >
        <div className="">
          <div
            className={`card-title d-flex justify-content-between ${
              !isDesktop
                ? "flex-column align-items-start gap-10"
                : "align-items-center"
            }`}
          >
            <p className="text-black px-2 lead font-weight-bold">
              {page.title}
            </p>
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
              <div className="bg-light rounded p-2">
                <textarea
                  className="form-control"
                  style={{ minHeight: 300 }}
                  value={contentDetails}
                  onChange={(e) => setContentDetials(e.target.value)}
                  onKeyDown={(e) => {
                    if (
                      (e.ctrlKey || e.metaKey) &&
                      e.key.toLowerCase() === "s"
                    ) {
                      e.preventDefault();
                      handleSave(contentDetails, page);
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default StaticPages;
