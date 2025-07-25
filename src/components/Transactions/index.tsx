import { useMemo, useState } from "react";
import { Button, Container, Modal, Spinner, Col, Row } from "react-bootstrap";
import { BiSad } from "react-icons/bi";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import useTransactionStoreFilter, {
  INITIAL_FILTER,
} from "../../hooks/useTranscationFilterStore";
import BreadCrumb from "../../shared-components/BreadCrumb";
import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import CustomBadge from "../../shared-components/CustomBadge";
import FilterSelect from "../../shared-components/FilterSelect";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import API from "../../utils/API";
import { areTwoObjEqual } from "../../utils/areTwoObjEqual";
import { PaymentMethods } from "../../utils/arrays";
import { primaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showErrorToast } from "../../utils/showErrorToast";

const key = "transactions";

const intitialFilter = {
  q: "",
  page: null,
  perPage: 25,
};
const Transactions = () => {
  const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState<number>(1);

  const [localFilter, setFilter] = useState(intitialFilter);
  const filter = useTransactionStoreFilter((state) => state.filter);
  const onFilterChange = useTransactionStoreFilter(
    (state) => state.onFilterChange
  );
  const resetFilter = useTransactionStoreFilter((state) => state.resetFilter);
  const { data, isLoading, isFetching, error } = useQuery<any>(
    [key, , { ...localFilter, ...filter }],
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
  const _onFilterChange = (idx: string, value: any) => {
    setFilter((prev) => ({
      ...prev,
      [idx]: value,
    }));
  };
  const { data: Customers, isLoading: isCustomerLoading } = useQuery<any>(
    ["users", 1, {}],
    {
      onError: (err: any) => {
        showErrorToast(err.response.data.message);
      },
    }
  );

  const _onOrderClick = (id: string) => {
    console.log({ id });
    if (!id) return;
    history.push(`/orders/${id}`);
  };

  const Status = ({ status }: { status: string }) => {
    const setVariant = () => {
      if (status === "success") return "success";

      return "danger";
    };
    return <CustomBadge title={status} variant={setVariant()} />;
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
      },
      {
        Header: "User",
        accessor: "user.name",
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
        Header: "Order",
        accessor: "order.ref_id",
        Cell: (data: Cell) => {
          console.log({ data });
          return (
            <p
              classname="text-darkGray m-0" 
              style={{ cursor: "pointer" }}
              onClick={() => _onOrderClick(data.row.original["order_id"])}
            >
              {data.row.values["order.ref_id"]}
            </p>
          );
        },
      },
      {
        Header: "Paid Amount",
        accessor: "paid_amount",
      },
      {
        Header: "Payment Method",
        accessor: "payment_method",
      },
      {
        Header: "Status",
        accessor: "status", //accessor is the "key" in the data
        Cell: (data: Cell) => <Status status={data.row.values.status} />,
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
        <PageHeading title="Transactions" totalRecords={data?.total} />

        {!isLoading && (
          <div>
            <div>
              <div className="filter">
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
                  value="failed"
                  currentValue={filter.status}
                  dataLength={data?.data.length}
                  idx="status"
                  title="Failed"
                  isLast
                />
              </div>
            </div>
          </div>
        )}

        <Container fluid className="h-100 p-0 ">
          {isLoading ? (
            <IsLoading />
          ) : (
            <>
              {!error && (
                <>
                  <Container fluid className="pt-2 px-0">
                    <Row className="select-filter d-flex align-items-end">
                      <Col md="auto">
                        <FilterSelect
                          currentValue={filter.user_id}
                          data={!isCustomerLoading && Customers.data}
                          label="Customers"
                          idx="user_id"
                          onFilterChange={onFilterChange}
                        />
                      </Col>
                      <Col md="auto">
                        <FilterSelect
                          currentValue={filter.payment_method}
                          data={PaymentMethods}
                          label="Payment Method"
                          idx="payment_method"
                          onFilterChange={onFilterChange}
                        />
                      </Col>
                      <Col
                        md="auto"
                        className="d-flex align-items-end justify-md-content"
                      >
                        <Button
                          onClick={() => resetFilter()}
                          variant={
                            areTwoObjEqual(
                              { ...intitialFilter, ...INITIAL_FILTER },
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
                    searchPlaceHolder="Search using ref id"
                  />
                </>
              )}
              {!error && data?.data?.length > 0 ? (
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

export default Transactions;
