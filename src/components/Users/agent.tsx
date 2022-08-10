import { AxiosError } from "axios";
import { useMemo, useState } from "react";
import { Button, Col, Container, Modal, Row, Spinner } from "react-bootstrap";
import { BiSad } from "react-icons/bi";
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
interface IFilter {
  role: string | null;
}
const key = "users";

const deleteUsers = (id: Array<any>) => {
  return API.post(`${key}/delete`, { id });
};

const intitialFilter = {
  role: "agent",
  perPage: 25,
  q: "",
  page: null,
  disabled: "",
};

const Agents = () => {
  const history = useHistory();
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [filter, setFilter] = useState(intitialFilter);
  console.log(selectedRows.map((item) => item.id));
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
    history.push("/users/create-edit", { role: "agent" });
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
            <div className="d-flex">
              <EditButton
                onClick={() => {
                  _onEditClick(data.row.values.id, data.row.values.role);
                }}
                permissionReq="update_user"
              />
              {/* <Button
                variant="outline-primary"
                onClick={() => console.log("hellow")}
                className="ml-2"
              >
                <AiFillEdit size={16} className="mr-1" />
                Target
              </Button> */}
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
      <Container fluid className="card component-wrapper view-padding">
        <PageHeading
          title="Agents"
          onClick={_onCreateClick}
          totalRecords={data?.total}
          permissionReq="create_user"
        />

        <Container fluid className="h-100 p-0">
          {isLoading ? (
            <IsLoading />
          ) : (
            <>
              {!error && (
                <>
                  <Container fluid className="pt-3 px-0">
                    <Row className="select-filter d-flex">
                      <Col md="auto">
                        <FilterSelect
                          currentValue={filter.disabled}
                          data={isActiveArray}
                          label="Disabled Users?"
                          idx="disabled"
                          onFilterChange={_onFilterChange}
                          defaultSelectTitle="Show All"
                        />
                      </Col>
                      <Col
                        md="auto"
                        className="d-flex align-items-end  justify-md-content-center"
                      >
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
                      </Col>
                    </Row>
                  </Container>
                  <hr className="mt-2" />
                  <ReactTable
                    data={data?.data}
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
            // onClick={() => {
            //   mutate(selectedRowId);
            // }}
          >
            {isDeleteLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Disable"
            )}
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

export default Agents;
