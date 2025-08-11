import { AxiosError } from "axios";
import { useMemo, useState } from "react";
import { Modal, Container } from "../ui/bootstrap-compat";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import { handleApiError } from "../../hooks/handleApiErrors";
import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import EditButton from "../../shared-components/EditButton";
import IsLoading from "../../shared-components/isLoading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import API from "../../utils/API";
import { primaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import Restricted from "../../shared-components/Restricted";
import ConfigCreateUpdateForm from "./ConfigCreateUpdate";
import { Hammer } from "../ui/icon";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

const key = "configuration";

const deleteConfig = (id: Array<any>) => {
  return API.post(`${key}/delete`, {
    id,
  });
};

const intitialFilter = {
  q: "",
  page: 1,
  perPage: 25,
};

const CustomConfigTab = () => {
  const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const [filter, setFilter] = useState(intitialFilter);
  const [selectedConfigId, setSelectedConfigId] = useState<String>();
  const [modalShow, setModalShow] = useState(false);

  const { data, isLoading, isFetching, error } = useQuery<any>(
    [key, , filter],
    {
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  const { mutate, isLoading: isDeleteLoading } = useMutation(deleteConfig, {
    onSuccess: () => {
      queryClient.invalidateQueries(key);
      showMsgToast("Configuration deleted successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const _onModalHideClick = () => {
    setSelectedConfigId(null);
    setModalShow(false);
  };

  const _onEditClick = (id: string) => {
    setSelectedConfigId(id);
    setModalShow(true);
  };

  const _onFilterChange = (idx: string, value: any) => {
    setFilter((prev) => ({
      ...prev,
      [idx]: value,
    }));
  };

  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

  const columns = useMemo(
    () => [
      {
        Header: "#Id",
        accessor: "id", //accessor is the "key" in the data
      },
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Key",
        accessor: "key",
      },
      {
        Header: "Value",
        accessor: "value",
      },
      {
        Header: "Created At",
        accessor: "created_at",
        Cell: (data: Cell) => {
          return <CreatedUpdatedAt date={data.row.values.created_at} />;
        },
      },
      {
        Header: "Updated At",
        accessor: "updated_at",
        Cell: (data: Cell) => {
          return <CreatedUpdatedAt date={data.row.values.updated_at} />;
        },
      },
      {
        Header: "Actions",
        Cell: (data: Cell) => {
          return (
            <div className="d-flex align-items-center gap-2">
              <EditButton
                onClick={() => {
                  _onEditClick(data.row.values.id);
                }}
                permissionReq="update_config"
              />
              <Button
                variant="outline_danger"
                className="d-flex align-items-center ml-2"
                onClick={() => {
                  setSelectedDeleteId(data.row.values.id);
                  setDeletePopup(true);
                }}
                style={{ padding: "0.25rem 0.5rem" }}
              >
                <Hammer size={16} className="mr-1" /> Delete
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

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

  return (
    <>
      <div className="tab-header align-items-start d-flex justify-content-between tab-header">
        <div>
          <h4>Configurations</h4>
          <p>Create custom configurations for your app.</p>
        </div>
        <Restricted to={"create_config"}>
          <Button
            onClick={() => setModalShow(true)}
            size={"sm"}
            style={{
              background: "var(--primary-color)",
              borderColor: "var(--primary-color)",
            }}
          >
            <div className="text-white d-flex align-items-center">
              <Hammer size={18} />
              <p className="mb-0 ml-1">Create</p>
            </div>
          </Button>
        </Restricted>
      </div>

      <Container fluid className="h-100 p-0">
        {isLoading ? (
          <IsLoading />
        ) : (
          <>
            {!error && (
              <ReactTable
                data={data?.data}
                columns={columns}
                setSelectedRows={setSelectedRows}
                filter={filter}
                onFilterChange={_onFilterChange}
                isDataLoading={isFetching}
                searchPlaceHolder="Search using title"
                deletePermissionReq="delete_config"
              />
            )}
            {!error && data?.data?.length > 0 ? (
              <TablePagination
                currentPage={data?.current_page}
                lastPage={data?.last_page}
                setPage={_onFilterChange}
                hasNextPage={!!data?.next_page_url}
                hasPrevPage={!!data?.prev_page_url}
              />
            ) : null}{" "}
          </>
        )}
      </Container>

      <Dialog open={modalShow} onOpenChange={setModalShow} modal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Custom Configurations</DialogTitle>
            <DialogDescription>
              Create custom configurations for you app
            </DialogDescription>
          </DialogHeader>

          <ConfigCreateUpdateForm
            id={selectedConfigId}
            onHideModal={_onModalHideClick}
          />
        </DialogContent>
      </Dialog>

      <Modal show={deletePopup} onHide={() => setDeletePopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Do you really want to delete this configuration? This process cannot
          be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" onClick={() => setDeletePopup(false)}>
            Close
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (selectedDeleteId) {
                mutate([selectedDeleteId]);
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
      {selectedRows.length > 0 && (
        <div className="delete-button rounded">
          <span>
            <b>Delete {selectedRows.length} rows</b>
          </span>
          <Button
            variant="destructive"
            onClick={() => {
              mutate(selectedRows.map((i) => i.id));
            }}
          >
            {isDeleteLoading ? "Loading..." : "Delete"}
          </Button>
        </div>
      )}
    </>
  );
};

export default CustomConfigTab;
