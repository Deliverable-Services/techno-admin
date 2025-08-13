import { AxiosError } from "axios";
import moment from "moment";
import { useMemo, useState } from "react";
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
import { BellRing, Funnel, Trash2, EllipsisVertical } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./../ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
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
  return API.post(`${key}/delete`, { id });
};

const Notifications = () => {
  const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const [filter, setFilter] = useState(intitialFilter);
  const { isOpen: showFlyout, openFlyout, closeFlyout } = useFlyout();

  const { data, isLoading, isFetching, error } = useQuery<any>([key, filter], {
    onError: (error: AxiosError) => handleApiError(error, history),
  });

  const { mutate, isLoading: isDeleteLoading } = useMutation(deleteNotification, {
    onSuccess: () => {
      queryClient.invalidateQueries(key);
      showMsgToast("Notifications deleted successfully");
    },
    onError: (error: AxiosError) => handleApiError(error, history),
  });

  const _onCreateClick = () => openFlyout();
  const _onEditClick = (id: string) => {
    history.push("/notifications/create-edit", { id });
  };

  const _onFilterChange = (idx: string, value: any) => {
    setFilter((prev) => ({ ...prev, [idx]: value }));
  };

  const columns = useMemo(
    () => [
      { Header: "#Id", accessor: "id" },
      { Header: "Title", accessor: "title" },
      {
        Header: "Sent ?",
        accessor: "sent",
        Cell: (data: Cell) => <IsActiveBadge value={data.row.values.sent} />,
      },
      {
        Header: "Send To",
        accessor: "send_to",
        Cell: (data: Cell) => (
          <CustomBadge title={data.row.values.send_to} variant="primary" />
        ),
      },
      {
        Header: "Scheduled At",
        accessor: "scheduled_at",
        Cell: (data: Cell) => (
          <CreatedUpdatedAt date={data.row.values.scheduled_at} />
        ),
      },
      {
        Header: "Created At",
        accessor: "created_at",
        Cell: (data: Cell) => (
          <CreatedUpdatedAt date={data.row.values.created_at} />
        ),
      },
      {
        Header: "Updated At",
        accessor: "updated_at",
        Cell: (data: Cell) => (
          <CreatedUpdatedAt date={data.row.values.updated_at} />
        ),
      },
      {
        Header: "Actions",
        Cell: (data: Cell) => (
          <div className="flex items-center justify-end gap-2">
            <EditButton
              onClick={() => _onEditClick(data.row.values.id)}
              permissionReq="update_notification"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 rounded hover:bg-gray-100">
                  <EllipsisVertical size={18} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border rounded shadow-md">
                <DropdownMenuItem
                  onClick={() => mutate([data.row.values.id])}
                  className="text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={16} className="mr-1" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
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
      <div className="w-full flex flex-col items-center justify-center py-12">
        <Hammer color={primaryColor} />
        <span className="text-primary text-2xl">Something went wrong</span>
      </div>
    );
  }

  return (
    <>
      <div className="p-4">
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

      <div>
        {isLoading ? (
          <IsLoading />
        ) : (
          <>
            {!error && (
              <ReactTable
                data={data?.data}
                tabs={
                  <div className="flex justify-between">
                    <Tabs
                      onValueChange={(selectedKey) =>
                        _onFilterChange("sent", selectedKey)
                      }
                      defaultValue={filter.sent}
                    >
                      <TabsList className="mb-2">
                        <TabsTrigger value="">
                          All ({data?.data?.length || 0})
                        </TabsTrigger>
                        <TabsTrigger value="1">
                          Sent (
                          {data?.data?.filter((i) => i.status === "1").length ||
                            0}
                          )
                        </TabsTrigger>
                        <TabsTrigger value="0">
                          Not Sent (
                          {data?.data?.filter((i) => i.status === "0").length ||
                            0}
                          )
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                }
                filters={
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full flex items-center justify-between rounded-lg border border-gray-300 h-9 px-3">
                      <span className="flex items-center gap-2">
                        <Funnel size={14} /> Filters
                      </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[400px] p-3">
                      <DropdownMenuLabel>
                        <div className="flex items-center justify-between">
                          My Account
                          <Button
                            variant={
                              areTwoObjEqual(intitialFilter, filter)
                                ? "outline"
                                : "default"
                            }
                            className="text-sm"
                            onClick={() => setFilter(intitialFilter)}
                          >
                            Reset Filters
                          </Button>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className="p-2">
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
                        <div>
                          <Label className="text-gray-500">Scheduled At</Label>
                          <DatePicker
                            defaultDate={filter.scheduled_at}
                            _onFilterChange={_onDateFilterChange}
                            placeholder="Pick a date"
                          />
                        </div>
                      </div>
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
            {!error && data?.length > 0 && (
              <TablePagination
                currentPage={data?.current_page}
                lastPage={data?.last_page}
                setPage={_onFilterChange}
                hasNextPage={!!data?.next_page_url}
                hasPrevPage={!!data?.prev_page_url}
              />
            )}
          </>
        )}
      </div>

      {selectedRows.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white border rounded shadow p-4 flex items-center gap-4">
          <span>
            <b>Delete {selectedRows.length} rows</b>
          </span>
          <Button
            variant="destructive"
            onClick={() => mutate(selectedRows.map((i) => i.id))}
          >
            {isDeleteLoading ? "Loading..." : "Delete"}
          </Button>
        </div>
      )}

      <Flyout
        isOpen={showFlyout}
        onClose={closeFlyout}
        title="Create Notifications"
        cancelText="Cancel"
        width="800px"
      >
        <NotificationCreateUpdateForm />
      </Flyout>
    </>
  );
};

export default Notifications;
