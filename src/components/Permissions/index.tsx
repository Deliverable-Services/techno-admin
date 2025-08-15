import { AxiosError } from "axios";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import { handleApiError } from "../../hooks/handleApiErrors";
import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import Restricted from "../../shared-components/Restricted";
import API from "../../utils/API";
import { primaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import { CommonModal } from "../CommonPopup/CommonModal";
import PermissionsCreateUpdateForm from "./PermissoinsCreateUpdateForm";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Hammer } from "../ui/icon";
import { Trash2 } from 'lucide-react';


const key = "get-all-permission";

const deleteBrand = (id: Array<any>) => {
  return API.post(`${key}/delete`, { id });
};

const intitialFilter = {
  active: "",
  q: "",
  page: 1,
  perPage: 25,
};

export default function Permissions() {
  const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [activeTab, setActiveTab] = useState<"roles" | "permissions">("roles");
  const [filter, setFilter] = useState(intitialFilter);

  const { data, isLoading, isFetching, error } = useQuery<any>(
    [key, , filter],
    {
      onError: (error: AxiosError) => handleApiError(error, history),
    }
  );

  const { data: RolesPermission, isLoading: isRolesPermissionLoading, isFetching: isRolesPermissoinFetch, error: RolesPermissionError } =
    useQuery<any>(["roles-with-permission", , filter], {
      onError: (error: AxiosError) => handleApiError(error, history),
    });

  const { mutate, isLoading: isDeleteLoading } = useMutation(deleteBrand, {
    onSuccess: () => {
      queryClient.invalidateQueries(key);
      showMsgToast("Permission deleted successfully");
    },
    onError: (error: AxiosError) => handleApiError(error, history),
  });

  const _onCreateClick = () => setModalShow(true);
  const _onRolesCreateClick = () => history.push("/assign-permission/create-edit");
  const _onEditClick = (id: string) => history.push("/permissions/create-edit", { id });
  const _onGiveClick = (id: string) => history.push("/assign-permission/create-edit", { id });
  const _onRevokeClick = (id: string) => history.push("/revoke-permission/create-edit", { id });

  const _onFilterChange = (idx: string, value: any) => {
    setFilter(prev => ({ ...prev, [idx]: value }));
  };

  const columns = useMemo(
    () => [
      { Header: "Role", accessor: "name" },
      {
        Header: "Permissions",
        accessor: "permissions",
        Cell: (data: Cell) => {
          const list = data.row.values.permissions.map((x) => x.name).join(", ");
          return <span>{list}</span>;
        },
      },
      { Header: "Created At", accessor: "created_at", Cell: (data: Cell) => <CreatedUpdatedAt date={data.row.values.created_at} /> },
      { Header: "Updated At", accessor: "updated_at", Cell: (data: Cell) => <CreatedUpdatedAt date={data.row.values.updated_at} /> },
      {
        Header: "Actions",
        Cell: (data: Cell) => (
          <div className="flex gap-2">
            <Restricted to="assign_permission">
              <button
                onClick={() => _onGiveClick((data.row.original as any).id)}
                className="border border-blue-500 text-blue-500 rounded px-2 py-1 text-sm hover:bg-blue-50"
              >
                Give
              </button>
            </Restricted>
            <Restricted to="revoke_permission">
              <button
                onClick={() => _onRevokeClick((data.row.original as any).id)}
                className="border border-red-500 text-red-500 rounded px-2 py-1 text-sm hover:bg-red-50"
              >
                Revoke
              </button>
            </Restricted>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 rounded hover:bg-gray-100">
                  <Trash2 size={18} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border rounded shadow-md">
                <DropdownMenuItem
                  onClick={() => mutate([(data.row.original as any).id])}
                  className="text-red-500 cursor-pointer hover:bg-red-50 px-4 py-2"
                >
                  <Trash2 size={16} className="mr-1" />
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

  const permissionColumn = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        Cell: (data: Cell) => (
          <span>
            {data.row.values.name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </span>
        ),
      },
      { Header: "Created At", accessor: "created_at", Cell: (data: Cell) => <CreatedUpdatedAt date={data.row.values.created_at} /> },
      { Header: "Updated At", accessor: "updated_at", Cell: (data: Cell) => <CreatedUpdatedAt date={data.row.values.updated_at} /> },
    ],
    []
  );

  if (!data && (!isLoading || !isFetching)) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="flex flex-col items-center">
          <Hammer color={primaryColor} />
          <span className="text-blue-500 text-xl">Something went wrong</span>
        </div>
      </div>
    );
  }

  if (!RolesPermission && (!isRolesPermissionLoading || !isRolesPermissoinFetch)) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="flex flex-col items-center">
          <Hammer color={primaryColor} />
          <span className="text-blue-500 text-xl">Something went wrong</span>
        </div>
      </div>
    );
  }

  const _toggleModal = () => setModalShow(!modalShow);

  const getCurrentData = () => (activeTab === "roles" ? RolesPermission?.role : data);
  const getCurrentColumns = () => (activeTab === "roles" ? columns : permissionColumn);
  const getCurrentLoading = () => (activeTab === "roles" ? isRolesPermissionLoading : isLoading);
  const getCurrentFetching = () => (activeTab === "roles" ? isRolesPermissoinFetch : isFetching);
  const getCurrentError = () => (activeTab === "roles" ? RolesPermissionError : error);
  const getCurrentTotalRecords = () => (activeTab === "roles" ? RolesPermission?.total : data?.total);

  return (
    <>
      <CommonModal title="Create New Permission" modalShow={modalShow} onModalHideClick={_toggleModal}>
        <PermissionsCreateUpdateForm setShowModal={_toggleModal} />
      </CommonModal>

      <div className="p-4">
        <PageHeading
          title={activeTab === "roles" ? "Roles" : "Permissions"}
          description={activeTab === "roles" ? "Roles for your workflow" : "Permissions for your workflow"}
          onClick={activeTab === "permissions" ? _onCreateClick : undefined}
          totalRecords={getCurrentTotalRecords()}
          permissionReq={activeTab === "permissions" ? "create_permission" : undefined}
        />
      </div>

      <div className="px-4">
        <div className="flex gap-2 bg-white px-2 border border-[#eee] !max-w-max border-[var(--border)] rounded-[12px] flex-nowrap max-w-[640px] overflow-auto py-[6px] px-2 whitespace-nowrap shadow-[0_15px_32px_0_#0000000d,0_59px_59px_0_#0000000a,0_132px_79px_0_#00000008,0_234px_94px_0_#00000003,0_366px_103px_0_#0000] mb-6">
          <button
            onClick={() => setActiveTab("roles")}
            className={`px-4 py-2 -mb-px border-b-2 ${
              activeTab === "roles" ? "bg-[#0b64fe1a] border border-[#007bff] border-[var(--blue)] !rounded-[8px] shadow-[0_15px_32px_0_#0000000d,0_59px_59px_0_#0000000a,0_132px_79px_0_#00000008,0_234px_94px_0_#00000003,0_366px_103px_0_#0000] text-[#007bff] text-[var(--blue)] cursor-pointer" : ""
            }`}
          >
            Roles
          </button>
          <button
            onClick={() => setActiveTab("permissions")}
            className={`px-4 py-2 -mb-px border-b-2 ${
              activeTab === "permissions" ? "bg-[#0b64fe1a] border border-[#007bff] border-[var(--blue)] !rounded-[8px] shadow-[0_15px_32px_0_#0000000d,0_59px_59px_0_#0000000a,0_132px_79px_0_#00000008,0_234px_94px_0_#00000003,0_366px_103px_0_#0000] text-[#007bff] text-[var(--blue)] cursor-pointer" : ""
            }`}
          >
            Permissions
          </button>
        </div>

        {getCurrentLoading() ? (
          <IsLoading />
        ) : (
          <>
            {!getCurrentError() && (
              <ReactTable
                data={getCurrentData()}
                columns={getCurrentColumns()}
                setSelectedRows={activeTab === "permissions" ? setSelectedRows : undefined}
                filter={filter}
                onFilterChange={_onFilterChange}
                isDataLoading={getCurrentFetching()}
                isSelectable={activeTab === "permissions"}
              />
            )}
            {!getCurrentError() && getCurrentData()?.data?.length > 0 && (
              <TablePagination
                currentPage={getCurrentData()?.current_page}
                lastPage={getCurrentData()?.last_page}
                setPage={_onFilterChange}
                hasNextPage={!!getCurrentData()?.next_page_url}
                hasPrevPage={!!getCurrentData()?.prev_page_url}
              />
            )}
          </>
        )}
      </div>

      {selectedRows.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg border rounded p-4 flex items-center gap-4">
          <span>
            <b>Delete {selectedRows.length} rows</b>
          </span>
          <button
            onClick={() => mutate(selectedRows.map((i) => i.id))}
            className="bg-red-500 text-white rounded px-4 py-2 text-sm hover:bg-red-600"
          >
            {isDeleteLoading ? "Loading..." : "Delete"}
          </button>
        </div>
      )}
    </>
  );
}
