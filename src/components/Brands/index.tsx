import { AxiosError } from "axios";
import React, { useMemo, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { BiSad } from "react-icons/bi";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import { handleApiError } from "../../hooks/handleApiErrors";
import useUserProfileStore from "../../hooks/useUserProfileStore";
import BreadCrumb from "../../shared-components/BreadCrumb";
import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import EditButton from "../../shared-components/EditButton";
import IsActiveBadge from "../../shared-components/IsActiveBadge";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import TableImage from "../../shared-components/TableImage";
import TableLink from "../../shared-components/TableLink";
import API from "../../utils/API";
import {
  baseUploadUrl,
  clientWebUrl,
  primaryColor,
} from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";

const key = "brands";

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

const Brands = () => {
  const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const [filter, setFilter] = useState(intitialFilter);
  const { data, isLoading, isFetching, error } = useQuery<any>(
    [key, , filter],
    {
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

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
    history.push("/brands/create-edit");
  };
  const _onEditClick = (id: string) => {
    history.push("/brands/create-edit", { id });
  };
  const _onUrlClick = (data: Cell) => {
    window.open(clientWebUrl);
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
        Header: "#Id",
        accessor: "id", //accessor is the "key" in the data
      },
      {
        Header: "Logo",
        accessor: "logo",
        Cell: (data: Cell) => (
          <TableImage folder="brands" file={data.row.values.logo} />
        ),
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Url",
        accessor: "url",
        Cell: (data: Cell) => (
          <p
            className="text-primary m-0"
            style={{ cursor: "pointer" }}
            onClick={() => _onUrlClick(data)}
          >
            {data.row.values.url}
          </p>
        ),
      },
      {
        Header: "Is Active?",
        accessor: "is_active",
        Cell: (data: Cell) => {
          return <IsActiveBadge value={data.row.values.is_active} />;
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
            <EditButton
              onClick={() => {
                _onEditClick(data.row.values.id);
              }}
              permissionReq="update_brand"
            />
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
          title="Brands"
          onClick={_onCreateClick}
          totalRecords={data?.total}
          permissionReq="create_brand"
        />

        {!isLoading && (
          <Container fluid className="px-0">
            <div>
              <div className="filter">
                <BreadCrumb
                  onFilterChange={_onFilterChange}
                  value=""
                  currentValue={filter.active}
                  dataLength={data?.data?.length}
                  idx="active"
                  title="All"
                />
                <BreadCrumb
                  onFilterChange={_onFilterChange}
                  value="1"
                  currentValue={filter.active}
                  dataLength={data?.data?.length}
                  idx="active"
                  title="Active"
                />
                <BreadCrumb
                  onFilterChange={_onFilterChange}
                  value="0"
                  currentValue={filter.active}
                  dataLength={data?.data?.length}
                  idx="active"
                  title="Not Active"
                  isLast
                />
              </div>
            </div>
          </Container>
        )}
        <hr className="my-2" />
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
                  searchPlaceHolder="Search using brand name"
                  deletePermissionReq="delete_brand"
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

export default Brands;
