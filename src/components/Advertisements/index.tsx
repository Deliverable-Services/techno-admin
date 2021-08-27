import { AxiosError } from "axios";
import { useMemo, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { BiSad } from "react-icons/bi";
import LightBox from "react-lightbox-component";
import { QueryFunction, useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import Switch from "react-switch";
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
import { isActiveArray } from "../../utils/arrays";
import {
  baseUploadUrl,
  clientWebUrl,
  primaryColor,
} from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
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
  const [selectedRowId, setSelectedRowId] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState([]);
  console.log(selectedRows.map((item) => item.id));
  const [page, setPage] = useState<number>(1);
  const [deletePopup, setDeletePopup] = useState(false);

  const [isDraggable, setIsDraggable] = useState(false);
  const handleChange = (nextChecked) => {
    setIsDraggable(nextChecked);
  };
  const [filter, setFilter] = useState(initialFilter);

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
      setDeletePopup(false);
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
    history.push("/advertisements/create-edit");
  };
  const _onEditClick = (id: string) => {
    history.push("/advertisements/create-edit", { id });
  };

  const _onDeepLinkClick = (data: Cell) => {
    window.open(clientWebUrl);
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
          <LightBox
            images={[
              {
                src: `${baseUploadUrl}banners/${data.row.values.image}`,
                title: data.row.values.image,
              },
            ]}
            thumbnailWidth="100px"
            thumbnailHeight="50px"
          />
        ),
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Deep Link",
        accessor: "deeplink",
        Cell: (data: Cell) => (
          <p
            className="text-primary m-0"
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
        <PageHeading
          title="Banners"
          onClick={() => _onCreateClick()}
          totalRecords={data?.total}
          permissionReq="create_banner"
        />

        {(!isLoading || !isFetching) && (
          <Container fluid className="px-0">
            <div>
              <div className="filter">
                <BreadCrumb
                  onFilterChange={_onFilterChange}
                  value="offer"
                  currentValue={filter.type}
                  dataLength={data?.data?.length}
                  idx="type"
                  title="Offer"
                />
                <BreadCrumb
                  onFilterChange={_onFilterChange}
                  value="latest"
                  currentValue={filter.type}
                  dataLength={data?.data?.length}
                  idx="type"
                  title="Latest"
                />
                <BreadCrumb
                  onFilterChange={_onFilterChange}
                  value="trending"
                  currentValue={filter.type}
                  dataLength={data?.data?.length}
                  idx="type"
                  title="Trending"
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
                  <Container fluid className="pt-3 px-0">
                    <Row className="select-filter d-flex">
                      <Col md="auto">
                        <FilterSelect
                          currentValue={filter.active}
                          data={isActiveArray}
                          label="Is Active?"
                          idx="active"
                          onFilterChange={_onFilterChange}
                          defaultSelectTitle="Show All"
                        />
                      </Col>

                      {/* <Col md="auto" className=" d-flex align-items-center ">
                        <div className=" d-flex align-items-center "
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

                      <Col
                        md="auto"
                        className="d-flex align-items-end justify-md-content-center"
                      >
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
                      </Col>
                    </Row>
                  </Container>
                  <hr className="mt-2" />
                  <ReactTable
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

export default Advertisements;
