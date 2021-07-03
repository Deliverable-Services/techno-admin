import { useMemo, useState } from "react";
import { Badge, Button, Container, Modal, Spinner } from "react-bootstrap";
import { BiSad } from "react-icons/bi";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import BreadCrumb from "../../shared-components/BreadCrumb";
import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import CustomBadge from "../../shared-components/CustomBadge";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import API from "../../utils/API";
import { primaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showErrorToast } from "../../utils/showErrorToast";

const key = "tickets";
const intitialFilter = {
  q: "",
  page: null,
  perPage: 25,
  status: "active",
};

const Issues = () => {
  const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const [filter, setFilter] = useState(intitialFilter);
  const { data, isLoading, isFetching, error } = useQuery<any>(
    [key, , filter],
    {
      onError: (err: any) => {
        showErrorToast(err.response.data.message);
      },
    }
  );

  const _onUserClick = (id: string) => {
    if (!id) return;
    history.push("/users/create-edit", { id });
  };
  const Status = ({ status }: { status: string }) => {
    const setVairant = () => {
      if (status === "closed") return "danger";

      return "success";
    };
    return <CustomBadge variant={setVairant()} title={status} />;
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
        Header: "Reference Id",
        accessor: "ref_id", //accessor is the "key" in the data
      },
      {
        Header: "Related to",
        accessor: "related_to", //accessor is the "key" in the data
      },
      {
        Header: "Issue Status",
        accessor: "status",
        Cell: (data: Cell) => <Status status={data.row.values.status} />,
      },
      {
        Header: "Raised by",
        accessor: "user.name", //accessor is the "key" in the data
        Cell: (data: Cell) => {
          if ((data.row.original as any).user_id)
            return (
              <p
                className="text-primary m-0"
                style={{ cursor: "pointer" }}
                onClick={() => _onUserClick((data.row.original as any).user_id)}
              >
                {data.row.values["user.name"]}
              </p>
            );
          else return "NA";
        },
      },
      {
        Header: "Order Id",
        accessor: "order.id", //accessor is the "key" in the data
      },
      {
        Header: "Created At",
        accessor: "created_at",
        Cell: (data: Cell) => (
          <CreatedUpdatedAt date={data.row.values.created_at} />
        ),
      },
      {
        Header: "Updated At",
        accessor: "updated_at",
        Cell: (data: Cell) => (
          <CreatedUpdatedAt date={data.row.values.updated_at} />
        ),
      },
      {
        Header: "Actions",
        Cell: (data: Cell) => {
          return (
            <div className="d-flex">
              <Button
                onClick={() => history.push(`/issues/${data.row.values.id}`)}
              >
                View
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
      <PageHeading title="Issues" totalRecords={50} />
      {!isLoading && (
        <Container fluid>
          <div>
            <div className="filter">
              <BreadCrumb
                onFilterChange={_onFilterChange}
                value="active"
                currentValue={filter.status}
                dataLength={data?.data?.length}
                idx="status"
                title="Active"
              />
              <BreadCrumb
                onFilterChange={_onFilterChange}
                value="closed"
                currentValue={filter.status}
                dataLength={data?.data?.length}
                idx="status"
                title="Closed"
              />
            </div>
          </div>
        </Container>
      )}
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
              {!error && data.length > 0 ? (
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
          <Button variant="danger">Delete</Button>
        </div>
      )}
    </>
  );
};

export default Issues;
