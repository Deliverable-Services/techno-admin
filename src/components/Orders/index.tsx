import { AxiosError } from "axios";
import { useContext } from "react";
import { useMemo, useState } from "react";
import {
  Button,
  Container,
  Dropdown,
  Nav,
} from "react-bootstrap";
import { BiSad } from "react-icons/bi";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import { IsDesktopContext } from "../../context/IsDesktopContext";
import { handleApiError } from "../../hooks/handleApiErrors";
import useOrderStoreFilter from "../../hooks/useOrderFilterStore";
import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import CustomBadge from "../../shared-components/CustomBadge";
import FilterSelect from "../../shared-components/FilterSelect";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import TableLink from "../../shared-components/TableLink";
import { areTwoObjEqual } from "../../utils/areTwoObjEqual";
import { OrderStatus, OrderType } from "../../utils/arrays";
import { primaryColor } from "../../utils/constants";
import { FaBoxes } from "react-icons/fa";
import { BsFunnel } from "react-icons/bs";
// import UpdateCreateForm from "./FaqsCreateUpdateForm"

const key = "bookings";
const intitialFilter = {
  page: null,
  perPage: 25,
  created_at: "",
  inside_cart: "0",
  q: "",
};
const Orders = () => {
  const history = useHistory();
  const isDesktop = useContext(IsDesktopContext);
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
        handleApiError(error, history);
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
        handleApiError(error, history);
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
        handleApiError(error, history);
      },
    }
  );

  const Status = ({ status }: { status: string }) => {
    const setVairant = () => {
      if (status === "subscription") return "primary";
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

  const _onOrderClick = (id: string) => {
    if (!id) return;
    history.push(`/orders/${id}`);
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
            <TableLink
              onClick={_onOrderClick}
              id={data.row.values.id}
              title={data.row.values["ref_id"]}
            />
          );
        },
        //accessor is the "key" in the data
      },
      {
        Header: "Customer",
        accessor: "user.name", //accessor is the "key" in the data
        Cell: (data: Cell) => {
          return (
            <TableLink
              onClick={_onUserClick}
              id={(data.row.original as any).user_id}
              title={data.row.values["user.name"]}
            />
          );
        },
      },
      {
        Header: "Agent",
        accessor: "agent.name",
        Cell: (data: Cell) => {
          return (
            <TableLink
              onClick={_onUserClick}
              id={(data.row.original as any).agent_id}
              title={data.row.values["agent.name"]}
            />
          );
        },
      },
      {
        Header: "Order Type",
        accessor: "order_type",
        Cell: (data: Cell) => <Status status={data.row.values.order_type} />,
      },
      {
        Header: "CRM Status",
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
      // {
      //   Header: "Paid Amount",
      //   accessor: "payable_amount",
      // },
      // {
      //   Header: "Payment Method",
      //   accessor: "payment_method",
      // },
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
      <div className="view-padding">
        <PageHeading
          title="Orders"
          description="Orders for your workflow"
          icon={<FaBoxes size={24} />}
          totalRecords={data?.total}
        />
      </div>
      <hr />
      <div className="h-100 p-0">
        <>
          {isLoading ? (
            <IsLoading />
          ) : (
            <>
              {!error && (
                <>
                  <ReactTable
                    data={data.data}
                    tabs={
                      <div className="d-flex justify-content-between">
                        {(!isLoading || !isFetching) && (
                          <Nav
                            className="global-navs"
                            variant="tabs"
                            activeKey={filter.status}
                            onSelect={(selectedKey) =>
                              onFilterChange("status", selectedKey)
                            }
                          >
                            <Nav.Item>
                              <Nav.Link eventKey="">
                                All ({data?.data?.length || 0})
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link eventKey="confirmed">
                                Confirmed (
                                {data?.data?.filter(
                                  (item) => item.status === "confirmed"
                                ).length || 0}
                                )
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link eventKey="fulfilled">
                                Fulfilled (
                                {data?.data?.filter(
                                  (item) => item.status === "fulfilled"
                                ).length || 0}
                                )
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link eventKey="picked">
                                Picked (
                                {data?.data?.filter(
                                  (item) => item.status === "picked"
                                ).length || 0}
                                )
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link eventKey="picked">
                                Pending (
                                {data?.data?.filter(
                                  (item) => item.status === "pending"
                                ).length || 0}
                                )
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link eventKey="pending_payment">
                                Pending Payment (
                                {data?.data?.filter(
                                  (item) => item.status === "pending_payment"
                                ).length || 0}
                                )
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link eventKey="error_payment">
                                Error Payment (
                                {data?.data?.filter(
                                  (item) => item.status === "error_payment"
                                ).length || 0}
                                )
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link eventKey="cancelled">
                                Cancelled (
                                {data?.data?.filter(
                                  (item) => item.status === "cancelled"
                                ).length || 0}
                                )
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link eventKey="failed">
                                Failed (
                                {data?.data?.filter(
                                  (item) => item.status === "failed"
                                ).length || 0}
                                )
                              </Nav.Link>
                            </Nav.Item>
                          </Nav>
                        )}
                      </div>
                    }
                    filters={
                      <Dropdown className="search-filters-div filter-dropdown mr-2">
                        <Dropdown.Toggle as={Button} variant="primary">
                          <BsFunnel /> Filters
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <div className="filter-dropdown-heading d-flex justify-content-between w-100">
                            <h4>Filter</h4>
                            <div className="d-flex align-items-center justify-md-content-center">
                              <Button
                                onClick={() => setFilter(intitialFilter)}
                                variant={
                                  areTwoObjEqual(intitialFilter, filter)
                                    ? "light"
                                    : "primary"
                                }
                                style={{
                                  fontSize: 14,
                                }}
                              >
                                Reset Filters
                              </Button>
                            </div>
                          </div>
                          <div className="select-filter">
                            <FilterSelect
                              currentValue={filter.user_id}
                              data={!isCustomerLoading && Customers.data}
                              label="Customer"
                              idx="user_id"
                              onFilterChange={onFilterChange}
                            />
                            <FilterSelect
                              currentValue={filter.agent_id}
                              data={!isAgentLoading && Agents.data}
                              label="Agents"
                              idx="agent_id"
                              onFilterChange={onFilterChange}
                            />
                            <FilterSelect
                              currentValue={filter.status}
                              data={OrderStatus}
                              label="Status"
                              idx="status"
                              onFilterChange={onFilterChange}
                            />
                            <FilterSelect
                              currentValue={filter.order_type}
                              data={OrderType}
                              label="Order Type"
                              idx="order_type"
                              onFilterChange={onFilterChange}
                            />
                          </div>
                        </Dropdown.Menu>
                      </Dropdown>
                    }
                    columns={columns}
                    setSelectedRows={setSelectedRows}
                    filter={filter}
                    onFilterChange={_onFilterChange}
                    isDataLoading={isFetching}
                    searchPlaceHolder="Search using ref_id"
                    isSelectable={false}
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
        </>
      </div>

      {/* {selectedRows.length > 0 && (
        <div className="delete-button ">
          <span>
            <b>Delete {selectedRows.length} rows</b>
          </span>
          <Button variant="danger">Delete</Button>
        </div>
      )} */}
    </>
  );
};

export default Orders;
