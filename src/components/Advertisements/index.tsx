import { AxiosError } from "axios";
import { useMemo, useState } from "react";
import { Button, Container, Dropdown, Nav } from "react-bootstrap";
import { QueryFunction, useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";

import { Cell } from "react-table";
import { handleApiError } from "../../hooks/handleApiErrors";

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
import { isActiveArray } from "../../utils/arrays";
import { primaryColor, config } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import { useFlyout } from "../../hooks/useFlyout";
import Flyout from "../../shared-components/Flyout";
import AdvertisementCreateUpdateForm from "./AdvertisementUpdateCreateForm";
import { Hammer } from "../ui/icon";

const key = "banners/list";

const deleteAd = (id: Array<any>) => {
  return API.post(`banners/delete`, { id });
};
const initialFilter = {
  type: "offer",
  q: "",
  page: "",
  perPage: 25,
  active: "",
};

const getBanners: QueryFunction = async ({ queryKey }) => {
  const params = {};
  //@ts-ignore
  for (let k in queryKey[2]) {
    if (queryKey[2][k]) params[k] = queryKey[2][k];
  }

  const r = await API.get(
    `${queryKey[0]}/${(queryKey[1] as string).toLowerCase()}`,
    {
      params,
    }
  );

  return await r.data;
};

const Advertisements = () => {
  const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const [isDraggable, setIsDraggable] = useState(false);
  const [filter, setFilter] = useState(initialFilter);
  const { isOpen: showFlyout, openFlyout, closeFlyout } = useFlyout();

  const { data, isLoading, isFetching, error } = useQuery<any>(
    [key, filter.type, filter],
    getBanners,
    {
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  const { mutate, isLoading: isDeleteLoading } = useMutation(deleteAd, {
    onSuccess: () => {
      queryClient.invalidateQueries(key);
      showMsgToast("Banner(s) deleted successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });
  const _onFilterChange = (idx: string, value: any) => {
    setFilter((prev) => {
      return {
        ...prev,
        [idx]: value,
      };
    });
  };

  const _onCreateClick = () => {
    // history.push("/advertisements/create-edit");
    openFlyout();
  };
  const _onEditClick = (id: string) => {
    history.push("/advertisements/create-edit", { id });
  };

  const _onDeepLinkClick = (data: Cell) => {
    window.open(config.clientWebUrl);
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
          <img
            src={`${config.baseUploadUrl}banners/${data.row.values.image}`}
            alt={String(data.row.values.image)}
            style={{
              width: "100px",
              height: "50px",
              objectFit: "cover",
              cursor: "pointer",
            }}
            onClick={() =>
              window.open(
                `${config.baseUploadUrl}banners/${data.row.values.image}`,
                "_blank"
              )
            }
          />
        ),
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Page url",
        accessor: "deeplink",
        Cell: (data: Cell) => (
          <p
            className="text-darkGray m-0"
            style={{ cursor: "pointer" }}
            onClick={() => _onDeepLinkClick(data)}
          >
            {data.row.values.deeplink}
          </p>
        ),
      },
      {
        Header: "Order",
        accessor: "order",
      },
      {
        Header: " Is Active?",
        accessor: "is_active",
        Cell: (data: Cell) => {
          return <IsActiveBadge value={data.row.values.is_active} />;
        },
      },
      {
        Header: "Valid from",
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
              permissionReq="update_banner"
            />
          );
        },
      },
    ],
    [_onEditClick]
  );

  if (!data && (!isLoading || !isFetching)) {
    return (
      <Container fluid className="d-flex justify-content-center display-3">
        <div className="d-flex flex-column align-items-center">
          <Hammer color={primaryColor} />
          <span className="text-primary display-3">Something went wrong</span>
        </div>
      </Container>
    );
  }

  return (
    <>
      <div className="view-padding">
        <PageHeading
          title="Banners"
          description="Create and manage banners"
          icon={<Hammer size={24} />}
          onClick={() => _onCreateClick()}
          totalRecords={data?.total}
          permissionReq="create_banner"
        />
      </div>
      <hr />

      <div className="">
        <div className="h-100 p-0">
          {isLoading ? (
            <IsLoading />
          ) : (
            <>
              {!error && (
                <>
                  <div className="mt-3" />
                  <ReactTable
                    tabs={
                      <div className="d-flex justify-content-between">
                        {(!isLoading || !isFetching) && (
                          <Nav
                            className="global-navs"
                            variant="tabs"
                            activeKey={filter.type}
                            onSelect={(selectedKey) =>
                              _onFilterChange("type", selectedKey)
                            }
                          >
                            <Nav.Item>
                              <Nav.Link eventKey="offer">
                                Offer (
                                {data?.data?.filter(
                                  (item) => item.status === "offer"
                                ).length || 0}
                                )
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link eventKey="latest">
                                Latest (
                                {data?.data?.filter(
                                  (item) => item.status === "latest"
                                ).length || 0}
                                )
                              </Nav.Link>
                            </Nav.Item>

                            <Nav.Item>
                              <Nav.Link eventKey="trending">
                                Trending (
                                {data?.data?.filter(
                                  (item) => item.status === "trending"
                                ).length || 0}
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
                          <Hammer /> Filters
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <div className="filter-dropdown-heading d-flex justify-content-between w-100">
                            <h4>Filter</h4>
                            <div className="d-flex align-items-center justify-md-content-center">
                              <Button
                                variant={
                                  areTwoObjEqual(initialFilter, filter)
                                    ? "light"
                                    : "primary"
                                }
                                style={{
                                  fontSize: 14,
                                }}
                                onClick={() => setFilter(initialFilter)}
                              >
                                Reset Filters
                              </Button>
                            </div>
                          </div>
                          <div className="select-filter">
                            <FilterSelect
                              currentValue={filter.active}
                              data={isActiveArray}
                              label="Is Active?"
                              idx="active"
                              onFilterChange={_onFilterChange}
                              defaultSelectTitle="Show All"
                            />
                          </div>
                        </Dropdown.Menu>
                      </Dropdown>
                    }
                    data={data.data}
                    columns={columns}
                    setSelectedRows={setSelectedRows}
                    onFilterChange={_onFilterChange}
                    filter={filter}
                    isDataLoading={isFetching}
                    isDraggable={isDraggable}
                    searchPlaceHolder="Search using name"
                    deletePermissionReq="delete_banner"
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
        title={"Create Services"}
        cancelText="Cancel"
        width="800px"
      >
        <AdvertisementCreateUpdateForm />
      </Flyout>
    </>
  );
};

export default Advertisements;
