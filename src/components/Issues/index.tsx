import { AxiosError } from "axios";
import moment from "moment";
import { useMemo, useState } from "react";
import {
  Button,
  Container,
  Dropdown,
  Form,
  Nav,
} from "react-bootstrap";
import { BiSad } from "react-icons/bi";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import { handleApiError } from "../../hooks/handleApiErrors";
import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import CustomBadge from "../../shared-components/CustomBadge";
import FilterSelect from "../../shared-components/FilterSelect";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import { areTwoObjEqual } from "../../utils/areTwoObjEqual";
import { IssueRelatedTo } from "../../utils/arrays";
import { primaryColor } from "../../utils/constants";
import { showErrorToast } from "../../utils/showErrorToast";
import { BsEye, BsFunnel } from "react-icons/bs";
import { GoIssueOpened } from "react-icons/go";
import IssuesCreateForm from "./IssuesCreateForm";
import Flyout from "../../shared-components/Flyout"; // ✅ Import your shared Flyout

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
  const [modalShow, setModalShow] = useState(false);

  const { data, isLoading, isFetching, error } = useQuery<any>(
    [key, , filter],
    {
      onError: (err: any) => {
        showErrorToast(err.response.data.message);
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

  const _onUserClick = (id: string) => {
    if (!id) return;
    history.push("/users/create-edit", { id });
  };

  const _onOrderClick = (id: string) => {
    if (!id) return;
    history.push(`/orders/${id}`);
  };

  const _onModalHideClick = () => {
    setModalShow(false);
  };

  const Status = ({ status }: { status: string }) => {
    const setVariant = () => {
      if (status === "closed") return "danger";
      return "success";
    };
    return <CustomBadge variant={setVariant()} title={status} />;
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
        accessor: "id",
      },
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Reference Id",
        accessor: "ref_id",
      },
      {
        Header: "Related to",
        accessor: "related_to",
      },
      {
        Header: "Issue Status",
        accessor: "status",
        Cell: (data: Cell) => <Status status={data.row.values.status} />,
      },
      {
        Header: "Raised by",
        accessor: "user.name",
        Cell: (data: Cell) => {
          if ((data.row.original as any).user_id)
            return (
              <p
                className="text-darkGray m-0"
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
        accessor: "order.ref_id",
        Cell: (data: Cell) => {
          if ((data.row.original as any).order_id)
            return (
              <p
                className="text-darkGray m-0"
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
            <div className="d-flex align-items-center justify-content-end">
              <BsEye
                className="cursor-pointer"
                onClick={() =>
                  history.push(`/issues/${data.row.values.id}`)
                }
              />
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
          icon={<GoIssueOpened size={24} />}
          description="Create and manage tickets"
          title="Support Tickets"
          totalRecords={data?.total}
          onClick={() => setModalShow(true)}
          permissionReq="create_issue"
        />
      </div>
      <hr />

      <div className="h-100 p-0">
        {isLoading ? (
          <IsLoading />
        ) : (
          <>
            <div className="mt-2" />
            {!error && (
              <ReactTable
                data={data?.data}
                tabs={
                  <div className="d-flex justify-content-between">
                    {!isLoading && (
                      <Nav
                        className="global-navs"
                        variant="tabs"
                        activeKey={filter.status}
                        onSelect={(selectedKey) =>
                          _onFilterChange("status", selectedKey)
                        }
                      >
                        <Nav.Item>
                          <Nav.Link eventKey="">
                            All ({data?.data?.length || 0})
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="active">
                            Active (
                            {
                              data?.data?.filter(
                                (item) => item.status === "active"
                              ).length || 0
                            }
                            )
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="closed">
                            Closed (
                            {
                              data?.data?.filter(
                                (item) => item.status === "closed"
                              ).length || 0
                            }
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
                          onFilterChange={_onFilterChange}
                        />
                        <FilterSelect
                          currentValue={filter.related_to}
                          data={IssueRelatedTo}
                          label="Related to"
                          idx="related_to"
                          onFilterChange={_onFilterChange}
                        />
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
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                }
                columns={columns}
                setSelectedRows={setSelectedRows}
                filter={filter}
                onFilterChange={_onFilterChange}
                isDataLoading={isFetching}
                isSelectable={false}
                searchPlaceHolder="Search using title,ref_id"
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
            ) : null}
          </>
        )}
      </div>

     
      <Flyout
        isOpen={modalShow}
        onClose={_onModalHideClick}
        title="Raise A Ticket"
        width="600px"
      >
        <IssuesCreateForm onHideModal={_onModalHideClick} />
      </Flyout>

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
