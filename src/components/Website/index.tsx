import { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { BiCopy, BiSad } from "react-icons/bi";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import { handleApiError } from "../../hooks/handleApiErrors";
import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import EditButton from "../../shared-components/EditButton";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import API from "../../utils/API";
import { primaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import ViewButton from "../../shared-components/ViewButton";
import BreadCrumb from "../../shared-components/BreadCrumb";
import { AiFillDelete } from "react-icons/ai";

const key = "pages";

const deletePage = (id: Array<any>) => {
  return API.delete(`${key}/${id}`);
};
const copyPage = (id: Array<any>) => {
  return API.post(`${key}/${id}/duplicate`);
};

const intitialFilter = {
  q: "",
  page: null,
  perPage: 25,
  isArchived: false,
};

const Website = () => {
  const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  console.log(selectedRows.map((item) => item.id));
  const [filter, setFilter] = useState(intitialFilter);
  console.log({ filter });
  const {
    data: pageData,
    isLoading,
    isFetching,
    error,
  } = useQuery<any>([key, , filter], {
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  console.log("pageData", pageData);
  pageData?.data?.map((page, i) => {
    page["isArchived"] = i === pageData.data.length - 1 ? true : false;
  });

  const { mutate: mutateDelete, isLoading: isDeleteLoading } = useMutation(
    deletePage,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(key);
        showMsgToast("Page deleted successfully");
      },
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  const { mutate: mutateCopy, isLoading: isCopyLoading } = useMutation(
    copyPage,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(key);
        showMsgToast("Page duplicated successfully");
      },
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  const _onCreateClick = () => {
    history.push("/website/create-edit");
  };
  const _onEditClick = (id: string) => {
    history.push(`/website/create-edit`, { id });
  };
  const _onViewClick = (id: string) => {
    history.push(`/website/${id}`);
  };

  const _onFilterChange = (idx: string, value: any) => {
    const parsedValue =
      value === "true" ? true : value === "false" ? false : value;
    setFilter((prev) => ({
      ...prev,
      [idx]: parsedValue,
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
        Header: "Organisation ID",
        accessor: "organisation_id",
      },
      {
        Header: "Slug",
        accessor: "slug",
      },
      {
        Header: "Meta Title",
        accessor: "seo_details.title",
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
        Header: "Last Edited",
        accessor: "last_edited_on",
        Cell: (data: Cell) => {
          return <CreatedUpdatedAt date={data.row.values.last_edited_on} />;
        },
      },
      {
        Header: "Published",
        accessor: "is_published",
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
          if (data.row.values.isArchived) return null;
          return (
            <div className="d-flex align-items-center gap-3">
              <ViewButton
                onClick={() => {
                  _onViewClick(data.row.values.id);
                }}
                permissionReq="update_service"
              />
              <EditButton
                onClick={() => {
                  _onEditClick(data.row.values.id);
                }}
                permissionReq="update_service"
              />
              <Button
                variant="outline-primary"
                className="d-flex align-items-center"
                onClick={() => {
                  mutateCopy(data.row.values.id);
                }}
                style={{ padding: "0.25rem 0.5rem" }}
              >
                <BiCopy size={16} className="mr-1" /> Duplicate
              </Button>
              <Button
                variant="outline-danger"
                className="d-flex align-items-center"
                onClick={() => {
                  mutateDelete(data.row.values.id);
                }}
                style={{ padding: "0.25rem 0.5rem" }}
              >
                <AiFillDelete size={16} className="mr-1" /> Delete
              </Button>
            </div>
          );
        },
      },
    ],
    [history]
  );

  const filteredData = pageData?.data?.filter(
    (item) => item.isArchived === filter.isArchived
  );

  const totalCount = pageData?.data?.filter(
    (d) => d.isArchived === filter.isArchived
  ).length;

  if (!pageData && (!isLoading || !isFetching)) {
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
          totalRecords={pageData?.data?.length || 0}
          permissionReq="create_service"
        />

        {!isLoading && (
          <Container fluid className="px-0">
            <div>
              <div className="filter">
                <BreadCrumb
                  onFilterChange={_onFilterChange}
                  value="false"
                  currentValue={filter.isArchived.toString()}
                  dataLength={totalCount}
                  idx="isArchived"
                  title="Active"
                />
                <BreadCrumb
                  onFilterChange={_onFilterChange}
                  value="true"
                  currentValue={filter.isArchived.toString()}
                  dataLength={totalCount}
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
                  data={filteredData}
                  // data={pageData?.data || []}
                  columns={columns}
                  setSelectedRows={setSelectedRows}
                  filter={filter}
                  onFilterChange={_onFilterChange}
                  isDataLoading={isFetching}
                  deletePermissionReq="delete_service"
                />
              )}
              {!error && pageData?.data?.length > 0 ? (
                <TablePagination
                  currentPage={pageData?.pagination?.current_page}
                  lastPage={pageData?.pagination?.last_page}
                  setPage={_onFilterChange}
                  hasNextPage={!!pageData?.pagination?.next_page_url}
                  hasPrevPage={!!pageData?.pagination?.prev_page_url}
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
              mutateDelete(selectedRows.map((i) => i.id));
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
