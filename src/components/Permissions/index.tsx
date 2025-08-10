// Permissions/index.tsx

import { AxiosError } from "axios";
import { useMemo, useState } from "react";
import { Button, Container, Dropdown, Nav } from "react-bootstrap";
import { BiSad } from "react-icons/bi";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import { handleApiError } from "../../hooks/handleApiErrors";
import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import Restricted from "../../shared-components/Restricted";
import API from "../../utils/API";
import { primaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import { CommonModal } from "../CommonPopup/CommonModal";
import PermissionsCreateUpdateForm from "./PermissoinsCreateUpdateForm";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";

const key = "get-all-permission";

const deleteBrand = (id: Array<any>) => {
  return API.post(`${key}/delete`, {
    id,
  });
};

const intitialFilter = {
  active: "",
  q: "",
  page: 1,
  perPage: 25,
};

const Permissions = () => {
  const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [activeTab, setActiveTab] = useState("roles"); // "roles" or "permissions"
  const [filter, setFilter] = useState(intitialFilter);
  const { data, isLoading, isFetching, error } = useQuery<any>(
    [key, , filter],
    {
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );
  const {
    data: RolesPermission,
    isLoading: isRolesPermissionLoading,
    isFetching: isRolesPermissoinFetch,
    error: RolesPermissionError,
  } = useQuery<any>(["roles-with-permission", , filter], {
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const { mutate, isLoading: isDeleteLoading } = useMutation(deleteBrand, {
    onSuccess: () => {
      queryClient.invalidateQueries(key);
      showMsgToast("Permission deleted successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const _onCreateClick = () => {
    setModalShow(true);
  };
  const _onRolesCreateClick = () => {
    history.push("/assign-permission/create-edit");
  };
  const _onEditClick = (id: string) => {
    history.push("/permissions/create-edit", { id });
  };
  const _onGiveClick = (id: string) => {
    history.push("/assign-permission/create-edit", { id });
  };
  const _onRevokeClick = (id: string) => {
    history.push("/revoke-permission/create-edit", { id });
  };

  const _onFilterChange = (idx: string, value: any) => {
    setFilter((prev) => ({
      ...prev,
      [idx]: value,
    }));
  };

  const columns = useMemo(
    () => [
      {
        Header: "Role",
        accessor: "name",
      },
      {
        Header: "Permissions",
        accessor: "permissions",
        Cell: (data: Cell) => {
          const p = data.row.values.permissions;
          const list = p.map((x) => x.name).join(", ");
          return (
            <div>
              <span>{list} </span>
            </div>
          );
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
            <div className="d-flex">
              <Restricted to="assign_permission">
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    _onGiveClick((data.row.original as any).id);
                  }}
                >
                  Give
                </Button>
              </Restricted>
              <Restricted to="revoke_permission">
                <Button
                  className="ml-2"
                  variant="outline-danger"
                  onClick={() => {
                    _onRevokeClick((data.row.original as any).id);
                  }}
                >
                  Revoke
                </Button>
              </Restricted>
              <Dropdown className="ellipsis-dropdown ml-2">
                <Dropdown.Toggle
                  variant="light"
                  size="sm"
                  className="p-1 border-0 shadow-none"
                  id={`dropdown-${data.row.values.id}`}
                >
                  <BsThreeDotsVertical size={18} />
                </Dropdown.Toggle>

                <Dropdown.Menu className="menu-dropdown">
                  <Dropdown.Item className="text-danger">
                    <AiFillDelete size={16} className="me-1" />
                    Delete
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          );
        },
      },
    ],
    [_onGiveClick, _onRevokeClick]
  );
  const permissionColumn = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        Cell: (data: Cell) => {
          return (
            <span>
              {data.row.values.name
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}
            </span>
          );
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
        Header: "Updated At",
        accessor: "updated_at",
        Cell: (data: Cell) => {
          return <CreatedUpdatedAt date={data.row.values.updated_at} />;
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
  if (
    !RolesPermission &&
    (!isRolesPermissionLoading || !isRolesPermissoinFetch)
  ) {
    return (
      <Container fluid className="d-flex justify-content-center display-3">
        <div className="d-flex flex-column align-items-center">
          <BiSad color={primaryColor} />
          <span className="text-primary display-3">Something went wrong</span>
        </div>
      </Container>
    );
  }

  const _toggleModal = () => {
    setModalShow(!modalShow);
  };

  // Get current data and columns based on active tab
  const getCurrentData = () => {
    if (activeTab === "roles") {
      return RolesPermission?.role;
    } else {
      return data;
    }
  };

  const getCurrentColumns = () => {
    if (activeTab === "roles") {
      return columns;
    } else {
      return permissionColumn;
    }
  };

  const getCurrentLoading = () => {
    if (activeTab === "roles") {
      return isRolesPermissionLoading;
    } else {
      return isLoading;
    }
  };

  const getCurrentFetching = () => {
    if (activeTab === "roles") {
      return isRolesPermissoinFetch;
    } else {
      return isFetching;
    }
  };

  const getCurrentError = () => {
    if (activeTab === "roles") {
      return RolesPermissionError;
    } else {
      return error;
    }
  };

  const getCurrentTotalRecords = () => {
    if (activeTab === "roles") {
      return RolesPermission?.total;
    } else {
      return data?.total;
    }
  };

  const handleTabChange = (eventKey: string | null) => {
    if (eventKey === "permissions") {
      setActiveTab("permissions");
    } else {
      setActiveTab("roles");
    }
  };

  return (
    <>
      <CommonModal
        title="Create New Permission"
        modalShow={modalShow}
        onModalHideClick={_toggleModal}
      >
        <PermissionsCreateUpdateForm setShowModal={_toggleModal} />
      </CommonModal>

      <div className="view-padding">
        <PageHeading
          title={activeTab === "roles" ? "Roles" : "Permissions"}
          description={
            activeTab === "roles"
              ? "Roles for your workflow"
              : "Permissions for your workflow"
          }
          onClick={activeTab === "permissions" ? _onCreateClick : undefined}
          totalRecords={getCurrentTotalRecords()}
          permissionReq={
            activeTab === "permissions" ? "create_permission" : undefined
          }
        />
      </div>
      <hr />
      <div className="h-100 p-0">
        {getCurrentLoading() ? (
          <IsLoading />
        ) : (
          <>
            {!getCurrentError() && (
              <ReactTable
                data={getCurrentData()}
                tabs={
                  <div className="d-flex justify-content-between">
                    <div>
                      <Nav
                        className="global-navs"
                        variant="tabs"
                        activeKey={activeTab}
                        onSelect={handleTabChange}
                      >
                        <Nav.Item>
                          <Nav.Link eventKey="roles">Roles</Nav.Link>
                        </Nav.Item>

                        <Nav.Item>
                          <Nav.Link eventKey="permissions">
                            Permissions
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </div>
                  </div>
                }
                columns={getCurrentColumns()}
                setSelectedRows={
                  activeTab === "permissions" ? setSelectedRows : undefined
                }
                filter={filter}
                onFilterChange={_onFilterChange}
                isDataLoading={getCurrentFetching()}
                isSelectable={activeTab === "permissions"}
              />
            )}
            {!getCurrentError() && getCurrentData()?.data?.length > 0 ? (
              <TablePagination
                currentPage={getCurrentData()?.current_page}
                lastPage={getCurrentData()?.last_page}
                setPage={_onFilterChange}
                hasNextPage={!!getCurrentData()?.next_page_url}
                hasPrevPage={!!getCurrentData()?.prev_page_url}
              />
            ) : null}
          </>
        )}
      </div>
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

export default Permissions;
