import { AxiosError } from "axios";
import moment from "moment";
import { useMemo, useState } from "react";
import { Button, Col, Container, Dropdown, Form, Row } from "react-bootstrap";
import { BiSad } from "react-icons/bi";
import { BsFunnel } from "react-icons/bs";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import { handleApiError } from "../../hooks/handleApiErrors";
import BreadCrumb from "../../shared-components/BreadCrumb";
import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import CustomBadge from "../../shared-components/CustomBadge";
import FilterSelect from "../../shared-components/FilterSelect";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import { areTwoObjEqual } from "../../utils/areTwoObjEqual";
import { InsideCart } from "../../utils/arrays";
import { primaryColor } from "../../utils/constants";

const key = "user-subscriptions";
const intitialFilter = {
  q: "",
  page: null,
  perPage: 25,
  plan_id: "",
  status: "active",
  allowed_usage: "",
  created_at: "",
  user_id: "",
  last_used_at: "",
};

const Subscription = () => {
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

  const { data: Plans, isLoading: isPlansLoading } = useQuery<any>(["plans"]);
  const { data: Customers, isLoading: isCustomersLoading } = useQuery<any>([
    "users",
    ,
    {},
  ]);
  const Status = ({ status }: { status: string }) => {
    const setVariant = () => {
      if (status === "active") return "success";

      return "danger";
    };
    return <CustomBadge title={status} variant={setVariant()} />;
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
        Header: "Razorpay Id",
        accessor: "razerpay_order_id", //accessor is the "key" in the data
      },
      {
        Header: "User Name",
        accessor: "user.name", //accessor is the "key" in the data
        Cell: (data: Cell) => {
          return (
            <p
              classname="text-darkGray m-0"
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
              classname="text-darkGray m-0"
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

      {
        Header: "Actions",
        Cell: (data: Cell) => {
          return (
            <div className="d-flex">
              <Button
                onClick={() =>
                  history.push(`/subscriptions/${data.row.values.id}`)
                }
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
      <Container fluid className="component-wrapper view-padding">
        <PageHeading title="Subscriptions" totalRecords={data?.total} />

        {(!isLoading || !isFetching) && (
          <div className="filter my-2">
            {/* <BreadCrumb
            onFilterChange={_onFilterChange}
            value=""
            currentValue={filter.status}
            dataLength={data?.data?.length}
            idx="status"
            title="All"
          /> */}
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
              value="expired"
              currentValue={filter.status}
              dataLength={data?.data?.length}
              idx="status"
              title="Expired"
              isLast
            />
          </div>
        )}
        <hr />
        <Container fluid className="h-100 p-0">
          {isLoading ? (
            <IsLoading />
          ) : (
            <>
              <Container fluid className="px-0 pt-3 pb-2">
                <div className="d-flex align-items-center justify-content-end">
                  <div style={{ minWidth: "300px" }}>
                    <Form.Control
                      type="text"
                      placeholder="Search by Razorpay ID, Usage, Transaction ID"
                      value={filter.q}
                      onChange={(e) => _onFilterChange("q", e.target.value)}
                      style={{ fontSize: 14, height: 44 }}
                      className="global-card"
                    />
                  </div>
                  <div className="ml-3">
                    <Dropdown className="filter-dropdown">
                      <Dropdown.Toggle as={Button} variant="primary" className="global-card">
                        <BsFunnel /> Filters
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <div className="filter-dropdown-heading d-flex justify-content-between w-100">
                          <h4>Filter</h4>
                          <div
                            className="d-flex align-items-center justify-md-content-center"
                          >
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
                          <div>
                            <FilterSelect
                              currentValue={filter.user_id}
                              data={!isCustomersLoading && Customers.data}
                              label="User"
                              idx="user_id"
                              onFilterChange={_onFilterChange}
                            />
                          </div>
                          <div>
                            <FilterSelect
                              currentValue={filter.plan_id}
                              data={!isPlansLoading && Plans.data}
                              label="Plan"
                              idx="plan_id"
                              onFilterChange={_onFilterChange}
                            />
                          </div>
                          <div>
                            <FilterSelect
                              currentValue={filter.allowed_usage}
                              data={InsideCart}
                              label="Allowed Usage"
                              idx="allowed_usage"
                              onFilterChange={_onFilterChange}
                            />
                          </div>

                          <div>
                            <Form.Group>
                              <Form.Label className="text-muted">
                                Purchased on
                              </Form.Label>
                              <Form.Control
                                type="date"
                                value={filter.created_at}
                                onChange={(e) => {
                                  const value = moment(e.target.value).format(
                                    "YYYY-MM-DD"
                                  );
                                  _onFilterChange("created_at", value);
                                }}
                                style={{
                                  fontSize: 14,
                                  width: 150,
                                  height: 35,
                                }}
                              />
                            </Form.Group>
                          </div>
                          <div>
                            <Form.Group>
                              <Form.Label className="text-muted">
                                Last used at
                              </Form.Label>
                              <Form.Control
                                type="date"
                                value={filter.last_used_at}
                                onChange={(e) => {
                                  const value = moment(e.target.value).format(
                                    "YYYY-MM-DD"
                                  );
                                  _onFilterChange("last_used_at", value);
                                }}
                                style={{
                                  fontSize: 14,
                                  width: 150,
                                  height: 35,
                                }}
                              />
                            </Form.Group>
                          </div>
                          
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              </Container>
              <div className="mt-2" />
              {!error && (
                <ReactTable
                  data={data?.data}
                  columns={columns}
                  setSelectedRows={setSelectedRows}
                  filter={filter}
                  onFilterChange={_onFilterChange}
                  isDataLoading={isFetching}
                  isSelectable={false}
                  showSearch={false}
                // searchPlaceHolder="Search using rzr order id, allowed usage, transaction id"
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
          <Button variant="danger">Delete</Button>
        </div>
      )}
    </>
  );
};

export default Subscription;
