import { AxiosError } from "axios";
import { useMemo, useState } from "react";
import UserCreateUpdateForm from "./UsersCreateUpdateForm";
import Flyout from "../../shared-components/Flyout";
import { useFlyout } from "../../hooks/useFlyout";
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
import TableImage from "../../shared-components/TableImage";
import API from "../../utils/API";
import { areTwoObjEqual } from "../../utils/areTwoObjEqual";
import { isActiveArray } from "../../utils/arrays";
import { primaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import { UsersRound, Funnel, Frown, EllipsisVertical, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";

const key = "users";

const deleteUsers = (id: Array<any>) => {
  return API.post(`${key}/delete`, { id });
};

const intitialFilter = {
  role: "customer",
  q: "",
  page: null,
  perPage: 25,
  disabled: "",
};

const Users = () => {
  const history = useHistory();
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filter, setFilter] = useState(intitialFilter);
  const [role, setRole] = useState("");
  const { isOpen: showFlyout, openFlyout, closeFlyout } = useFlyout();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserRole, setSelectedUserRole] = useState<string>("customer");

  const { data, isLoading, isFetching, error } = useQuery<any>(
    [key, , filter],
    {
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  const { mutate, isLoading: isDeleteLoading } = useMutation(deleteUsers, {
    onSuccess: () => {
      queryClient.invalidateQueries(key);
      showMsgToast("Users deleted successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const _onFilterChange = (idx: string, value: any) => {
    setFilter((prev) => ({ ...prev, [idx]: value }));
  };

  const _onCreateClick = () => {
    setSelectedUserId(null);
    setSelectedUserRole("customer");
    openFlyout();
  };

  const _onEditClick = (id: string, role: string) => {
    openFlyout();
  };

  const columns = useMemo(
    () => [
      { Header: "#Id", accessor: "id" },
      {
        Header: "Profile Pic",
        accessor: "profile_pic",
        Cell: (data: Cell) => (
          <TableImage folder="profile_pic" file={data.row.values.profile_pic} />
        ),
      },
      { Header: "Name", accessor: "name" },
      { Header: "Phone", accessor: "phone" },
      { Header: "Email", accessor: "email" },
      {
        Header: "Role",
        accessor: "role",
        Cell: (data: Cell) => (
          <CustomBadge variant="primary" title={data.row.values.role} />
        ),
      },
      { Header: "Wallet Balance", accessor: "wallets.balance" },
      {
        Header: "Disabled?",
        accessor: "disabled",
        Cell: (data: Cell) => <IsActiveBadge value={data.row.values.disabled} />,
      },
      {
        Header: "Created At",
        accessor: "created_at",
        Cell: (data: Cell) => (
          <CreatedUpdatedAt date={data.row.values.created_at} />
        ),
      },
      {
        Header: "Actions",
        Cell: (data: Cell) => (
          <div className="flex items-center justify-end gap-3">
            <EditButton
              onClick={() => _onEditClick(data.row.values.id, data.row.values.role)}
              permissionReq="update_notification"
            />
            <DropdownMenu>
              <DropdownMenuTrigger className="p-1 border-0 shadow-none">
                <EllipsisVertical size={18} />
                
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-2 w-40">
                <button
                  onClick={() => {
                    setSelectedDeleteId(data.row.values.id);
                    setDeletePopup(true);
                  }}
                  className="flex items-center text-red-500 hover:bg-red-50 px-2 py-1 rounded"
                >
                  <Trash2 size={16} className="mr-1" /> Delete
                
                </button>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <>
      <div className="p-4">
        <PageHeading
          icon={<UsersRound size={24} />}
          description="Create and manage customers"
          title="Customers"
          onClick={_onCreateClick}
          totalRecords={data?.total}
          btnText="Create Customer"
          permissionReq="create_user"
        />
      </div>
      <hr className="my-4" />

      {(() => {
        if (isLoading || isFetching) return <IsLoading />;

        if (error || (!data && (!isLoading || !isFetching))) {
          return (
            <div className="w-full px-4 flex justify-center text-3xl">
              <div className="flex flex-col items-center">
                <Frown color={primaryColor} />
                <span className="text-primary text-3xl">
                  Something went wrong
                </span>
              </div>
            </div>
          );
        }

        return (
          <>
            <ReactTable
              data={data?.data}
              filters={
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full flex items-center justify-between border border-gray-300 h-9 rounded px-3">
                    <span className="flex items-center gap-2 w-full">
                      <Funnel size={14} /> Filters
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[400px] p-3">
                    <div className="flex justify-between w-full">
                      <h4>Filter</h4>
                      <button
                        className={`text-sm px-3 py-1 rounded ${
                          areTwoObjEqual(intitialFilter, filter)
                            ? "bg-gray-200 text-gray-700"
                            : "bg-blue-500 text-white"
                        }`}
                        onClick={() => setFilter(intitialFilter)}
                      >
                        Reset Filters
                      </button>
                    </div>
                    <div className="mt-2">
                      <FilterSelect
                        currentValue={filter.disabled}
                        data={isActiveArray}
                        label="Disabled Users?"
                        idx="disabled"
                        onFilterChange={_onFilterChange}
                        defaultSelectTitle="Show All"
                      />
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              }
              columns={columns}
              setSelectedRows={setSelectedRows}
              filter={filter}
              onFilterChange={_onFilterChange}
              isDataLoading={isFetching}
              searchPlaceHolder="Search using name, phone, email"
              deletePermissionReq="delete_user"
            />
            {data?.data?.length > 0 && (
              <TablePagination
                currentPage={data?.current_page}
                lastPage={data?.last_page}
                setPage={_onFilterChange}
                hasNextPage={!!data?.next_page_url}
                hasPrevPage={!!data?.prev_page_url}
              />
            )}
          </>
        );
      })()}

      {deletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Are you sure?</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setDeletePopup(false)}
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              Do you really want to delete this user? This process cannot be undone.
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setDeletePopup(false)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => {
                  if (selectedDeleteId) {
                    mutate([selectedDeleteId]);
                    setDeletePopup(false);
                    setSelectedDeleteId(null);
                  }
                }}
                disabled={isDeleteLoading}
              >
                {isDeleteLoading ? "Loading..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedRows.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white border rounded shadow-lg p-3 flex items-center gap-4">
          <span>
            <b>Delete {selectedRows.length} rows</b>
          </span>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => mutate(selectedRows.map((i) => i.id))}
          >
            {isDeleteLoading ? "Loading..." : "Delete"}
          </button>
        </div>
      )}

      <Flyout
        isOpen={showFlyout}
        onClose={closeFlyout}
        title={selectedUserId ? "Edit User" : "Create User"}
        cancelText="Cancel"
      >
        <UserCreateUpdateForm
          toggleModal={closeFlyout}
          id={selectedUserId}
          role={selectedUserRole}
        />
      </Flyout>
    </>
  );
};

export default Users;
