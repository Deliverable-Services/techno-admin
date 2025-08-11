import { AxiosError } from "axios";
import { useMemo, useState } from "react";
import { Button, Container, Dropdown, Nav } from "react-bootstrap";
import { BiSad } from "react-icons/bi";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import { handleApiError } from "../../hooks/handleApiErrors";
import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import CustomBadge from "../../shared-components/CustomBadge";
import EditButton from "../../shared-components/EditButton";
import FilterSelect from "../../shared-components/FilterSelect";
import IsActiveBadge from "../../shared-components/IsActiveBadge";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import API from "../../utils/API";
import { areTwoObjEqual } from "../../utils/areTwoObjEqual";
import { conditionType } from "../../utils/arrays";
import { primaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import { RiCoupon3Line } from "react-icons/ri";
import { BsFunnel } from "react-icons/bs";
import { useFlyout } from "../../hooks/useFlyout";
import Flyout from "../../shared-components/Flyout";
import CouponCreateUpdateForm from "./CouponsCreateUpdateForm";

const key = "coupons";

const deleteCoupons = (id: Array<any>) => {
  return API.post(`${key}/delete`, { id });
};
const intitialFilter = {
  q: "",
  page: null,
  perPage: 25,
  active: "",
  condition_type: "",
};

const Coupons = () => {
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
    // history.push("/coupons/create-edit");
    openFlyout();
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
        Cell: (data: Cell) => {
          return (
            <CustomBadge
              title={data.row.values.coupon_code}
              variant="primary"
            />
          );
        },
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
              permissionReq="update_coupon"
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
          title="Coupons"
          description="Create and manage coupons"
          icon={<RiCoupon3Line size={24} />}
          onClick={_onCreateClick}
          totalRecords={data?.total}
          permissionReq="create_coupon"
        />
      </div>
      <hr />
      <div className="h-100 p-0 ">
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
                  columns={columns}
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
                            currentValue={filter.condition_type}
                            data={conditionType}
                            label="Condition Type"
                            idx="condition_type"
                            onFilterChange={_onFilterChange}
                          />
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>
                  }
                  setSelectedRows={setSelectedRows}
                  filter={filter}
                  onFilterChange={_onFilterChange}
                  isDataLoading={isFetching}
                  deletePermissionReq="delete_coupon"
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
        title={"Create Coupons"}
        cancelText="Cancel"
        width="800px"
      >
        <CouponCreateUpdateForm />
      </Flyout>
    </>
  );
};

export default Coupons;
