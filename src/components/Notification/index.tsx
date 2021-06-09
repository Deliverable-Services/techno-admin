
import { AxiosError } from "axios";
import React, { useMemo, useState } from "react";
import { Button, Container, Modal, Spinner } from "react-bootstrap";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { BiSad } from "react-icons/bi";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import { handleApiError } from "../../hooks/handleApiErrors";
import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import IsActiveBadge from "../../shared-components/IsActiveBadge";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import API from "../../utils/API";
import {
  baseUploadUrl,
  primaryColor,
  secondaryColor
} from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";

const key = "brands";

const deleteBrand = (id: string) => {
  return API.delete(`${key}/${id}`, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const Notifications = () => {
  const history = useHistory()
  const [selectedRows, setSelectedRows] = useState([])
  const [page, setPage] = useState<number>(1);
  const { data, isLoading, isFetching, error } = useQuery<any>([key, page], {
    onError: (error: AxiosError) => {
      handleApiError(error, history)
    },
  });

  const { mutate, isLoading: isDeleteLoading } = useMutation(deleteBrand, {
    onSuccess: () => {
      queryClient.invalidateQueries(key);
      showMsgToast("Brands deleted successfully")
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history)
    },
  });

  const _onCreateClick = () => {
    history.push("/push-notifications/create-edit")
  }
  const _onEditClick = (id: string) => {
    history.push("/push-notifications/create-edit", { id })
  }

  const columns = useMemo(
    () => [
      {
        Header: "#Id",
        accessor: "id", //accessor is the "key" in the data
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Title",
        accessor: "url",
      },
      {
        Header: "Is Active?",
        accessor: "is_active",
        Cell: (data: Cell) => {
          return (
            <IsActiveBadge value={data.row.values.is_active} />
          )
        }
      },
      {
        Header: "Sent",
        accessor: "is_sent",
        Cell: (data: Cell) => "false"

      },
      {
        Header: "Created At",
        accessor: "created_at",
        Cell: (data: Cell) => {
          return (
            <CreatedUpdatedAt date={data.row.values.created_at} />
          )
        }
      },
      {
        Header: "Updated At",
        accessor: "updated_at",
        Cell: (data: Cell) => {
          return (
            <CreatedUpdatedAt date={data.row.values.updated_at} />
          )
        }
      },
      {
        Header: "Actions",
        Cell: (data: Cell) => {
          return (
            <div className="d-flex">
              <button
                onClick={() => {
                  _onEditClick(data.row.values.id);
                }}
              >
                <AiFillEdit color={secondaryColor} size={24} />
              </button>
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
          <BiSad color={primaryColor} />
          <span className="text-primary display-3">Something went wrong</span>
        </div>
      </Container>
    );
  }

  return (
    <>
      <PageHeading title="Notifications" onClick={_onCreateClick} />
      <Container fluid className="card component-wrapper px-0 py-2">


        <Container fluid className="h-100 p-0">

          {isLoading || isFetching ? (
            <IsLoading />
          ) : (
            <>
              {!error && <ReactTable
                data={data}
                columns={columns}
                setSelectedRows={setSelectedRows}
              />}
              {!error && data.length > 0 ? (
                <TablePagination
                  currentPage={data?.current_page}
                  lastPage={data?.last_page}
                  setPage={setPage}
                  hasNextPage={!!data?.next_page_url}
                  hasPrevPage={!!data?.prev_page_url}
                />
              ) : null}{" "}
            </>
          )}
        </Container>
      </Container>
      {
        selectedRows.length > 0 &&
        <div className="delete-button rounded">
          <span><b>Delete {selectedRows.length} rows</b></span>
          <Button variant="danger">
            Delete
          </Button>
        </div>
      }
    </>
  );
};

export default Notifications;
