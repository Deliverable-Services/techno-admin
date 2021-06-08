import { useMemo, useState } from "react";
import { Badge, Button, Col, Container, Modal, Row, Spinner } from "react-bootstrap";
import { BiSad } from "react-icons/bi";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import BreadCrumb from "../../shared-components/BreadCrumb";
import FilterSelect from "../../shared-components/FilterSelect";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import API from "../../utils/API";
import { InsideCart, OrderStatus, RowsPerPage } from "../../utils/arrays";
import { primaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showErrorToast } from "../../utils/showErrorToast";
// import UpdateCreateForm from "./FaqsCreateUpdateForm"

const key = "bookings";

interface IFilter {
  status: string | null;
  user_id: string | null;
  agent_id: string | null;
  inside_cart: string | null;
  rows_per_page: string | null;
}
const INITIAL_FILTER = {
  status: "",
  user_id: "",
  agent_id: "",
  inside_cart: "",
  rows_per_page: "25"

}

const Orders = () => {
  const history = useHistory();
  const [selectedRowId, setSelectedRowId] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [filter, setFilter] = useState<IFilter>(INITIAL_FILTER)
  console.log({ filter })
  const { data, isLoading, isFetching, error } = useQuery<any>([key, page], {
    onError: (err: any) => {
      showErrorToast(err.response.data.message);
    },
  });
  const { data: Customers, isLoading: isCustomerLoading } = useQuery<any>(["users", page, {
    role: "customer"
  }], {
    onError: (err: any) => {
      showErrorToast(err.response.data.message);
    },
  });
  const { data: Agents, isLoading: isAgentLoading } = useQuery<any>(["users", page, {
    role: "agent"
  }], {
    onError: (err: any) => {
      showErrorToast(err.response.data.message);
    },
  });

  const _onFilterChange = (idx: string, value: any) => {
    setFilter((prev) => {
      return {
        ...prev,
        [idx]: value
      }
    })
  }
  const Status = ({ status }: { status: string }) => {
    const setVairant = () => {
      if (status === "cancelled" || status === "error_payment") return "danger";

      if (status === "pending" || status === "pending_payment") return "warning";

      return "success";
    };
    return <Badge variant={setVairant()}>{status}</Badge>;
  };
  const _onUserClick = (id: string) => {
    if (!id) return
    history.push("/users/create-edit", { id })
  }

  const columns = useMemo(
    () => [
      {
        Header: "#Id",
        accessor: "id", //accessor is the "key" in the data
      },
      {
        Header: "Ref Id",
        accessor: "ref_id", //accessor is the "key" in the data
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

            >{data.row.values["user.name"]}</p>
          )
        }
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
                onClick={() => _onUserClick((data.row.original as any).agent_id)}

              >{data.row.values["agent.name"]}</p>
            )
          else
            return "NA"
        }

      },
      {
        Header: "Order Status",
        accessor: "status",
        Cell: (data: Cell) => <Status status={data.row.values.status} />,
      },
      {
        Header: "Inside Cart",
        accessor: "inside_cart",
      },
      {
        Header: "Total Cost",
        accessor: "total_cost",
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
      <PageHeading title="Orders" />
      {
        (!isLoading || !isFetching) &&
        <div>
          <Container >
            <div className="filter">
              <BreadCrumb
                onFilterChange={_onFilterChange}
                value=""
                currentValue={filter.status}
                dataLength={data.data.length}
                idx="status"
                title="All"
              />
              <BreadCrumb
                onFilterChange={_onFilterChange}
                value="success"
                currentValue={filter.status}
                dataLength={data.data.length}
                idx="status"
                title="Success"
              />
              <BreadCrumb
                onFilterChange={_onFilterChange}
                value="pending"
                currentValue={filter.status}
                dataLength={data.data.length}
                idx="status"
                title="Pending"
              />
              <BreadCrumb
                onFilterChange={_onFilterChange}
                value="error_payment"
                currentValue={filter.status}
                dataLength={data.data.length}
                idx="status"
                title="Payment Errors"
              />
              <BreadCrumb
                onFilterChange={_onFilterChange}
                value="failed"
                currentValue={filter.status}
                dataLength={data.data.length}
                idx="status"
                title="Failed"
                isLast
              />
            </div>
          </Container>
          <Container className="mt-2">

            <Row className="select-filter d-flex">
              <Col md="auto">
                <FilterSelect
                  currentValue={filter.user_id}
                  data={!isCustomerLoading && Customers && Customers.data}
                  label="Customers"
                  idx="user_id"
                  onFilterChange={_onFilterChange}

                />
              </Col>
              <Col md="auto">
                <FilterSelect
                  currentValue={filter.agent_id}
                  data={!isAgentLoading && Agents && Agents.data}
                  label="Agents"
                  idx="agent_id"
                  onFilterChange={_onFilterChange}

                />
              </Col>
              {/* <Col md="auto">
                <FilterSelect
                  currentValue={filter.status}
                  data={OrderStatus}
                  label="Order Status"
                  idx="status"
                  onFilterChange={_onFilterChange}

                />
              </Col> */}
              <Col md="auto">
                <FilterSelect
                  currentValue={filter.inside_cart}
                  data={InsideCart}
                  label="Inside Cart"
                  idx="inside_cart"
                  onFilterChange={_onFilterChange}

                />
              </Col>
              <Col md="auto">
                <FilterSelect
                  currentValue={filter.rows_per_page}
                  data={RowsPerPage}
                  label="Rows Per Page"
                  idx="rows_per_page"
                  onFilterChange={_onFilterChange}
                  defaultSelectTitle="Select Rows Per Page"
                  isDefaultDisabled
                />
              </Col>
            </Row>
          </Container>
        </div>

      }
      <Container fluid className="card component-wrapper px-0 py-2">
        <Container fluid className="h-100 p-0">
          <>
            {isLoading || isFetching ? (
              <IsLoading />
            ) : (
              <>
                {!error && <ReactTable data={data.data} columns={columns} />}
                {!error && data.data.length > 0 ? (
                  <TablePagination
                    currentPage={data.current_page}
                    lastPage={data.last_page}
                    setPage={setPage}
                    hasNextPage={!!data.next_page_url}
                    hasPrevPage={!!data.prev_page_url}
                  />
                ) : null}{" "}
              </>
            )}
          </>
        </Container>
      </Container>
    </>
  );
};

export default Orders;
