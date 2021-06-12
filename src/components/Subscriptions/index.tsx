import { AxiosError } from "axios";
import { useMemo, useState } from "react";
import { Badge, Button, Container, Row, Col } from "react-bootstrap";
import { BiSad } from "react-icons/bi";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import { handleApiError } from "../../hooks/handleApiErrors";
import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import { primaryColor } from "../../utils/constants";
import { showErrorToast } from "../../utils/showErrorToast";
import BreadCrumb from "../../shared-components/BreadCrumb";
import FilterSelect from "../../shared-components/FilterSelect";

const key = "user-subscriptions";
const intitialFilter = {
  q: "",
  page: null,
  perPage: 25,
};

const Subscription = () => {
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
  const Status = ({ status }: { status: string }) => {
    const setVariant = () => {
      if (status === "active") return "success";

      return "danger";
    };
    return (
      <Badge variant={setVariant()} className="p-1">
        {status.toUpperCase()}
      </Badge>
    );
  };

  const _onPlanClick = (id: string) => {
    if (!id) return;
    history.push("/plans/create-edit", { id });
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
        Header: "User Name",
        accessor: "user.name", //accessor is the "key" in the data
        Cell: (data: Cell) => {
          return (
            <p
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => _onUserClick((data.row.original as any).user_id)}
            >
              {data.row.values["user.name"]}
            </p>
          );
        },
      },
      {
        Header: "Plan ID",
        accessor: "plan.name", //accessor is the "key" in the data
        Cell: (data: Cell) => {
          return (
            <p
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => _onPlanClick((data.row.original as any).plan_id)}
            >
              {data.row.values["plan.name"]}
            </p>
          );
        },
      },
      {
        Header: "Allowed Usage",
        accessor: "allowed_usage", //accessor is the "key" in the data
      },
      {
        Header: "Status",
        accessor: "status", //accessor is the "key" in the data
        Cell: (data: Cell) => <Status status={data.row.values.status} />,
      },
      {
        Header: "Transaction Id",
        accessor: "transaction_id", //accessor is the "key" in the data
      },
      {
        Header: "No. Times Used",
        accessor: "used", //accessor is the "key" in the data
      },
      {
        Header: "Last Used",
        accessor: "last_used_at",
        Cell: (data: Cell) => {
          return <CreatedUpdatedAt date={data.row.values.last_used_at} />;
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

      // {
      //   Header: "Actions",
      //   Cell: (data: Cell) => {
      //     return (
      //       <div className="d-flex">
      //         <Button
      //           onClick={() => history.push(`/subscriptions/${data.row.values.id}`)}
      //         >
      //           View
      //         </Button>
      //       </div>
      //     );
      //   },
      // },
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
      <PageHeading title="Subscriptions" totalRecords={500} />

      {(!isLoading || !isFetching) && (
        <div className="filter mb-4">
          {/* <BreadCrumb
            // onFilterChange={onFilterChange}
            value=""
            currentValue={filter.status}
            dataLength={data?.data?.length}
            idx="status"
            title="All"
          />
          <BreadCrumb
            // onFilterChange={onFilterChange}
            value="Active"
            currentValue={filter.status}
            dataLength={data?.data?.length}
            idx="status"
            title="Active"
          />
          <BreadCrumb
            // onFilterChange={onFilterChange}
            value="Expired"
            currentValue={filter.status}
            dataLength={data?.data?.length}
            idx="status"
            title="Expired"
          /> */}
        </div>
      )}

      <Container fluid className="card component-wrapper px-0 py-2">
        <Container fluid className="h-100 p-0">
          {isLoading ? (
            <IsLoading />
          ) : (
            <>
              <Container className="pt-2">
                <Row className="select-filter d-flex">
                  {/* <Col md="auto">
                    <FilterSelect
                      // currentValue={filter.user_id}
                      // data={!isCustomerLoading && Customers.data}
                      label="Customer"
                      idx="user_id"
                      // onFilterChange={onFilterChange}
                    />
                  </Col>
                  <Col md="auto">
                    <FilterSelect
                      // currentValue={filter.agent_id}
                      // data={!isAgentLoading && Agents.data}
                      label="Plan"
                      idx="agent_id"
                      // onFilterChange={onFilterChange}
                    />
                  </Col>
                  <Col md="auto">
                    <FilterSelect
                      // currentValue={filter.inside_cart}
                      // data={InsideCart}
                      label="Purchased on"
                      idx="inside_cart"
                      // onFilterChange={onFilterChange}
                    />
                  </Col> */}

                  <Col
                    md="auto"
                    className="d-flex align-items-center mt-1 justify-content-center"
                  >
                    <Button
                      // onClick={() => resetFilter()}
                      variant="light"
                      style={{
                        backgroundColor: "#eee",
                        fontSize: 14,
                      }}
                    >
                      Reset Filters
                    </Button>
                  </Col>
                </Row>
              </Container>
              <hr />
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

export default Subscription;
