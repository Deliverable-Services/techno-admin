import { AxiosError } from "axios";
import React, { useMemo, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { BiSad } from "react-icons/bi";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import { handleApiError } from "../../hooks/handleApiErrors";
import BreadCrumb from "../../shared-components/BreadCrumb";
import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import EditButton from "../../shared-components/EditButton";
import IsActiveBadge from "../../shared-components/IsActiveBadge";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import API from "../../utils/API";
import {
  baseUploadUrl,
  clientWebUrl,
  primaryColor,
} from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";

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
  } = useQuery<any>([key, , filter], {
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const { mutate, isLoading: isDeleteLoading } = useMutation(deleteBrand, {
    onSuccess: () => {
      queryClient.invalidateQueries(key);
      showMsgToast("Brands deleted successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const _onCreateClick = () => {
    history.push("/permissions/create-edit");
  };
  const _onRolesCreateClick = () => {
    history.push("/assign-permission/create-edit");
  };
  const _onEditClick = (id: string) => {
    history.push("/permissions/create-edit", { id });
  };
  const _onRolesEditClick = (id: string) => {
    history.push("/assign-pemission/create-edit", { id });
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
        accessor: "role",
      },
      {
        Header: "Permissions",
        accessor: "permissions",
      },
      {
        Header: "Actions",
        Cell: (data: Cell) => {
          return (
            <EditButton
              onClick={() => {
                _onRolesEditClick(data.row.values.id);
              }}
            />
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

  return (
    <>
      <PageHeading
        title="Assign Permission"
        onClick={_onRolesCreateClick}
        totalRecords={data?.total}
      />

      <Container fluid className="card component-wrapper px-0 py-2 mb-3">
        <Container fluid className="h-100 p-0">
          {isRolesPermissionLoading ? (
            <IsLoading />
          ) : (
            <>
              {!error && (
                <ReactTable
                  data={RolesPermission}
                  columns={columns}
                  filter={filter}
                  onFilterChange={_onFilterChange}
                  isDataLoading={isRolesPermissoinFetch}
                />
              )}
            </>
          )}
        </Container>
      </Container>

      <PageHeading
        title="Permissions"
        onClick={_onCreateClick}
        totalRecords={data?.total}
      />

      <Container fluid className="card component-wrapper px-0 py-2">
        <Container fluid className="h-100 p-0">
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
        </Container>
      </Container>
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
