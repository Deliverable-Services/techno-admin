// Permissions/index.tsx


import { AxiosError } from "axios";
import React, { useMemo, useState } from "react";
import { Button, Container } from "react-bootstrap";
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
import Roles from "../Roles";
import { CommonModal } from "../CommonPopup/CommonModal";
import PermissionsCreateUpdateForm from "./PermissoinsCreateUpdateForm";

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
  console.log(selectedRows.map((item) => item.id));
  const [filter, setFilter] = useState(intitialFilter);
  console.log({ filter });
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
            </div>
          );
        },
      },
    ],
    []
  );
  const permissionColumn = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        Cell: (data: Cell) => {
          return <span>{data.row.values.name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>;
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
  }

  return (
    <>
    <CommonModal title="Create New Permission" modalShow={modalShow} onModalHideClick={_toggleModal}>
      <PermissionsCreateUpdateForm setShowModal={_toggleModal} />
    </CommonModal>
      <Roles />

      <div className="view-padding mb-3 mt-5">
        <PageHeading title="Assign Permission" />
      </div>
      <hr />
      <div className="h-100 p-0">
        {isRolesPermissionLoading ? (
          <IsLoading />
        ) : (
          <>
            {!error && (
              <ReactTable
                data={RolesPermission?.role}
                columns={columns}
                filter={filter}
                onFilterChange={_onFilterChange}
                isDataLoading={isRolesPermissoinFetch}
                isSelectable={false}
              />
            )}
          </>
        )}
      </div>

      <div className="view-padding mt-3">
        <PageHeading
          title="Permissions"
          onClick={_onCreateClick}
          totalRecords={data?.total}
          permissionReq="create_permission"
        />
      </div>
      <hr />
      <div className="h-100 p-0">
        {isLoading ? (
          <IsLoading />
        ) : (
          <>
            {!error && (
              <ReactTable
                data={data}
                columns={permissionColumn}
                setSelectedRows={setSelectedRows}
                filter={filter}
                onFilterChange={_onFilterChange}
                isDataLoading={isFetching}
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
