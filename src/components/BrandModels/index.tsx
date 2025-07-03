import { SatelliteSharp } from "@material-ui/icons";
import { AxiosError } from "axios";
import { useMemo, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { BiSad } from "react-icons/bi";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import { handleApiError } from "../../hooks/handleApiErrors";
import useUserProfileStore from "../../hooks/useUserProfileStore";
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
import TableLink from "../../shared-components/TableLink";
import API from "../../utils/API";
import { areTwoObjEqual } from "../../utils/areTwoObjEqual";
import { config, primaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";

const key = "brand-models";

const deleteBrandModels = (id: Array<any>) => {
  return API.post(`${key}/delete`, {
    id,
  });
};

const intitialFilter = {
  q: "",
  page: null,
  perPage: 25,
  active: "",
  brand_id: "",
};

const BrandModels = () => {
  const isRestricted = useUserProfileStore((state) => state.isRestricted);
  const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const [filter, setFilter] = useState(intitialFilter);
  const [page, setPage] = useState<number>(1);
  const { data, isLoading, isFetching, error } = useQuery<any>(
    [key, , filter],
    {
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  const { data: Brands, isLoading: isBrandsLoading } = useQuery<any>([
    "brands",
  ]);
  const { mutate, isLoading: isDeleteLoading } = useMutation(
    deleteBrandModels,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(key);
        showMsgToast("Brand Model deleted successfully");
      },
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  const _onFilterChange = (idx: string, value: any) => {
    setFilter((prev) => ({
      ...prev,
      [idx]: value,
    }));
  };

  const _onCreateClick = () => {
    history.push("/brand-models/create-edit");
  };
  const _onEditClick = (id: string) => {
    history.push("/brand-models/create-edit", { id });
  };

  const _onUrlClick = (data: Cell) => {
    window.open(config.clientWebUrl);
  };

  const _onBrandClick = (id: string) => {
    if (!id) return;
    history.push("/brands/create-edit", { id });
  };
  const _onCarTypeClick = (id: string) => {
    if (!id) return;
    history.push("/car-types/create-edit", { id });
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
          <TableImage folder="brand-models" file={data.row.values.image} />
        ),
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
            className="text-primary m-0"
            style={{ cursor: "pointer" }}
            onClick={() => _onUrlClick(data)}
          >
            {data.row.values.url}
          </p>
        ),
      },
      {
        Header: "Brand",
        accessor: "brand.name",
        Cell: (data: Cell) => {
          return (
            <TableLink
              onClick={_onBrandClick}
              id={(data.row.original as any).brand_id}
              title={data.row.values["brand.name"]}
            />
          );
        },
      },
      {
        Header: "Car Type",
        accessor: "brand_model_type.name",
        Cell: (data: Cell) => {
          return (
            <TableLink
              onClick={_onCarTypeClick}
              id={(data.row.original as any).brand_model_type?.id}
              title={data.row.values["brand_model_type.name"]}
            />
          );
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
              permissionReq="update_brandmodel"
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
          title="Product"
          onClick={_onCreateClick}
          totalRecords={data?.total}
          permissionReq="create_brandmodel"
        />

        {!isLoading && (
          <Container fluid className="p-0">
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
        <hr className="my-2" />
        <Container fluid className="h-100 p-0">
          {isLoading ? (
            <IsLoading />
          ) : (
            <>
              {!error && (
                <>
                  <Container fluid className="px-0">
                    <Row className="select-filter d-flex">
                      <Col md="auto">
                        <FilterSelect
                          currentValue={filter.brand_id}
                          data={!isBrandsLoading && Brands.data}
                          label="Brands"
                          idx="brand_id"
                          onFilterChange={_onFilterChange}
                        />
                      </Col>
                      <Col
                        md="auto"
                        className="d-flex align-items-end  justify-md-content-center"
                      >
                        <Button
                          size="sm"
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
                      </Col>
                    </Row>
                  </Container>
                  <hr className="my-2" />
                  <ReactTable
                    data={data?.data}
                    columns={columns}
                    setSelectedRows={setSelectedRows}
                    filter={filter}
                    onFilterChange={_onFilterChange}
                    isDataLoading={isFetching}
                    searchPlaceHolder="Search using name"
                    deletePermissionReq="delete_brandmodel"
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
              mutate(selectedRows.map((m) => m.id));
            }}
          >
            {isDeleteLoading ? "Loading..." : "Delete"}
          </Button>
        </div>
      )}
    </>
  );
};

export default BrandModels;
