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
import API from "../../utils/API";
import { areTwoObjEqual } from "../../utils/areTwoObjEqual";
import { conditionType } from "../../utils/arrays";
import { primaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import { useFlyout } from "../../hooks/useFlyout";
import Flyout from "../../shared-components/Flyout";
import CouponCreateUpdateForm from "./CouponsCreateUpdateForm";
import { Hammer, Funnel } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";

const key = "coupons";

const deleteCoupons = (id: Array<any>) => API.post(`${key}/delete`, { id });

const intitialFilter = {
  q: "",
  page: null,
  perPage: 25,
  active: "",
  condition_type: "",
};

const Coupons = () => {
  const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const [filter, setFilter] = useState(intitialFilter);
  const { isOpen: showFlyout, openFlyout, closeFlyout } = useFlyout();

  const { data, isLoading, isFetching, error } = useQuery<any>(
    [key, , filter],
    {
      onError: (error: AxiosError) => handleApiError(error, history),
    }
  );

  const { mutate, isLoading: isDeleteLoading } = useMutation(deleteCoupons, {
    onSuccess: () => {
      queryClient.invalidateQueries(key);
      showMsgToast("Coupons deleted successfully");
    },
    onError: (error: AxiosError) => handleApiError(error, history),
  });

  const _onCreateClick = () => openFlyout();
  const _onEditClick = (id: string) => history.push("/coupons/create-edit", { id });

  const _onFilterChange = (idx: string, value: any) => {
    setFilter((prev) => ({ ...prev, [idx]: value }));
  };

  const columns = useMemo(
    () => [
      { Header: "#Id", accessor: "id" },
      { Header: "Title", accessor: "title" },
      {
        Header: "Coupon Code",
        accessor: "coupon_code",
        Cell: (data: Cell) => (
          <CustomBadge title={data.row.values.coupon_code} variant="primary" />
        ),
      },
      { Header: "Condition", accessor: "condition" },
      { Header: "Condition Type", accessor: "condition_type" },
      {
        Header: "Valid From",
        accessor: "valid_from",
        Cell: (data: Cell) => <CreatedUpdatedAt date={data.row.values.valid_from} />,
      },
      {
        Header: "Valid To",
        accessor: "valid_to",
        Cell: (data: Cell) => <CreatedUpdatedAt date={data.row.values.valid_to} />,
      },
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
            permissionReq="update_coupon"
          />
        ),
      },
    ],
    []
  );

  if (!data && (!isLoading || !isFetching)) {
    return (
      <div className="flex justify-center py-10">
        <div className="flex flex-col items-center">
          <Hammer color={primaryColor} />
          <span className="text-primary text-2xl">Something went wrong</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-4 py-3">
        <PageHeading
          title="Coupons"
          description="Create and manage coupons"
          icon={<Hammer size={24} />}
          onClick={_onCreateClick}
          totalRecords={data?.total}
          permissionReq="create_coupon"
        />
      </div>
      <hr />

      <div className="h-full p-0">
        {isLoading ? (
          <IsLoading />
        ) : (
          <>
            {!error && (
              <ReactTable
                data={data?.data}
                tabs={
                  <div className="flex justify-between border-b border-gray-200">
                    {[
                      { key: "", label: `All (${data?.data?.length || 0})` },
                      {
                        key: "1",
                        label: `Active (${data?.data?.filter((item) => item.status === "1").length || 0})`,
                      },
                      {
                        key: "0",
                        label: `Not Active (${data?.data?.filter((item) => item.status === "0").length || 0})`,
                      },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => _onFilterChange("active", tab.key)}
                        className={`px-4 py-2 text-sm font-medium ${
                          filter.active === tab.key
                            ? "border-b-2 border-primary text-primary"
                            : "text-gray-500 hover:text-primary"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                }
                columns={columns}
                filters={
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full flex items-center justify-between rounded-lg border border-gray-300 px-3 py-1 h-9">
                      <span className="flex items-center gap-2 w-full">
                        <Funnel size={14} /> Filters
                      </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[400px] p-3">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold">Filter</h4>
                        <button
                          className={`px-3 py-1 rounded text-sm ${
                            areTwoObjEqual(intitialFilter, filter)
                              ? "bg-gray-100 text-gray-500"
                              : "bg-primary text-white"
                          }`}
                          onClick={() => setFilter(intitialFilter)}
                        >
                          Reset Filters
                        </button>
                      </div>
                      <div>
                        <FilterSelect
                          currentValue={filter.condition_type}
                          data={conditionType}
                          label="Condition Type"
                          idx="condition_type"
                          onFilterChange={_onFilterChange}
                        />
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                }
                setSelectedRows={setSelectedRows}
                filter={filter}
                onFilterChange={_onFilterChange}
                isDataLoading={isFetching}
                deletePermissionReq="delete_coupon"
              />
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
        <div className="fixed bottom-4 right-4 bg-red-100 px-4 py-2 rounded shadow flex items-center gap-3">
          <span>
            <b>Delete {selectedRows.length} rows</b>
          </span>
          <button
            onClick={() => mutate(selectedRows.map((i) => i.id))}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            {isDeleteLoading ? "Loading..." : "Delete"}
          </button>
        </div>
      )}

      <Flyout
        isOpen={showFlyout}
        onClose={closeFlyout}
        title="Create Coupons"
        cancelText="Cancel"
        width="800px"
      >
        <CouponCreateUpdateForm />
      </Flyout>
    </>
  );
};

export default Coupons;
