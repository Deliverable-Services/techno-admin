import { AxiosError } from "axios";
import { useMemo, useState } from "react";
import { Button, Container, Dropdown, Nav } from "react-bootstrap";
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
import { CommonModal } from "../CommonPopup/CommonModal";
import DynamicPageCreateUpdateForm from "./DynamicPageCreateUpdateForm";
import { BsEye, BsThreeDotsVertical } from "react-icons/bs";

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

const DynamicPages = () => {
  const history = useHistory();

  const [selectedRows, setSelectedRows] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  console.log(selectedRows.map((item) => item.id));
  const [filter, setFilter] = useState(intitialFilter);

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

  // console.log("pageData", pageData);
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
    history.push("/website-pages/dynamic/create-edit");
  };
  const _onEditClick = (id: string) => {
    history.push(`/website-pages/dynamic/create-edit`, { id });
  };
  const _onViewClick = (id: string) => {
    history.push(`/website-pages/dynamic/${id}`);
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
            <div className="d-flex align-items-center justify-content-end gap-3">
              <EditButton
                onClick={() => {
                  _onEditClick(data.row.values.id);
                }}
                permissionReq="update_service"
              />
              <Dropdown className="ellipsis-dropdown">
                <Dropdown.Toggle
                  variant="light"
                  size="sm"
                  className="p-1 border-0 shadow-none"
                  id={`dropdown-${data.row.values.id}`}
                >
                  <BsThreeDotsVertical size={18} />
                </Dropdown.Toggle>

                <Dropdown.Menu className="menu-dropdown">
                  <Dropdown.Item
                    onClick={() => {
                      _onViewClick(data.row.values.id);
                    }}
                  >
                    <BsEye size={16} className="me-1" />
                    View
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      mutateCopy(data.row.values.id);
                    }}
                  >
                    <BiCopy size={16} className="me-1" />
                    Duplicate
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      mutateDelete(data.row.values.id);
                    }}
                    className="text-danger"
                  >
                    <AiFillDelete size={16} className="me-1" />
                    Delete
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          );
        },
      },
    ],
    [history]
  );

  const _toggleModal = () => {
    setModalShow(!modalShow);
  };

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
      <CommonModal
        modalShow={modalShow}
        onModalHideClick={_toggleModal}
        title="Create New Page"
      >
        <DynamicPageCreateUpdateForm toggleModal={_toggleModal} />
      </CommonModal>
      <div className="view-padding">
        <PageHeading
          title="Dynamic Pages"
          onClick={_toggleModal}
          totalRecords={pageData?.data?.length || 0}
          permissionReq="create_service"
        />
      </div>

      <div className="h-100 p-0">
        {isLoading ? (
          <IsLoading />
        ) : (
          <>
            {!error && (
              <ReactTable
                data={filteredData}
                tabs={
                  <div className="d-flex justify-content-between">
                    <Nav
                      className="global-navs"
                      variant="tabs"
                      activeKey={filter.isArchived.toString()}
                      onSelect={(selectedKey) =>
                        _onFilterChange("isArchived", selectedKey)
                      }
                    >
                      <Nav.Item>
                        <Nav.Link eventKey="false">
                          Active {totalCount}
                        </Nav.Link>
                      </Nav.Item>

                      <Nav.Item>
                        <Nav.Link eventKey="true">
                          Archived {totalCount}
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </div>
                }
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
      </div>

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

export default DynamicPages;
