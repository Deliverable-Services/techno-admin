import { AxiosError } from "axios";
import moment from "moment";
import { useMemo, useState } from "react";
import { Badge, Button, Col, Container, Form, Row } from "react-bootstrap";
import { BiSad } from "react-icons/bi";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import { handleApiError } from "../../hooks/handleApiErrors";
import useOrderStoreFilter, { INITIAL_FILTER } from "../../hooks/useOrderFilterStore";
import BreadCrumb from "../../shared-components/BreadCrumb";
import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import CustomBadge from "../../shared-components/CustomBadge";
import FilterSelect from "../../shared-components/FilterSelect";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import { IInitialTableState } from "../../types/interface";
import { areTwoObjEqual } from "../../utils/areTwoObjEqual";
import { InsideCart, OrderType, RowsPerPage } from "../../utils/arrays";
import { primaryColor } from "../../utils/constants";
import { showErrorToast } from "../../utils/showErrorToast";
// import UpdateCreateForm from "./FaqsCreateUpdateForm"

const key = "bookings";
const intitialFilter = {
  q: "",
  page: null,
  perPage: 25,
  created_at: ""
};
const Orders = () => {
  const history = useHistory();
  const [page, setPage] = useState<number>(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [localFilter, setFilter] = useState(intitialFilter);
  const filter = useOrderStoreFilter((state) => state.filter);
  const onFilterChange = useOrderStoreFilter((state) => state.onFilterChange);
  const resetFilter = useOrderStoreFilter((state) => state.resetFilter);
  const { data, isLoading, isFetching, error } = useQuery<any>(
    [key, , { ...filter, ...localFilter }],
    {
      onError: (error: AxiosError) => {
        handleApiError(error, history)
      },
    }
  );
  const { data: Customers, isLoading: isCustomerLoading } = useQuery<any>(
    [
      "users",
      1,
      {
        role: "customer",
      },
    ],
    {
      onError: (error: AxiosError) => {
        handleApiError(error, history)
      },
    }
  );
  const { data: Agents, isLoading: isAgentLoading } = useQuery<any>(
    [
      "users",
      1,
      {
        role: "agent",
      },
    ],
    {
      onError: (error: AxiosError) => {
        handleApiError(error, history)
      },
    }
  );

  const Status = ({ status }: { status: string }) => {
    const setVairant = () => {
      if (status === "cancelled" || status === "error_payment") return "danger";

      if (status === "pending" || status === "pending_payment")
        return "warning";

      return "success";
    };
    return <CustomBadge variant={setVairant()} title={status} />;
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
        Header: "Ref Id",
        accessor: "ref_id",
        Cell: (data: Cell) => {
          return (
            <p
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => history.push(`/orders/${data.row.values.id}`)}
            >
              {data.row.values["ref_id"]}
            </p>
          );
        },
        //accessor is the "key" in the data
      },
      {
        Header: "Customer",
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
        Header: "Agent",
        accessor: "agent.name",
        Cell: (data: Cell) => {
          if ((data.row.original as any).agent_id)
            return (
              <p
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  _onUserClick((data.row.original as any).agent_id)
                }
              >
                {data.row.values["agent.name"]}
              </p>
            );
          else return "NA";
        },
      },
      {
        Header: "Order Type",
        accessor: "order_type",
        Cell: (data: Cell) => <Status status={data.row.values.order_type} />,
      },
      {
        Header: "Order Status",
        accessor: "status",
        Cell: (data: Cell) => <Status status={data.row.values.status} />,
      },
      {
        Header: "Scheduled At",
        accessor: "scheduled_at",
        Cell: (data: Cell) => (
          <CreatedUpdatedAt date={data.row.values.scheduled_at} />
        ),
      },
      {
        Header: "Inside Cart",
        accessor: "inside_cart",
      },
      {
        Header: "Paid Amount",
        accessor: "payable_amount",
      },
      {
        Header: "Rating",
        accessor: "rating",
      },
      {
        Header: "Created At",
        accessor: "created_at",
        Cell: (data: Cell) => (
          <CreatedUpdatedAt date={data.row.values.created_at} />
        ),
      },
      {
        Header: "Actions",
        Cell: (data: Cell) => {
          return (
            <div className="d-flex">
              <Button
                onClick={() => history.push(`/orders/${data.row.values.id}`)}
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
      <PageHeading title="Orders" totalRecords={data?.total} />

      {(!isLoading || !isFetching) && (
        <div className="filter mb-4">
          <BreadCrumb
            onFilterChange={onFilterChange}
            value=""
            currentValue={filter.status}
            dataLength={data?.data?.length}
            idx="status"
            title="All"
          />
          <BreadCrumb
            onFilterChange={onFilterChange}
            value="success"
            currentValue={filter.status}
            dataLength={data?.data?.length}
            idx="status"
            title="Success"
          />
          <BreadCrumb
            onFilterChange={onFilterChange}
            value="pending"
            currentValue={filter.status}
            dataLength={data?.data?.length}
            idx="status"
            title="Pending"
          />
          <BreadCrumb
            onFilterChange={onFilterChange}
            value="error_payment"
            currentValue={filter.status}
            dataLength={data?.data?.length}
            idx="status"
            title="Payment Errors"
          />
          <BreadCrumb
            onFilterChange={onFilterChange}
            value="failed"
            currentValue={filter.status}
            dataLength={data?.data?.length}
            idx="status"
            title="Failed"
            isLast
          />
        </div>
      )}

      <Container fluid className="card component-wrapper px-0 py-2">
        <Container fluid className="h-100 p-0">
          <>
            {isLoading ? (
              <IsLoading />
            ) : (
              <>
                {!error && (
                  <>
                    <Container className="pt-2">
                      <Row className="select-filter d-flex">
                        <Col md="auto">
                          <FilterSelect
                            currentValue={filter.user_id}
                            data={!isCustomerLoading && Customers.data}
                            label="Customer"
                            idx="user_id"
                            onFilterChange={onFilterChange}
                          />
                        </Col>
                        <Col md="auto">
                          <FilterSelect
                            currentValue={filter.agent_id}
                            data={!isAgentLoading && Agents.data}
                            label="Agents"
                            idx="agent_id"
                            onFilterChange={onFilterChange}
                          />
                        </Col>
                        <Col md="auto">
                          <FilterSelect
                            currentValue={filter.inside_cart}
                            data={InsideCart}
                            label="Inside Cart"
                            idx="inside_cart"
                            width="80px"
                            onFilterChange={onFilterChange}
                          />
                        </Col>
                        <Col md="auto">
                          <FilterSelect
                            currentValue={filter.order_type}
                            data={OrderType}
                            label="Order Type"
                            idx="order_type"
                            onFilterChange={onFilterChange}
                          />
                        </Col>
                        <Col md="auto">
                          <Form.Group>
                            <Form.Label className="text-muted">Ordered At</Form.Label>
                            <Form.Control type="date"
                              value={localFilter.created_at}
                              onChange={e => {
                                const value = moment(e.target.value).format("YYYY-MM-DD")
                                _onFilterChange("created_at", value)
                              }}
                              style={{
                                fontSize: 14,
                                width: 150,
                                height: 35

                              }}
                            />
                          </Form.Group>
                        </Col>

                        <Col
                          md="auto"
                          className="d-flex align-items-center mt-1 justify-content-center"
                        >
                          <Button
                            onClick={() => {
                              resetFilter()

                              setFilter(intitialFilter)

                            }}
                            variant={areTwoObjEqual({ ...intitialFilter, ...INITIAL_FILTER }, { ...localFilter, ...filter }) ? "light" : "primary"}
                            style={{
                              // backgroundColor: "#eee",
                              fontSize: 14,
                            }}
                          >
                            Reset Filters
                          </Button>
                        </Col>
                      </Row>
                    </Container>
                    <hr />
                    <ReactTable
                      data={data.data}
                      columns={columns}
                      setSelectedRows={setSelectedRows}
                      filter={filter}
                      onFilterChange={_onFilterChange}
                      isDataLoading={isFetching}
                    />
                  </>
                )}
                {!error && data.length > 0 ? (
                  <TablePagination
                    currentPage={data?.current_page}
                    lastPage={data?.last_page}
                    setPage={setPage}
                    hasNextPage={!!data?.next_page_url}
                    hasPrevPage={!!data?.prev_page_url}
                  />
                ) : null}{" "}
              </>
            )}
          </>
        </Container>
      </Container>
      {selectedRows.length > 0 && (
        <div className="delete-button ">
          <span>
            <b>Delete {selectedRows.length} rows</b>
          </span>
          <Button variant="danger">Delete</Button>
        </div>
      )}
    </>
  );
};

export default Orders;
