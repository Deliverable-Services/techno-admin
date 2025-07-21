import { AxiosError } from "axios";
import moment from "moment";
import { useMemo, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { BiSad } from "react-icons/bi";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import { handleApiError } from "../../hooks/handleApiErrors";
import { INITIAL_FILTER } from "../../hooks/useOrderFilterStore";
import BreadCrumb from "../../shared-components/BreadCrumb";
import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import CustomBadge from "../../shared-components/CustomBadge";
import FilterSelect from "../../shared-components/FilterSelect";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import { areTwoObjEqual } from "../../utils/areTwoObjEqual";
import { IssueRelatedTo, OrderType } from "../../utils/arrays";
import { primaryColor } from "../../utils/constants";
import { showErrorToast } from "../../utils/showErrorToast";

const key = "tickets";
const intitialFilter = {
  q: "",
  page: null,
  perPage: 25,
  status: "active",
  user_id: "",
  related_to: "",
  created_at: "",
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

  console.log(data, "data");

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
  const _onUserClick = (id: string) => {
    if (!id) return;
    history.push("/users/create-edit", { id });
  };
  const _onOrderClick = (id: string) => {
    if (!id) return;
    history.push(`/orders/${id}`);
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
        Header: "Title",
        accessor: "title", //accessor is the "key" in the data
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
                classname="text-darkGray m-0" 
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
        accessor: "order.ref_id", //accessor is the "key" in the data
        Cell: (data: Cell) => {
          if ((data.row.original as any).order_id)
            return (
              <p
                classname="text-darkGray m-0" 
                style={{ cursor: "pointer" }}
                onClick={() =>
                  _onOrderClick((data.row.original as any).order_id)
                }
              >
                {data.row.values["order.ref_id"]}
              </p>
            );
          else return "NA";
        },
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
      <Container fluid className="card component-wrapper view-padding">
        <PageHeading title="Issues" totalRecords={data?.total} />
        {!isLoading && (
          <Container fluid className="px-0">
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
                  isLast
                />
              </div>
            </div>
          </Container>
        )}
        <hr className="mt-2" />
        <Container fluid className="h-100 p-0">
          {isLoading ? (
            <IsLoading />
          ) : (
            <>
              {!error && (
                <>
                  <Container fluid className="pt-2 px-0">
                    <Row className="select-filter d-flex  ">
                      <Col md="auto">
                        <FilterSelect
                          currentValue={filter.user_id}
                          data={!isCustomerLoading && Customers.data}
                          label="Customer"
                          idx="user_id"
                          onFilterChange={_onFilterChange}
                        />
                      </Col>
                      {/* <Col md="auto">
                          <FilterSelect
                            currentValue={filter.inside_cart}
                            data={InsideCart}
                            label="Inside Cart"
                            idx="inside_cart"
                            width="80px"
                            onFilterChange={onFilterChange}
                          />
                        </Col> */}
                      <Col md="auto">
                        <FilterSelect
                          currentValue={filter.related_to}
                          data={IssueRelatedTo}
                          label="Related to"
                          idx="related_to"
                          onFilterChange={_onFilterChange}
                        />
                      </Col>
                      <Col md="auto">
                        <Form.Group>
                          <Form.Label className="text-muted">
                            Raised At
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
                      </Col>

                      <Col
                        md="auto"
                        className="d-flex align-items-center justify-md-content-center"
                      >
                        <Button
                        className="mt-27px"
                          onClick={() => {
                            setFilter(intitialFilter);
                          }}
                          variant={
                            areTwoObjEqual(intitialFilter, filter)
                              ? "light"
                              : "primary"
                          }
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
                  <hr className="mt-2" />
                  <ReactTable
                    data={data?.data}
                    columns={columns}
                    setSelectedRows={setSelectedRows}
                    filter={filter}
                    onFilterChange={_onFilterChange}
                    isDataLoading={isFetching}
                    isSelectable={false}
                    searchPlaceHolder="Search using title,ref_id"
                  />
                </>
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
