import { AxiosError } from "axios";
import moment from "moment";
import React, { useMemo, useState } from "react";
import {
  Button,
  Col,
  Container,
  Dropdown,
  Form,
  Nav,
  Row,
} from "react-bootstrap";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { BiSad } from "react-icons/bi";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import { handleApiError } from "../../hooks/handleApiErrors";
import BreadCrumb from "../../shared-components/BreadCrumb";
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
import { NotificationSendToCategories } from "../../utils/arrays";
import { primaryColor, secondaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import Brands from "../Brands";
import { BsFunnel, BsThreeDotsVertical } from "react-icons/bs";
import { RiNotification2Line } from "react-icons/ri";

const key = "fcm-notification";
const intitialFilter = {
  q: "",
  page: null,
  perPage: 25,
  sent: "",
  send_to: "",
  scheduled_at: "",
};

const deleteNotification = (id: any[]) => {
  return API.post(`${key}/delete`, {
    id,
  });
};

const Notifications = () => {
  const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const [filter, setFilter] = useState(intitialFilter);
  const { data, isLoading, isFetching, error } = useQuery<any>(
    [key, , filter],
    {
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  const { mutate, isLoading: isDeleteLoading } = useMutation(
    deleteNotification,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(key);
        showMsgToast("Notifications deleted successfully");
      },
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  const _onCreateClick = () => {
    history.push("/notifications/create-edit");
  };
  const _onEditClick = (id: string) => {
    history.push("/notifications/create-edit", { id });
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
        Header: "Sent ?",
        accessor: "sent",
        Cell: (data: Cell) => {
          return <IsActiveBadge value={data.row.values.sent} />;
        },
      },
      {
        Header: "Send To ",
        accessor: "send_to",
        Cell: (data: Cell) => {
          return (
            <CustomBadge title={data.row.values.send_to} variant="primary" />
          );
        },
      },
      {
        Header: "Scheduled At",
        accessor: "scheduled_at",
        Cell: (data: Cell) => {
          return <CreatedUpdatedAt date={data.row.values.scheduled_at} />;
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
                permissionReq="update_notification"
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
      <div className="view-padding view-heading">
        <PageHeading
          icon={<RiNotification2Line size={20} />}
          title="Workflow Notifications"
          onClick={_onCreateClick}
          totalRecords={data?.total}
          permissionReq="create_notification"
        />
      </div>
      <hr />
      <div className="">
        {(() => {
          if (isLoading) return <IsLoading />;

          return (
            <>
              {!error && (
                <ReactTable
                  data={data?.data}
                  tabs={
                    <div className="d-flex justify-content-between">
                      <Nav
                        className="global-navs"
                        variant="tabs"
                        activeKey={filter.sent}
                        onSelect={(selectedKey) =>
                          _onFilterChange("sent", selectedKey)
                        }
                      >
                        <Nav.Item>
                          <Nav.Link eventKey="">
                            All ({data?.data?.length || 0})
                          </Nav.Link>
                        </Nav.Item>

                        <Nav.Item>
                          <Nav.Link eventKey="1">
                            Sent (
                            {data?.data?.filter((item) => item.status === "1")
                              .length || 0}
                            )
                          </Nav.Link>
                        </Nav.Item>

                        <Nav.Item>
                          <Nav.Link eventKey="0">
                            Not Sent (
                            {data?.data?.filter((item) => item.status === "0")
                              .length || 0}
                            )
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </div>
                  }
                  filters={
                    <Dropdown className="filter-dropdown">
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
                            currentValue={filter.send_to}
                            data={NotificationSendToCategories}
                            label="Send To"
                            idx="send_to"
                            onFilterChange={_onFilterChange}
                          />
                          <Form.Group>
                            <Form.Label className="text-muted">
                              Scheduled At
                            </Form.Label>
                            <Form.Control
                              type="date"
                              value={filter.scheduled_at}
                              onChange={(e) => {
                                const value = moment(e.target.value).format(
                                  "YYYY-MM-DD"
                                );
                                _onFilterChange("scheduled_at", value);
                              }}
                              style={{
                                fontSize: 14,
                                width: 150,
                                height: 35,
                              }}
                            />
                          </Form.Group>
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>
                  }
                  columns={columns}
                  setSelectedRows={setSelectedRows}
                  filter={filter}
                  onFilterChange={_onFilterChange}
                  isDataLoading={isFetching}
                  searchPlaceHolder="Search using title"
                  deletePermissionReq="delete_notification"
                />
              )}
              {!error && data.length > 0 ? (
                <TablePagination
                  currentPage={data?.current_page}
                  lastPage={data?.last_page}
                  setPage={_onFilterChange}
                  hasNextPage={!!data?.next_page_url}
                  hasPrevPage={!!data?.prev_page_url}
                />
              ) : null}{" "}
            </>
          );
        })()}
      </div>
      <hr />

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

export default Notifications;
