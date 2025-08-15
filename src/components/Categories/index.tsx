import { AxiosError } from "axios";
import { useMemo, useState, useCallback } from "react";
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
import API from "../../utils/API";
import { config, primaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showErrorToast } from "../../utils/showErrorToast";
import { showMsgToast } from "../../utils/showMsgToast";
import { useFlyout } from "../../hooks/useFlyout";
import Flyout from "../../shared-components/Flyout";
import CategoriesCreateUpdateForm from "./CategoriesCreateUpdateForm";
import { Hammer } from "../ui/icon";
import { VectorSquare } from "lucide-react";

const key = "categories";

const deleteCategories = (id: Array<any>) => {
  return API.post(`${key}/delete`, { id });
};

const updateOrder = async (id: string, destinationIndex: any, row: any) => {
  const finalIn = (parseInt(destinationIndex) + 1).toString();
  const formdata = new FormData();
  for (let k in row) formdata.append(k, row[k]);
  formdata.append("order", finalIn);

  try {
    const { data } = await API.post(`${key}/${id}`, formdata, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (data) {
      showMsgToast("Successfully updated order");
      queryClient.invalidateQueries(key);
    }
  } catch (error) {
    showErrorToast(error.message);
  }
};

const intitialFilter = {
  q: "",
  page: null,
  perPage: 25,
  active: "",
};

const Categories = () => {
  const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const [filter, setFilter] = useState(intitialFilter);
  const [isDraggable] = useState(false);
  const { isOpen: showFlyout, openFlyout, closeFlyout } = useFlyout();

  const { data, isLoading, isFetching, error } = useQuery<any>([key, filter], {
    onError: (error: AxiosError) => handleApiError(error, history),
  });

  const { mutate, isLoading: isDeleteLoading } = useMutation(deleteCategories, {
    onSuccess: () => {
      queryClient.invalidateQueries(key);
      showMsgToast("Categories deleted successfully");
    },
    onError: (error: AxiosError) => handleApiError(error, history),
  });

  const _onCreateClick = () => openFlyout();
  const _onEditClick = useCallback(
    (id: string) => history.push("/categories/create-edit", { id }),
    [history]
  );
  const _onUrlClick = (_data: Cell) => window.open(config.clientWebUrl);

  const _onFilterChange = (idx: string, value: any) => {
    setFilter((prev) => ({ ...prev, [idx]: value }));
  };

  const columns = useMemo(
    () => [
      { Header: "#Id", accessor: "id" },
      { Header: "Name", accessor: "name" },
      {
        Header: "Url",
        accessor: "url",
        Cell: (data: Cell) => (
          <p
            className="text-gray-600 cursor-pointer m-0"
            onClick={() => _onUrlClick(data)}
          >
            {data.row.values.url}
          </p>
        ),
      },
      { Header: "Order", accessor: "order", isSortedDesc: true },
      {
        Header: "Is Active?",
        accessor: "is_active",
        Cell: (data: Cell) => <IsActiveBadge value={data.row.values.is_active} />,
      },
      {
        Header: "Created At",
        accessor: "created_at",
        Cell: (data: Cell) => <CreatedUpdatedAt date={data.row.values.created_at} />,
      },
      {
        Header: "Updated At",
        accessor: "updated_at",
        Cell: (data: Cell) => <CreatedUpdatedAt date={data.row.values.updated_at} />,
      },
      {
        Header: "Actions",
        Cell: (data: Cell) => (
          <EditButton
            onClick={() => _onEditClick(data.row.values.id)}
            permissionReq="update_category"
          />
        ),
      },
    ],
    [_onEditClick]
  );

  if (!data && (!isLoading || !isFetching)) {
    return (
      <div className="flex justify-center items-center text-3xl">
        <div className="flex flex-col items-center">
          <Hammer color={primaryColor} />
          <span className="text-primary text-3xl">Something went wrong</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4">
        <PageHeading
          icon={<VectorSquare size={24} />}
          description="Create and manage categories"
          title="Categories"
          onClick={_onCreateClick}
          totalRecords={data?.total}
          permissionReq="create_category"
        />
      </div>
      <hr />
      <div className="h-full p-0">
        {isLoading ? (
          <IsLoading />
        ) : (
          <>
            {!error && (
              <>
                <div className="pt-3 flex flex-wrap gap-2">
                  {/* filter buttons */}
                </div>

                <ReactTable
                  data={data?.data}
                  tabs={
                    <div className="flex justify-between items-center w-full">
                      {!isLoading && (
                        <div className="flex gap-2 bg-white border border-[#eee] border-[var(--border)] rounded-[12px] flex-nowrap max-w-[640px] overflow-auto py-[6px] px-2 whitespace-nowrap shadow-[0_15px_32px_0_#0000000d,0_59px_59px_0_#0000000a,0_132px_79px_0_#00000008,0_234px_94px_0_#00000003,0_366px_103px_0_#0000]">
                          <button
                            className={`px-3 py-1 text-sm rounded ${
                              filter.active === "" ? "bg-[#0b64fe1a] border border-[#007bff] border-[var(--blue)] !rounded-[8px] shadow-[0_15px_32px_0_#0000000d,0_59px_59px_0_#0000000a,0_132px_79px_0_#00000008,0_234px_94px_0_#00000003,0_366px_103px_0_#0000] text-[#007bff] text-[var(--blue)] cursor-pointer" : ""
                            }`}
                            onClick={() => _onFilterChange("active", "")}
                          >
                            All ({data?.data?.length || 0})
                          </button>
                          <button
                            className={`px-3 py-1 text-sm rounded ${
                              filter.active === "active"
                                ? "bg-blue-500 bg-[#0b64fe1a] border border-[#007bff] border-[var(--blue)] !rounded-[8px] shadow-[0_15px_32px_0_#0000000d,0_59px_59px_0_#0000000a,0_132px_79px_0_#00000008,0_234px_94px_0_#00000003,0_366px_103px_0_#0000] text-[#007bff] text-[var(--blue)] cursor-pointer"
                                : ""
                            }`}
                            onClick={() => _onFilterChange("active", "active")}
                          >
                            Active (
                            {data?.data?.filter((item: any) => item.status === "1").length || 0})
                          </button>
                          <button
                            className={`px-3 py-1 text-sm rounded ${
                              filter.active === "notActive"
                                ? "bg-blue-500 bg-[#0b64fe1a] border border-[#007bff] border-[var(--blue)] !rounded-[8px] shadow-[0_15px_32px_0_#0000000d,0_59px_59px_0_#0000000a,0_132px_79px_0_#00000008,0_234px_94px_0_#00000003,0_366px_103px_0_#0000] text-[#007bff] text-[var(--blue)] cursor-pointer"
                                : ""
                            }`}
                            onClick={() => _onFilterChange("active", "notActive")}
                          >
                            Not Active (
                            {data?.data?.filter((item: any) => item.status === "0").length || 0})
                          </button>
                        </div>
                      )}
                    </div>
                  }
                  columns={columns}
                  setSelectedRows={setSelectedRows}
                  filter={filter}
                  onFilterChange={_onFilterChange}
                  isDataLoading={isFetching}
                  isDraggable={isDraggable}
                  updateOrder={updateOrder}
                  searchPlaceHolder="Search using name, url"
                  deletePermissionReq="delete_category"
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

      {selectedRows.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 flex justify-between items-center">
          <span className="font-bold">Delete {selectedRows.length} rows</span>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => mutate(selectedRows.map((i) => i.id))}
          >
            {isDeleteLoading ? "Loading..." : "Delete"}
          </button>
        </div>
      )}

      <Flyout
        isOpen={showFlyout}
        onClose={closeFlyout}
        title={"Create Categories"}
        cancelText="Cancel"
      >
        <CategoriesCreateUpdateForm />
      </Flyout>
    </>
  );
};

export default Categories;
