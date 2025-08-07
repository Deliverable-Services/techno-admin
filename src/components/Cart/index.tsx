import { AxiosError } from "axios";
import moment from "moment";
import { useMemo, useState } from "react";
import { Button, Col, Container, Dropdown, Form, Nav, Row } from "react-bootstrap";
import { BiSad } from "react-icons/bi";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import { handleApiError } from "../../hooks/handleApiErrors";
import useOrderStoreFilter, {
  INITIAL_FILTER,
} from "../../hooks/useOrderFilterStore";
import BreadCrumb from "../../shared-components/BreadCrumb";
import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import CustomBadge from "../../shared-components/CustomBadge";
import FilterSelect from "../../shared-components/FilterSelect";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import TableLink from "../../shared-components/TableLink";
import { areTwoObjEqual } from "../../utils/areTwoObjEqual";
import { OrderType } from "../../utils/arrays";
import { primaryColor } from "../../utils/constants";
import { BsEye, BsFunnel } from "react-icons/bs";
// import UpdateCreateForm from "./FaqsCreateUpdateForm"

const key = "bookings";
const intitialFilter = {
  q: "",
  page: null,
  perPage: 25,
  created_at: "",
  inside_cart: "1",
};
const InsideCart = () => {
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
            <div className="d-flex justify-content-end">
              <BsEye style={{ cursor: "pointer" }} onClick={() => history.push(`/orders/${data.row.values.id}`)} />
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
        <PageHeading title="Inside Cart" description="Track all your payments at once glance" totalRecords={data?.total} />
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
                        {!isLoading && (
                          <div>
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
                                <Nav.Link eventKey="success">
                                  Success (
                                  {data?.data?.filter(
                                    (item) => item.status === "success"
                                  ).length || 0}
                                  )
                                </Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                <Nav.Link eventKey="pending">
                                  Pending (
                                  {data?.data?.filter(
                                    (item) => item.status === "pending"
                                  ).length || 0}
                                  )
                                </Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                <Nav.Link eventKey="error_payment">
                                  Payment Errors (
                                  {data?.data?.filter(
                                    (item) => item.status === "error_payment"
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
                          </div>
                        )}
                      </div>
                    }
                    columns={columns}
                    filters={
                      <Dropdown className="search-filters-div filter-dropdown mr-2">
                        <Dropdown.Toggle as={Button} variant="primary">
                          <BsFunnel className="mr-2" />
                          Filters
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <div className="filter-dropdown-heading d-flex justify-content-between w-100">
                            <h4>Filter</h4>
                            <div className="d-flex align-items-center justify-md-content-center">
                              <Button
                                onClick={() => resetFilter()}
                                variant={
                                  areTwoObjEqual(
                                    {
                                      ...intitialFilter,
                                      ...INITIAL_FILTER,
                                    },
                                    { ...localFilter, ...filter }
                                  )
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
                    setSelectedRows={setSelectedRows}
                    filter={filter}
                    onFilterChange={_onFilterChange}
                    isDataLoading={isFetching}
                    isSelectable={false}
                    searchPlaceHolder="Search using ref_id"
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

export default InsideCart;
