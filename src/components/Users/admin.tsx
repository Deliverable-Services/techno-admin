import { AxiosError } from "axios";
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
import TableImage from "../../shared-components/TableImage";
import API from "../../utils/API";
import { areTwoObjEqual } from "../../utils/areTwoObjEqual";
import { isActiveArray } from "../../utils/arrays";
import { primaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import { CommonModal } from "../CommonPopup/CommonModal";
import UserCreateUpdateForm from "./UsersCreateUpdateForm";
import { Hammer } from "../ui/icon";
import { UserStar, Funnel, Trash2, EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "../ui/dropdown-menu";

interface IFilter {
  role: string | null;
}
const key = "users";

const deleteUsers = (id: Array<any>) => {
  return API.post(`${key}/delete`, { id });
};

const intitialFilter = {
  q: "",
  role: "admin",
  page: null,
  perPage: 25,
  disabled: "",
};

const Admins = () => {
  const history = useHistory();
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filter, setFilter] = useState(intitialFilter);
  const [modalShow, setModalShow] = useState(false);
  const [role, setRole] = useState("");

  const { data, isLoading, isFetching, error } = useQuery<any>([key, , filter], {
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

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
    history.push("/users/create-edit", { role: "admin" });
  };

  const _onEditClick = (id: string, role: string) => {
    history.push("/users/create-edit", { id, role });
  };

  const columns = useMemo(
    () => [
      {
        Header: "#Id",
        accessor: "id",
      },
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
              onClick={() =>
                _onEditClick(data.row.values.id, data.row.values.role)
              }
              permissionReq="update_user"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 rounded hover:bg-gray-100">
                  <EllipsisVertical size={18} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border rounded shadow-md">
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedDeleteId(data.row.values.id);
                    setDeletePopup(true);
                  }}
                  className="text-red-500 cursor-pointer hover:bg-red-50 px-4 py-2"
                >
                  <Trash2 size={16} className="ml-1" />
                  Delete
                  
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    []
  );

  if (!data && (!isLoading || !isFetching)) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center text-center">
          <Hammer color={primaryColor} />
          <span className="text-primary text-2xl">Something went wrong</span>
        </div>
      </div>
    );
  }

  const _toggleModal = () => setModalShow(!modalShow);

  return (
    <>
      <CommonModal
        modalShow={modalShow}
        onModalHideClick={_toggleModal}
        title="Create New Team Member"
      >
        <UserCreateUpdateForm toggleModal={_toggleModal} />
      </CommonModal>

      <div className="p-4">
        <PageHeading
          icon={<UserStar size={24} />}
          title="Team Members"
          description="Create and manage team members for your workflow"
          onClick={_toggleModal}
          totalRecords={data?.total}
          permissionReq="create_user"
        />
      </div>

      <hr />

      <div className="p-4">
        {isLoading ? (
          <IsLoading />
        ) : (
          <>
            {!error && (
              <>
                <ReactTable
                  data={data?.data}
                  filters={
                    <DropdownMenu>
                      <DropdownMenuTrigger className="w-full flex items-center justify-between rounded-lg py-1 px-3 border border-gray-300 h-9">
                        <span className="flex items-center gap-2 w-full">
                          <Funnel size={14} /> Filters
                        </span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[400px] p-3">
                        <div className="flex justify-between items-center mb-3">
                          <h4>Filter</h4>
                          <button
                            className={`px-3 py-1 rounded text-sm ${
                              areTwoObjEqual(intitialFilter, filter)
                                ? "bg-gray-200 text-gray-700"
                                : "bg-blue-500 text-white"
                            }`}
                            onClick={() => setFilter(intitialFilter)}
                          >
                            Reset Filters
                          </button>
                        </div>
                        <FilterSelect
                          currentValue={filter.disabled}
                          data={isActiveArray}
                          label="Disabled Users?"
                          idx="disabled"
                          onFilterChange={_onFilterChange}
                          defaultSelectTitle="Show All"
                        />
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
              </>
            )}
            {!error && data?.data?.length > 0 && (
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

      {/* Delete Confirmation Modal */}
      {deletePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="border-b px-4 py-2 flex justify-between items-center">
              <h2 className="font-semibold">Are you sure?</h2>
              <button
                onClick={() => setDeletePopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="px-4 py-3">
              Do you really want to delete this user? This process cannot be
              undone.
            </div>
            <div className="flex justify-end gap-2 px-4 py-3 border-t">
              <button
                onClick={() => setDeletePopup(false)}
                className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (selectedDeleteId) {
                    mutate([selectedDeleteId]);
                    setDeletePopup(false);
                    setSelectedDeleteId(null);
                  }
                }}
                disabled={isDeleteLoading}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                {isDeleteLoading ? "Loading..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedRows.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 flex items-center gap-4">
          <span>
            <b>Delete {selectedRows.length} rows</b>
          </span>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            onClick={() => {
              mutate(selectedRows.map((i) => i.id));
            }}
          >
            {isDeleteLoading ? "Loading..." : "Delete"}
          </button>
        </div>
      )}
    </>
  );
};

export default Admins;
