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
  const _onUserClick = (id: string) => {
    if (!id) return;
    history.push("/users/create-edit", { id });
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
        Header: "Picture",
        accessor: "picture",
        Cell: (data: Cell) => (
          <div className="table-image">
            <img
              src={`${baseUploadUrl}profile_pic/${data.row.values.picture}`}
              alt={data.row.values.picture}
            />
          </div>
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
        Header: "User",
        accessor: "user.name",
        Cell: (data: Cell) => {
          return (
            <p
              className="text-primary m-0"
              style={{ cursor: "pointer" }}
              onClick={() => _onUserClick((data.row.original as any).user_id)}
            >
              {data.row.values["user.name"] || "NA"}
            </p>
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
            <EditButton
              onClick={() => {
                _onEditClick(data.row.values.id);
              }}
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
      <PageHeading
        title="Testimonials"
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
                  data={data?.data}
                  columns={columns}
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

export default Testimonial;
