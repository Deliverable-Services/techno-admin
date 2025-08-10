import { AxiosError } from "axios";
import { useMemo, useState } from "react";
import { Button, Col, Container, Dropdown, Nav, Row } from "react-bootstrap";
import { BiSad } from "react-icons/bi";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
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
import TableImage from "../../shared-components/TableImage";
import API from "../../utils/API";
import { areTwoObjEqual } from "../../utils/areTwoObjEqual";
import { InsideCart, isActiveArray } from "../../utils/arrays";
import { primaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import { FaRegLightbulb } from "react-icons/fa";
import { BsFunnel } from "react-icons/bs";
import { useFlyout } from "../../hooks/useFlyout";
import Flyout from "../../shared-components/Flyout";
import PlanCreateUpdateForm from "./PlansCreateUpdateForm";

const key = "plans";

const deletePlans = (id: Array<any>) => {
  return API.post(`${key}/delete`, { id });
};

const intitialFilter = {
  q: "",
  page: null,
  perPage: 25,
  active: "",
  is_popular: "",
  category_id: "",
  allowed_usage: "",
};
const Plans = () => {
  const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const [filter, setFilter] = useState(intitialFilter);
  const { isOpen: showFlyout, openFlyout, closeFlyout } = useFlyout();
  const { data, isLoading, isFetching, error } = useQuery<any>(
    [key, , filter],
    {
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  const { data: Categories, isLoading: isCategoresLoading } = useQuery<any>([
    "categories",
  ]);

  const { mutate, isLoading: isDeleteLoading } = useMutation(deletePlans, {
    onSuccess: () => {
      queryClient.invalidateQueries(key);
      showMsgToast("Plans deleted successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const _onCreateClick = () => {
    // history.push("/plans/create-edit");
    openFlyout();
  };
  const _onEditClick = (id: string) => {
    history.push("/plans/create-edit", { id });
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
        Header: "Image",
        accessor: "image",
        Cell: (data: Cell) => (
          <TableImage file={data.row.values.image} folder="plans" />
        ),
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Price",
        accessor: "price",
      },
      {
        Header: "Category",
        accessor: "category.name",
      },
      {
        Header: "Allowed Usage",
        accessor: "allowed_usage",
      },
      {
        Header: "Is Active?",
        accessor: "is_active",
        Cell: (data: Cell) => {
          return <IsActiveBadge value={data.row.values.is_active} />;
        },
      },
      {
        Header: "Is Popular",
        accessor: "is_popular",
        Cell: (data: Cell) => {
          return <IsActiveBadge value={data.row.values.is_popular} />;
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
              permissionReq="update_plan"
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
      <div className="view-padding">
        <PageHeading
          title="Plans"
          description="Create and manage plan"
          icon={<FaRegLightbulb size={24} />}
          onClick={_onCreateClick}
          totalRecords={data?.total}
          permissionReq="create_plan"
        />
      </div>
      <hr />
      <div className="h-100 p-0">
        {isLoading ? (
          <IsLoading />
        ) : (
          <>
            {!error && (
              <>
                <ReactTable
                  data={data?.data}
                  tabs={
                    <div className="d-flex justify-content-between">
                      <Nav
                        className="global-navs"
                        variant="tabs"
                        activeKey={filter.active}
                        onSelect={(selectedKey) =>
                          _onFilterChange("active", selectedKey)
                        }
                      >
                        <Nav.Item>
                          <Nav.Link eventKey="">
                            All ({data?.data?.length || 0})
                          </Nav.Link>
                        </Nav.Item>

                        <Nav.Item>
                          <Nav.Link eventKey="1">
                            Active (
                            {data?.data?.filter((item) => item.status === "1")
                              .length || 0}
                            )
                          </Nav.Link>
                        </Nav.Item>

                        <Nav.Item>
                          <Nav.Link eventKey="0">
                            Not Active (
                            {data?.data?.filter((item) => item.status === "0")
                              .length || 0}
                            )
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
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
                              variant={
                                areTwoObjEqual(intitialFilter, filter)
                                  ? "light"
                                  : "primary"
                              }
                              style={{
                                fontSize: 14,
                              }}
                              onClick={() => setFilter(intitialFilter)}
                            >
                              Reset Filters
                            </Button>
                          </div>
                        </div>
                        <div className="select-filter">
                          <FilterSelect
                            currentValue={filter.category_id}
                            data={!isCategoresLoading && Categories.data}
                            label="Categories"
                            idx="category_id"
                            onFilterChange={_onFilterChange}
                          />
                          <FilterSelect
                            currentValue={filter.allowed_usage}
                            data={InsideCart}
                            label="Allowed Usage"
                            idx="allowed_usage"
                            width="80px"
                            onFilterChange={_onFilterChange}
                          />
                          <FilterSelect
                            currentValue={filter.is_popular}
                            data={isActiveArray}
                            label="Is Popular?"
                            idx="is_popular"
                            onFilterChange={_onFilterChange}
                            defaultSelectTitle="Show All"
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
                  searchPlaceHolder="Search using name"
                  deletePermissionReq="delete_plan"
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
      </div>

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

      <Flyout
        isOpen={showFlyout}
        onClose={closeFlyout}
        title={"Create Plans"}
        cancelText="Cancel"
        width="800px"
      >
        <PlanCreateUpdateForm />
      </Flyout>
    </>
  );
};

export default Plans;
