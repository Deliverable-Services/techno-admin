import { AxiosError } from "axios";
import { useMemo, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { BiSad } from "react-icons/bi";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import { handleApiError } from "../../hooks/handleApiErrors";
import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import EditButton from "../../shared-components/EditButton";
import IsActiveBadge from "../../shared-components/IsActiveBadge";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import TableImage from "../../shared-components/TableImage";
import API from "../../utils/API";
import { primaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import ViewButton from "../../shared-components/ViewButton";
import BreadCrumb from "../../shared-components/BreadCrumb";

const key = "services";

const deleteServices = (id: Array<any>) => {
  return API.post(`${key}/delete`, { id });
};

const intitialFilter = {
  q: "",
  page: null,
  perPage: 25,
  isArchived: "0",
};

const sampleData = {
  data: [
    {
      id: 1,
      name: "Website A",
      seoDetails: {
        metaTitle: "Meta A",
        metaDescription: "Description A",
        metaKeywords: ["keyword1", "keyword2"],
        socialFeaturedImage: "https://via.placeholder.com/100",
      },
      organisationId: "org-123",
      lastEditedOn: "2025-07-20",
      isPublished: 1,
      isArchived: 0,
    },
    {
      id: 2,
      name: "Website B",
      seoDetails: {
        metaTitle: "Meta B",
        metaDescription: "Description B",
        metaKeywords: ["b1", "b2", "b3"],
        socialFeaturedImage: "https://via.placeholder.com/100",
      },
      organisationId: "org-456",
      lastEditedOn: "2025-07-18",
      isPublished: 0,
      isArchived: 1,
    },
  ],
  current_page: 1,
  first_page_url:
    "https://api-techno.dishantagnihotri.com/admin/v1/services?page=1",
  last_page: 1,
  last_page_url:
    "https://api-techno.dishantagnihotri.com/admin/v1/services?page=1",
  next_page_url: null,
  path: "https://api-techno.dishantagnihotri.com/admin/v1/services",
  per_page: "25",
  prev_page_url: null,
  total: 7,
};

const Website = () => {
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

  console.log("data", data);

  const { mutate, isLoading: isDeleteLoading } = useMutation(deleteServices, {
    onSuccess: () => {
      queryClient.invalidateQueries(key);
      showMsgToast("Services deleted successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const _onCreateClick = () => {
    history.push("/services/create-edit");
  };
  const _onEditClick = (id: string) => {
    history.push(`/website/${id}`);
  };

  const _onFilterChange = (idx: string, value: any) => {
    console.log("filter change", idx, value);
    setFilter((prev) => ({
      ...prev,
      [idx]: value,
    }));
  };
  //   const columns = useMemo(
  //     () => [
  //       //   {
  //       //     Header: "#Id",
  //       //     accessor: "id", //accessor is the "key" in the data
  //       //   },
  //       //   {
  //       //     Header: "Image",
  //       //     accessor: "image", //accessor is the "key" in the data
  //       //     Cell: (data: Cell) => (
  //       //       <TableImage file={data.row.values.image} folder="services" />
  //       //     ),
  //       //   },
  //       {
  //         Header: "Name",
  //         accessor: "name",
  //       },
  //       {
  //         Header: "Organisation Id",
  //         accessor: "category.name",
  //       },
  //       {
  //         Header: "Last Edited On",
  //         accessor: "created_at",
  //         Cell: (data: Cell) => {
  //           return <CreatedUpdatedAt date={data.row.values.created_at} />;
  //         },
  //       },
  //       {
  //         Header: "Is Published",
  //         accessor: "is_active",
  //         Cell: (data: Cell) => {
  //           return <IsActiveBadge value={data.row.values.is_active} />;
  //         },
  //       },
  //       {
  //         Header: "Is Archived",
  //         accessor: "is_archived",
  //         Cell: (data: Cell) => {
  //           return <IsActiveBadge value={data.row.values.is_active} />;
  //         },
  //       },
  //       {
  //         Header: "Actions",
  //         Cell: (data: Cell) => {
  //           return (
  //             <EditButton
  //               onClick={() => {
  //                 _onEditClick(data.row.values.id);
  //               }}
  //               permissionReq="update_service"
  //             />
  //           );
  //         },
  //       },
  //     ],
  //     []
  //   );

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
        Header: "Meta Title",
        accessor: "seoDetails.metaTitle",
      },
      //   {
      //     Header: "Meta Description",
      //     accessor: "seoDetails.metaDescription",
      //   },
      //   {
      //     Header: "Meta Keywords",
      //     accessor: (data) =>
      //       JSON.stringify(data?.row?.seoDetails?.metaKeywords) || "-",
      //   },
      //   {
      //     Header: "Featured Image",
      //     accessor: "seoDetails.socialFeaturedImage",
      //     Cell: ({ value }) => (
      //       <img src={value} alt="featured" style={{ width: 50 }} />
      //     ),
      //   },
      {
        Header: "Organisation ID",
        accessor: "organisationId",
      },
      {
        Header: "Last Edited",
        accessor: "lastEditedOn",
        Cell: (data: Cell) => {
          return <CreatedUpdatedAt date={data.row.values.lastEditedOn} />;
        },
      },
      {
        Header: "Published",
        accessor: "isPublished",
        Cell: ({ value }) => (value ? "Yes" : "No"),
      },
      {
        Header: "Archived",
        accessor: "isArchived",
        Cell: ({ value }) => (value ? "Yes" : "No"),
      },
      {
        Header: "Actions",
        Cell: (data: Cell) => {
          // console.log(data.row.values.id, "id", data);
          return (
            <ViewButton
              onClick={() => {
                _onEditClick(data.row.values.id);
              }}
              permissionReq="update_service"
            />
          );
        },
      },
    ],
    [history]
  );

  const filteredData = sampleData?.data?.filter(
    (item) => item.isArchived === Number(filter.isArchived)
  );

  const totalActive = sampleData?.data?.filter(
    (d) => d.isArchived === 0
  ).length;
  const totalArchived = sampleData?.data?.filter(
    (d) => d.isArchived === 1
  ).length;

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
          title="Websites"
          onClick={_onCreateClick}
          totalRecords={50}
          permissionReq="create_service"
        />

        {!isLoading && (
          <Container fluid className="px-0">
            <div>
              <div className="filter">
                <BreadCrumb
                  onFilterChange={_onFilterChange}
                  value="0"
                  currentValue={filter.isArchived}
                  dataLength={totalActive}
                  idx="isArchived"
                  //   idx="status"
                  title="Active"
                />
                <BreadCrumb
                  onFilterChange={_onFilterChange}
                  value="1"
                  currentValue={filter.isArchived}
                  dataLength={totalArchived}
                  //   idx="status"
                  idx="isArchived"
                  title="Archived"
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
                <ReactTable
                  //   data={sampleData?.data}
                  data={filteredData}
                  columns={columns}
                  setSelectedRows={setSelectedRows}
                  filter={filter}
                  onFilterChange={_onFilterChange}
                  isDataLoading={isFetching}
                  deletePermissionReq="delete_service"
                />
              )}
              {!error && sampleData?.data?.length > 0 ? (
                <TablePagination
                  currentPage={sampleData?.current_page}
                  lastPage={sampleData?.last_page}
                  setPage={_onFilterChange}
                  hasNextPage={!!sampleData?.next_page_url}
                  hasPrevPage={!!sampleData?.prev_page_url}
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

export default Website;
