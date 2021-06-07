import { useMemo, useState } from "react";
import { Button, Container, Form, Modal, Spinner } from "react-bootstrap";
import { AiFillDelete, AiFillEdit, AiFillPlusSquare } from "react-icons/ai";
import { BiSad } from "react-icons/bi";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import BreadCrumb from "../../shared-components/BreadCrumb";
import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import IsActiveBadge from "../../shared-components/IsActiveBadge";
import IsLoading from "../../shared-components/isLoading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import API from "../../utils/API";
import { userRoles } from "../../utils/arrays";
import {
  baseUploadUrl,
  primaryColor,
  secondaryColor
} from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showErrorToast } from "../../utils/showErrorToast";
interface IFilter {
  role: string | null
}
const key = "users";

const disableUser = (id: string) => {

  return API.post(`${key}/${id}`, {
    disable: 1
  });
};
const INITIAL_FILTER = {
  role: ""
}


const Users = () => {
  const history = useHistory()
  const [selectedRowId, setSelectedRowId] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [role, setRole] = useState("")
  const [deletePopup, setDeletePopup] = useState(false);

  const [filter, setFilter] = useState<IFilter>(INITIAL_FILTER)

  const { data, isLoading, isFetching, error } = useQuery<any>([key, page, filter], {
    onError: (err: any) => {
      showErrorToast(err.response.data.message);
    },
  });

  const { mutate, isLoading: isDeleteLoading } = useMutation(disableUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(key);
      setDeletePopup(false);
    },
    onError: () => {
      showErrorToast("Something went wrong deleteing the records");
    },
  });
  const _onFilterChange = (idx: string, value: any) => {
    setFilter((prev) => {
      return {
        ...prev,
        [idx]: value
      }
    })
  }

  const _onCreateClick = () => {
    history.push("/users/create-edit")
  }
  const _onEditClick = (id: string) => {
    history.push("/users/create-edit", { id })
  }

  console.log({ data, isLoading, isFetching })

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
          <div className="table-image">
            <img
              src={`${baseUploadUrl}users/${data.row.values.profile_pic}`}
              alt="name"
            />
          </div>
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
        Header: "Role",
        accessor: "role",
      },
      {
        Header: " Disabled?",
        accessor: "disabled",
        Cell: (data: Cell) => {
          return (
            <IsActiveBadge value={data.row.values.disabled} />
          )
        }
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
              <button
                className="ml-2"
                onClick={() => {
                  setSelectedRowId(data.row.values.id);
                  setDeletePopup(true);
                }}
              >
                <AiFillDelete color="red" size={24} />
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
      <Container fluid className="d-flex justify-content-between py-2">
        <h2 className="font-weight-bold">Users</h2>
        <div className="d-flex">
          <Form.Control as="select" className="mr-4"
            onChange={(e) => {
              setRole(e.target.value)
            }}
          >
            <option value="">All</option>
            {userRoles.map(role => (
              <option value={role.id}>{role.name}</option>
            ))}
          </Form.Control>
          <Button variant="primary" onClick={_onCreateClick}>
            <div className="text-white d-flex ">
              <AiFillPlusSquare size={25} /> <b>Create</b>
            </div>
          </Button>
        </div>
      </Container>


      {
        (!isLoading || !isFetching) &&
        <Container fluid>
          <div>
            <div className="filter">
              <BreadCrumb
                onFilterChange={_onFilterChange}
                value=""
                currentValue={filter.role}
                dataLength={data.data.length}
                idx="role"
                title="All"
              />
              <BreadCrumb
                onFilterChange={_onFilterChange}
                value="admin"
                currentValue={filter.role}
                dataLength={data.data.length}
                idx="role"
                title="Admin"
              />
              <BreadCrumb
                onFilterChange={_onFilterChange}
                value="customer"
                currentValue={filter.role}
                dataLength={data.data.length}
                idx="role"
                title="Customer"

              />
              <BreadCrumb
                onFilterChange={_onFilterChange}
                value="agent"
                currentValue={filter.role}
                dataLength={data.data.length}
                idx="role"
                title="Agent"
                isLast

              />
            </div>
          </div>
        </Container>

      }
      <Container fluid className="component-wrapper px-0 py-2">
        <Container fluid className="h-100 p-0">

          {isLoading || isFetching ? (
            <IsLoading />
          ) : (
            <>
              {!error && <ReactTable data={data.data} columns={columns} />}
              {!error && data.data.length > 0 ? (
                <TablePagination
                  currentPage={data.current_page}
                  lastPage={data.last_page}
                  setPage={setPage}
                  hasNextPage={!!data.next_page_url}
                  hasPrevPage={!!data.prev_page_url}
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
            onClick={() => {
              mutate(selectedRowId);
            }}
          >
            {isDeleteLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Disable"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Users;
