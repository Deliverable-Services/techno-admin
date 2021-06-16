import { AxiosError } from "axios";
import { useMemo, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { AiFillEdit } from "react-icons/ai";
import { BiSad } from "react-icons/bi";
import { useMutation, useQuery } from "react-query";
import { Switch, useHistory } from "react-router-dom";
import { Cell } from "react-table";
import { handleApiError } from "../../hooks/handleApiErrors";
import BreadCrumb from "../../shared-components/BreadCrumb";
import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import EditButton from "../../shared-components/EditButton";
import FilterSelect from "../../shared-components/FilterSelect";
import IsActiveBadge from "../../shared-components/IsActiveBadge";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import API from "../../utils/API";
import { areTwoObjEqual } from "../../utils/areTwoObjEqual";
import { conditionType, isActiveArray } from "../../utils/arrays";
import { primaryColor, secondaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";

const key = "coupons";

const deleteCoupons = (id: Array<any>) => {
  return API.post(`${key}/delete`, { id });
};
const intitialFilter = {
  q: "",
  page: null,
  perPage: 25,
  active: "",
  condition_type: ""
};

const Coupons = () => {
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

  const { mutate, isLoading: isDeleteLoading } = useMutation(deleteCoupons, {
    onSuccess: () => {
      queryClient.invalidateQueries(key);
      showMsgToast("Coupons deleted successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const _onCreateClick = () => {
    history.push("/coupons/create-edit");
  };
  const _onEditClick = (id: string) => {
    history.push("/coupons/create-edit", { id });
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
        accessor: "title",
      },
      {
        Header: "Coupon Code",
        accessor: "coupon_code",
      },
      {
        Header: "Condition",
        accessor: "condition",
      },
      {
        Header: "Conditioin Type",
        accessor: "condition_type",
      },
      {
        Header: "Valid From",
        accessor: "valid_from",
        Cell: (data: Cell) => {
          return <CreatedUpdatedAt date={data.row.values.valid_from} />;
        },
      },
      {
        Header: "Valid To",
        accessor: "valid_to",
        Cell: (data: Cell) => {
          return <CreatedUpdatedAt date={data.row.values.valid_to} />;
        },
      },
      {
        Header: "Is Active?",
        accessor: "is_active",
        Cell: (data: Cell) => {
          return <IsActiveBadge value={data.row.values.is_active} />;
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
            <EditButton
              onClick={() => {
                _onEditClick(data.row.values.id);
              }}
            />
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
      <PageHeading title="Coupons" onClick={_onCreateClick} totalRecords={data?.total} />
      {(!isLoading) && (
        <Container fluid>
          <div>
            <div className="filter">
              <BreadCrumb
                onFilterChange={_onFilterChange}
                value=""
                currentValue={filter.active}
                dataLength={data?.data?.length}
                idx="active"
                title="All"
              />
              <BreadCrumb
                onFilterChange={_onFilterChange}
                value="1"
                currentValue={filter.active}
                dataLength={data?.data?.length}
                idx="active"
                title="Active"
              />
              <BreadCrumb
                onFilterChange={_onFilterChange}
                value="0"
                currentValue={filter.active}
                dataLength={data?.data?.length}

                idx="active"
                title="Not Active"
                isLast
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
                <>

                  <Container className="pt-3">
                    <Row className="select-filter d-flex">
                      <Col md="auto">
                        <FilterSelect
                          currentValue={filter.condition_type}
                          data={conditionType}
                          label="Condition Type"
                          idx="condition_type"
                          onFilterChange={_onFilterChange}
                        />
                      </Col>
                      <Col
                        md="auto"
                        className="d-flex align-items-center mt-1 justify-content-center"
                      >
                        <Button
                          variant={areTwoObjEqual(intitialFilter, filter) ? "light" : "primary"}
                          style={{
                            fontSize: 14,
                          }}

                          onClick={() => setFilter(intitialFilter)}
                        >
                          Reset Filters
                        </Button>
                      </Col>
                    </Row>
                  </Container>
                  <hr />
                  <ReactTable
                    data={data?.data}
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
          <Button
            variant="danger"
            onClick={() => {
              mutate(selectedRows.map((i) => i.id));
            }}
          >
            {isDeleteLoading ? "Loading..." : "Delete"}
          </Button>
        </div>
      )}
    </>
  );
};

export default Coupons;
