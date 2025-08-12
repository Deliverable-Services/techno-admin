import { AxiosError } from "axios";
import moment from "moment";
import { useMemo, useState } from "react";
import { Container, Dropdown, Form, Nav } from "../ui/bootstrap-compat";
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
import { NotificationSendToCategories } from "../../utils/arrays";
import { primaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import { useFlyout } from "../../hooks/useFlyout";
import Flyout from "../../shared-components/Flyout";
import NotificationCreateUpdateForm from "./NotificationCreateUpdateForm";
import { Hammer } from "../ui/icon";
import { Button } from "../ui/button";
import { BellRing } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./../ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { DatePicker } from "../ui/date";
import { Label } from "../ui/label";

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
  const { isOpen: showFlyout, openFlyout, closeFlyout } = useFlyout();
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
    // history.push("/notifications/create-edit");
    openFlyout();
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
            <div className="flex items-center justify-end gap-3">
              <EditButton
                onClick={() => {
                  _onEditClick(data.row.values.id);
                }}
                permissionReq="update_notification"
              />
              <Dropdown className="ellipsis-dropdown relative">
                <Dropdown.Toggle
                  variant="light"
                  size="sm"
                  className="p-1 border-0 shadow-none"
                  id={`dropdown-${data.row.values.id}`}
                >
                  <Hammer size={18} />
                </Dropdown.Toggle>
                <Dropdown.Menu className="menu-dropdown">
                  <Dropdown.Item
                    className="text-danger"
                    onClick={() => {
                      mutate(selectedRows.map((i) => i.id));
                    }}
                  >
                    <Hammer size={16} className="me-1" />
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

  const _onDateFilterChange = (newDate) => {
    const value = moment(newDate).format("YYYY-MM-DD");
    _onFilterChange("scheduled_at", value);
  };

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
          icon={<BellRing size={24} />}
          title="Notifications"
          description="Create and manage notifications for your workflow"
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
                      <Tabs
                        onValueChange={(selectedKey) =>
                          _onFilterChange("sent", selectedKey)
                        }
                        defaultValue={filter.sent}
                      >
                        <TabsList className="mb-2">
                          <TabsTrigger value="" key={""}>
                            All ({data?.data?.length || 0})
                          </TabsTrigger>
                          <TabsTrigger value="1" key="1">
                            Sent (
                            {data?.data?.filter((item) => item.status === "1")
                              .length || 0}
                            ){" "}
                          </TabsTrigger>
                          <TabsTrigger value="0" key="0">
                            Not Sent (
                            {data?.data?.filter((item) => item.status === "0")
                              .length || 0}
                            ){" "}
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  }
                  filters={
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <div className="flex gap-1">
                          <Hammer /> Filters
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>
                          <div className="flex gap-4 items-center justify-between">
                            My Account
                            <Button
                              variant={
                                areTwoObjEqual(intitialFilter, filter)
                                  ? "outline"
                                  : "default"
                              }
                              style={{
                                fontSize: 14,
                              }}
                              onClick={() => setFilter(intitialFilter)}
                            >
                              Reset Filters
                            </Button>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <div className="select-filter p-2 pb-0">
                          <div className="mb-2">
                            <FilterSelect
                              currentValue={filter.send_to}
                              data={NotificationSendToCategories}
                              label="Send To"
                              idx="send_to"
                              onFilterChange={_onFilterChange}
                              className="w-full"
                            />
                          </div>

                          {/* <Form.Group> */}
                          <div>
                            <Label className="text-muted">Scheduled At</Label>

                            <DatePicker
                              defaultDate={filter.scheduled_at}
                              _onFilterChange={_onDateFilterChange}
                              placeholder="Pick a date"
                            />
                          </div>

                          {/* <Form.Control
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
                            /> */}
                          {/* </Form.Group> */}
                        </div>

                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Team</DropdownMenuItem>
                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

      {selectedRows.length > 0 && (
        <div className="delete-button rounded">
          <span>
            <b>Delete {selectedRows.length} rows</b>
          </span>
          <Button
            variant="destructive"
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
        title={"Create Notifications"}
        cancelText="Cancel"
        width="800px"
      >
        <NotificationCreateUpdateForm />
      </Flyout>
    </>
  );
};

export default Notifications;
