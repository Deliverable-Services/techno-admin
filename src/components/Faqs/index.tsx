import { AxiosError } from "axios";
import { useMemo, useState } from "react";
import { Button, Container, Dropdown, Nav } from "react-bootstrap";
import { BiSad } from "react-icons/bi";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
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
import { primaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import { FaQuestionCircle } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";

const key = "faqs";

const deleteFaqs = (id: Array<any>) => {
  return API.post(`${key}/delete`, { id });
};

const intitialFilter = {
  q: "",
  page: 1,
  perPage: 25,
  active: "",
};
const Faqs = () => {
  const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const [filter, setFilter] = useState(intitialFilter);
  console.log(selectedRows.map((item) => item.id));
  const { data, isLoading, isFetching, error } = useQuery<any>(
    [key, , filter],
    {
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  const { mutate, isLoading: isDeleteLoading } = useMutation(deleteFaqs, {
    onSuccess: () => {
      queryClient.invalidateQueries(key);
      showMsgToast("Faqs deleted successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const _onCreateClick = () => {
    history.push("/faqs/create-edit");
  };
  const _onEditClick = (id: string) => {
    history.push("/faqs/create-edit", { id });
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
            <div className="d-flex align-items-center justify-content-end gap-3">
              <EditButton
                onClick={() => {
                  _onEditClick(data.row.values.id);
                }}
                permissionReq="update_faq"
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
                    className="text-danger"
                    onClick={() => {
                      mutate(selectedRows.map((i) => i.id));
                    }}
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
      <div className=" view-padding">
        <PageHeading
          icon={<FaQuestionCircle size={24} />}
          description="Create and manage faqs"
          title="Faqs"
          onClick={_onCreateClick}
          totalRecords={data?.total}
          permissionReq="create_faq"
        />
      </div>
      <hr />

      <div className="">
        <Container fluid className="h-100 p-0 pt-3">
          {isLoading ? (
            <IsLoading />
          ) : (
            <>
              {!error && (
                <ReactTable
                  tabs={<div className="d-flex justify-content-between">
                    {!isLoading && (
                      <Nav className="global-navs" variant="tabs" activeKey={filter.active} onSelect={(selectedKey) => _onFilterChange('active', selectedKey)}>
                        <Nav.Item>
                          <Nav.Link eventKey="">All ({data?.data?.length || 0})</Nav.Link>
                        </Nav.Item>

                        <Nav.Item>
                          <Nav.Link eventKey="active">
                            Active ({data?.data?.filter(item => item.status === '1').length || 0})
                          </Nav.Link>
                        </Nav.Item>

                        <Nav.Item>
                          <Nav.Link eventKey="notActive">
                            Not Active ({data?.data?.filter(item => item.status === '0').length || 0})
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    )}
                  </div>}
                  data={data?.data}
                  columns={columns}
                  setSelectedRows={setSelectedRows}
                  filter={filter}
                  onFilterChange={_onFilterChange}
                  isDataLoading={isFetching}
                  searchPlaceHolder="Search using title"
                  deletePermissionReq="delete_faq"
                />
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
    </>
  );
};

export default Faqs;
