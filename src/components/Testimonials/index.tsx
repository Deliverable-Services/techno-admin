import { AxiosError } from "axios";
import React, { useMemo, useState } from "react";
import { Button, Container, Dropdown, Modal } from "../ui/bootstrap-compat";
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
import { queryClient } from "../../utils/queryClient";
import { useFlyout } from "../../hooks/useFlyout";
import Flyout from "../../shared-components/Flyout";
import TestimonialCreateUpdateForm from "./TestimonialCreateUpdateForm";
import { Hammer } from "../ui/icon";
import { LetterText } from 'lucide-react';


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
  const [filter, setFilter] = useState(intitialFilter);
  const { isOpen: showFlyout, openFlyout, closeFlyout } = useFlyout();
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
    // history.push("/testimonials/create-edit");
    openFlyout();
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
            <div className="d-flex align-items-center justify-content-end gap-3">
              <EditButton
                onClick={() => {
                  _onEditClick(data.row.values.id);
                }}
                permissionReq="update_testimonial"
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
                    className="text-danger"
                    onClick={() => {
                      setSelectedDeleteId(data.row.values.id);
                      setDeletePopup(true);
                    }}
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
      <div className="view-padding">
        <PageHeading
          icon={<LetterText size={24} />}
          title="Testimonials"
          description="Create and manage testimonials for your workflow"
          onClick={_onCreateClick}
          totalRecords={data?.total}
          permissionReq="create_testimonial"
        />
      </div>
      <hr />

      <div className="">
        <div className="h-100 p-0 pt-3">
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
        </div>
      </div>

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
      <Flyout
        isOpen={showFlyout}
        onClose={closeFlyout}
        title={"Create Testimonial"}
        cancelText="Cancel"
        width="800px"
      >
        <TestimonialCreateUpdateForm />
      </Flyout>
    </>
  );
};

export default Testimonial;
