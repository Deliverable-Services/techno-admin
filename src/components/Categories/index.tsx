import { AxiosError } from "axios";
import { useMemo, useState } from "react";
import { Button, Container, Row } from "react-bootstrap";
import { BiSad } from "react-icons/bi";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell, TableState } from "react-table";
import { handleApiError } from "../../hooks/handleApiErrors";
import BreadCrumb from "../../shared-components/BreadCrumb";
import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import EditButton from "../../shared-components/EditButton";
import IsActiveBadge from "../../shared-components/IsActiveBadge";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import API from "../../utils/API";
import { config, primaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showErrorToast } from "../../utils/showErrorToast";
import { showMsgToast } from "../../utils/showMsgToast";

const key = "categories";

const deleteCategories = (id: Array<any>) => {
  return API.post(`${key}/delete`, {
    id,
  });
};

const updateOrder = async (id: string, destinationIndex: any, row: any) => {
  const finalIn = (parseInt(destinationIndex) + 1).toString();
  const formdata = new FormData();
  for (let k in row) formdata.append(k, row[k]);
  formdata.append("order", finalIn);

  try {
    const { data } = await API.post(`${key}/${id}`, formdata, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (data) {
      showMsgToast("Successfully updated order");
      queryClient.invalidateQueries(key);
    }
  } catch (error) {
    showErrorToast(error.message);
  }
};

const initialTableState: Partial<TableState<object>> = {
  sortBy: [
    {
      id: "order",
      desc: false,
    },
  ],
};
const intitialFilter = {
  q: "",
  page: null,
  perPage: 25,
  active: "",
};

const Categories = () => {
  const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const [filter, setFilter] = useState(intitialFilter);
  const [isDraggable, setIsDraggable] = useState(false);
  const handleChange = (nextChecked) => {
    setIsDraggable(nextChecked);
  };
  const { data, isLoading, isFetching, error } = useQuery<any>(
    [key, , filter],
    {
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  const { mutate, isLoading: isDeleteLoading } = useMutation(deleteCategories, {
    onSuccess: () => {
      queryClient.invalidateQueries(key);
      showMsgToast("Categories deleted successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const _onCreateClick = () => {
    history.push("/categories/create-edit");
  };
  const _onEditClick = (id: string) => {
    history.push("/categories/create-edit", { id });
  };
  const _onUrlClick = (data: Cell) => {
    window.open(config.clientWebUrl);
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
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Url",
        accessor: "url",
        Cell: (data: Cell) => (
          <p
            classname="text-darkGray m-0" 
            style={{ cursor: "pointer" }}
            onClick={() => _onUrlClick(data)}
          >
            {data.row.values.url}
          </p>
        ),
      },
      {
        Header: "Order",
        accessor: "order",
        isSortedDesc: true,
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
              permissionReq="update_category"
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
      <Container fluid className="card component-wrapper view-padding">
        <PageHeading
          title="Categories"
          onClick={_onCreateClick}
          totalRecords={data?.total}
          permissionReq="create_category"
        />
        {!isLoading && (
          <Container fluid className="px-0">
            <div className="d-flex align-items-center justify-content-between w-100">
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
        <Container fluid className="h-100 p-0">
          {isLoading ? (
            <IsLoading />
          ) : (
            <>
              {!error && (
                <>
                  <Container className="pt-3">
                    <Row className="select-filter d-flex ">
                      {/* <Col md="auto">
                        <div className=" d-flex align-items-center "
                          style={{
                            height: 30
                          }}
                        >
                          <span className="text-muted mr-2">IsDraggable?</span>
                          <Switch
                            checked={isDraggable}
                            onChange={handleChange}
                            className="react-switch"
                            onColor={primaryColor}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            height={20}
                          />

                        </div>
                      </Col> */}
                      {/* <Col
                        md="auto"
                        className="d-flex align-items-center  justify-content-center"
                      >
                        <Button
                          variant="light"

                          style={{
                            backgroundColor: "#eee",
                            fontSize: 14,
                          }}

                          onClick={() => setFilter(intitialFilter)}
                        >
                          Reset Filters
                        </Button>
                      </Col> */}
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
                    isDraggable={isDraggable}
                    updateOrder={updateOrder}
                    searchPlaceHolder="Search using name, url"
                    deletePermissionReq="delete_category"
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

export default Categories;
