import { AxiosError } from "axios";
import { useMemo, useState } from "react";
import { Button, Container, Dropdown, Modal } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import { handleApiError } from "../../hooks/handleApiErrors";
import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import CustomBadge from "../../shared-components/CustomBadge";
import EditButton from "../../shared-components/EditButton";
import FilterSelect from "../../shared-components/FilterSelect";
import IsActiveBadge from "../../shared-components/IsActiveBadge";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import TableImage from "../../shared-components/TableImage";
import API from "../../utils/API";
import { areTwoObjEqual } from "../../utils/areTwoObjEqual";
import { isActiveArray } from "../../utils/arrays";
import { primaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import { CommonModal } from "../CommonPopup/CommonModal";
import UserCreateUpdateForm from "./UsersCreateUpdateForm";
import { Hammer } from "../ui/icon";
interface IFilter {
  role: string | null;
}
const key = "users";

const deleteUsers = (id: Array<any>) => {
  return API.post(`${key}/delete`, { id });
};

const intitialFilter = {
  q: "",
  role: "admin",
  page: null,
  perPage: 25,
  disabled: "",
};

const Admins = () => {
  const history = useHistory();
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filter, setFilter] = useState(intitialFilter);
  const [modalShow, setModalShow] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [role, setRole] = useState("");

  const { data, isLoading, isFetching, error } = useQuery<any>(
    [key, , filter],
    {
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  const { mutate, isLoading: isDeleteLoading } = useMutation(deleteUsers, {
    onSuccess: () => {
      queryClient.invalidateQueries(key);
      showMsgToast("Users deleted successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });
  const _onFilterChange = (idx: string, value: any) => {
    setFilter((prev) => {
      return {
        ...prev,
        [idx]: value,
      };
    });
  };

  const _onCreateClick = () => {
    history.push("/users/create-edit", { role: "admin" });
  };

  const _onEditClick = (id: string, role: string) => {
    history.push("/users/create-edit", { id, role });
  };
  const columns = useMemo(
    () => [
      {
        Header: "#Id",
        accessor: "id", //accessor is the "key" in the data
      },
      {
        Header: "Profile Pic",
        accessor: "profile_pic",
        Cell: (data: Cell) => (
          <TableImage folder="profile_pic" file={data.row.values.profile_pic} />
        ),
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Phone",
        accessor: "phone",
      },
      {
        Header: "Phone",
        accessor: "email",
      },
      {
        Header: "Role",
        accessor: "role",
        Cell: (data: Cell) => (
          <CustomBadge variant="primary" title={data.row.values.role} />
        ),
      },
      {
        Header: " Disabled?",
        accessor: "disabled",
        Cell: (data: Cell) => {
          return <IsActiveBadge value={data.row.values.disabled} />;
        },
      },
      {
        Header: "Created At",
        accessor: "created_at",
        Cell: (data: Cell) => {
          return <CreatedUpdatedAt date={data.row.values.created_at} />;
        },
      },
      {
        Header: "Actions",
        Cell: (data: Cell) => {
          return (
            <div className="d-flex align-items-center justify-content-end gap-3">
              <EditButton
                onClick={() => {
                  _onEditClick(data.row.values.id, data.row.values.role);
                }}
                permissionReq="update_user"
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
                    <Hammer size={16} className="ml-1" />
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

  const _toggleModal = () => {
    setModalShow(!modalShow);
  };

  return (
    <>
      <CommonModal
        modalShow={modalShow}
        onModalHideClick={_toggleModal}
        title="Create New Team Member"
      >
        <UserCreateUpdateForm toggleModal={_toggleModal} />
      </CommonModal>
      <div className="view-padding">
        <PageHeading
          icon={<Hammer size={24} />}
          title="Team Members"
          description="Create and manage team members for your workflow"
          onClick={_toggleModal}
          totalRecords={data?.total}
          permissionReq="create_user"
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
                <>
                  <ReactTable
                    data={data?.data}
                    filters={
                      <Dropdown className="search-filters-div filter-dropdown mr-2">
                        <Dropdown.Toggle as={Button} variant="primary">
                          <Hammer /> Filters
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <div className="filter-dropdown-heading d-flex justify-content-between w-100">
                            <h4>Filter</h4>
                            <div className="d-flex align-items-center justify-md-content-center">
                              <Button
                                variant={
                                  areTwoObjEqual(intitialFilter, filter)
                                    ? "light"
                                    : "primary"
                                }
                                style={{
                                  fontSize: 14,
                                }}
                                onClick={() => setFilter(intitialFilter)}
                              >
                                Reset Filters
                              </Button>
                            </div>
                          </div>
                          <div className="select-filter">
                            <FilterSelect
                              currentValue={filter.disabled}
                              data={isActiveArray}
                              label="Disabled Users?"
                              idx="disabled"
                              onFilterChange={_onFilterChange}
                              defaultSelectTitle="Show All"
                            />
                          </div>
                        </Dropdown.Menu>
                      </Dropdown>
                    }
                    columns={columns}
                    setSelectedRows={setSelectedRows}
                    filter={filter}
                    onFilterChange={_onFilterChange}
                    isDataLoading={isFetching}
                    searchPlaceHolder="Search using name, phone, email"
                    deletePermissionReq="delete_user"
                  />
                </>
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

export default Admins;
