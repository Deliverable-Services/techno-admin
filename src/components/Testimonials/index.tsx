import { AxiosError } from "axios";
import React, { useMemo, useState } from "react";
import { Button, Container, Modal } from "react-bootstrap";
import { BiSad } from "react-icons/bi";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import { handleApiError } from "../../hooks/handleApiErrors";
import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import EditButton from "../../shared-components/EditButton";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import TableImage from "../../shared-components/TableImage";
import API from "../../utils/API";
import { primaryColor } from "../../utils/constants";
import { showMsgToast } from "../../utils/showMsgToast";
import { AiFillDelete, AiFillIdcard } from "react-icons/ai";
import { queryClient } from "../../utils/queryClient";

const key = "testimonial";

const deleteCities = (id: Array<any>) => {
  return API.post(`${key}/delete`, {
    id,
  });
};

const intitialFilter = {
  q: "",
  page: 1,
  perPage: 25,
};

const Testimonial = () => {
  const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  console.log(selectedRows.map((item) => item.id));
  const [filter, setFilter] = useState(intitialFilter);
  const { data, isLoading, isFetching, error } = useQuery<any>(
    [key, , filter],
    {
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  const { mutate, isLoading: isDeleteLoading } = useMutation(deleteCities, {
    onSuccess: () => {
      queryClient.invalidateQueries(key);
      showMsgToast("Testimonials deleted successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const _onCreateClick = () => {
    history.push("/testimonials/create-edit");
  };
  const _onEditClick = (id: string) => {
    history.push("/testimonials/create-edit", { id });
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
        Header: "Picture",
        accessor: "picture",
        Cell: (data: Cell) => (
          <TableImage
            file={(data.row.original as any).picture}
            folder="testimonials"
          />
        ),
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Link",
        accessor: "link",
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
                permissionReq="update_testimonial"
              />
              <Button
                variant="outline-danger"
                className="d-flex align-items-center ml-2"
                onClick={() => {
                  setSelectedDeleteId(data.row.values.id);
                  setDeletePopup(true);
                }}
                style={{ padding: "0.25rem 0.5rem" }}
              >
                <AiFillDelete size={16} className="mr-1" /> Delete
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
          <BiSad color={primaryColor} />
          <span className="text-primary display-3">Something went wrong</span>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Container fluid className=" component-wrapper view-padding">
        <PageHeading
          icon={<AiFillIdcard />}
          title="Testimonials"
          onClick={_onCreateClick}
          totalRecords={data?.total}
          permissionReq="create_testimonial"
        />

        <div className="card">
          <Container fluid className="h-100 p-0 pt-3">
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
                    searchPlaceHolder="Search using name, link"
                    deletePermissionReq="delete_testimonial"
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
        </div>
      </Container>
      <Modal show={deletePopup} onHide={() => setDeletePopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Do you really want to delete this testimonial? This process cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="bg-light" onClick={() => setDeletePopup(false)}>
            Close
          </Button>
          <Button
            variant="danger"
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
            variant="danger"
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

export default Testimonial;
