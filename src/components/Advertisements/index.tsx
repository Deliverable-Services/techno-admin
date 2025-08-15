import { AxiosError } from "axios";
import { useMemo, useState } from "react";
import { QueryFunction, useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import { handleApiError } from "../../hooks/handleApiErrors";

import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import EditButton from "../../shared-components/EditButton";
import FilterSelect from "../../shared-components/FilterSelect";
import IsActiveBadge from "../../shared-components/IsActiveBadge";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import API from "../../utils/API";
import { areTwoObjEqual } from "../../utils/areTwoObjEqual";
import { isActiveArray } from "../../utils/arrays";
import { primaryColor, config } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import { useFlyout } from "../../hooks/useFlyout";
import Flyout from "../../shared-components/Flyout";
import AdvertisementCreateUpdateForm from "./AdvertisementUpdateCreateForm";
import { Hammer } from "../ui/icon";
import { Image, Funnel } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const key = "banners/list";

const deleteAd = (id: Array<any>) => {
  return API.post(`banners/delete`, { id });
};

const initialFilter = {
  type: "offer",
  q: "",
  page: "",
  perPage: 25,
  active: "",
};

const getBanners: QueryFunction = async ({ queryKey }) => {
  const params: Record<string, any> = {};
  //@ts-ignore
  for (let k in queryKey[2]) {
    if (queryKey[2][k]) params[k] = queryKey[2][k];
  }
  const r = await API.get(
    `${queryKey[0]}/${(queryKey[1] as string).toLowerCase()}`,
    { params }
  );
  return await r.data;
};

const Advertisements = () => {
  const history = useHistory();
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [isDraggable, setIsDraggable] = useState(false);
  const [filter, setFilter] = useState(initialFilter);
  const { isOpen: showFlyout, openFlyout, closeFlyout } = useFlyout();

  const { data, isLoading, isFetching, error } = useQuery<any>(
    [key, filter.type, filter],
    getBanners,
    {
      onError: (error: AxiosError) => handleApiError(error, history),
    }
  );

  const { mutate, isLoading: isDeleteLoading } = useMutation(deleteAd, {
    onSuccess: () => {
      queryClient.invalidateQueries(key);
      showMsgToast("Banner(s) deleted successfully");
    },
    onError: (error: AxiosError) => handleApiError(error, history),
  });

  const _onFilterChange = (idx: string, value: any) => {
    setFilter((prev) => ({ ...prev, [idx]: value }));
  };

  const _onCreateClick = () => {
    openFlyout();
  };

  const _onEditClick = (id: string) => {
    history.push("/advertisements/create-edit", { id });
  };

  const _onDeepLinkClick = (data: Cell) => {
    window.open(config.clientWebUrl);
  };

  const columns = useMemo(
    () => [
      { Header: "#Id", accessor: "id" },
      {
        Header: "Image",
        accessor: "image",
        Cell: (data: Cell) => (
          <img
            src={`${config.baseUploadUrl}banners/${data.row.values.image}`}
            alt={String(data.row.values.image)}
            className="w-[100px] h-[50px] object-cover cursor-pointer"
            onClick={() =>
              window.open(
                `${config.baseUploadUrl}banners/${data.row.values.image}`,
                "_blank"
              )
            }
          />
        ),
      },
      { Header: "Name", accessor: "name" },
      {
        Header: "Page url",
        accessor: "deeplink",
        Cell: (data: Cell) => (
          <p
            className="text-gray-600 m-0 cursor-pointer"
            onClick={() => _onDeepLinkClick(data)}
          >
            {data.row.values.deeplink}
          </p>
        ),
      },
      { Header: "Order", accessor: "order" },
      {
        Header: "Is Active?",
        accessor: "is_active",
        Cell: (data: Cell) => <IsActiveBadge value={data.row.values.is_active} />,
      },
      {
        Header: "Valid from",
        accessor: "valid_from",
        Cell: (data: Cell) => <CreatedUpdatedAt date={data.row.values.valid_from} />,
      },
      {
        Header: "Valid To",
        accessor: "valid_to",
        Cell: (data: Cell) => <CreatedUpdatedAt date={data.row.values.valid_to} />,
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
            permissionReq="update_banner"
          />
        ),
      },
    ],
    [_onEditClick]
  );

  if (!data && (!isLoading || !isFetching)) {
    return (
      <div className="flex justify-center items-center h-screen flex-col">
        <Hammer color={primaryColor} />
        <span className="text-primary text-3xl">Something went wrong</span>
      </div>
    );
  }

  return (
    <>
      <div className="p-4">
        <PageHeading
          title="Banners"
          description="Create and manage banners"
          icon={<Image size={24} />}
          onClick={_onCreateClick}
          totalRecords={data?.total}
          permissionReq="create_banner"
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
                {/* Tabs */}
                <div className="flex justify-between mt-3">
                  {(!isLoading || !isFetching) && (
                    <div className="flex gap-2 bg-white px-2 border border-[#eee] !max-w-max border-[var(--border)] rounded-[12px] flex-nowrap max-w-[640px] overflow-auto py-[6px] px-2 whitespace-nowrap shadow-[0_15px_32px_0_#0000000d,0_59px_59px_0_#0000000a,0_132px_79px_0_#00000008,0_234px_94px_0_#00000003,0_366px_103px_0_#0000]">
                      {["offer", "latest", "trending"].map((type) => (
                        <button
                          key={type}
                          className={`px-4 py-2 text-sm font-medium border-b-2 ${
                            filter.type === type
                              ? "bg-[#0b64fe1a] border border-[#007bff] border-[var(--blue)] !rounded-[8px] shadow-[0_15px_32px_0_#0000000d,0_59px_59px_0_#0000000a,0_132px_79px_0_#00000008,0_234px_94px_0_#00000003,0_366px_103px_0_#0000] text-[#007bff] text-[var(--blue)] cursor-pointer"
                              : ""
                          }`}
                          onClick={() => _onFilterChange("type", type)}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)} (
                          {data?.data?.filter((item) => item.status === type).length || 0}
                          )
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Table */}
                <ReactTable
                  tabs={null}
                  filters={
                    <DropdownMenu>
                      <DropdownMenuTrigger className="w-full flex p-2 items-center justify-between rounded-lg border border-gray-300 h-9">
                        <span className="flex items-center gap-2 w-full">
                          <Funnel size={14} /> Filters
                        </span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[400px] p-3">
                        <div className="flex justify-between w-full">
                          <h4>Filter</h4>
                          <button
                            className={`px-3 py-1 text-sm rounded ${
                              areTwoObjEqual(initialFilter, filter)
                                ? "bg-gray-200 text-gray-700"
                                : "bg-blue-500 text-white"
                            }`}
                            onClick={() => setFilter(initialFilter)}
                          >
                            Reset Filters
                          </button>
                        </div>
                        <div className="mt-3">
                          <FilterSelect
                            currentValue={filter.active}
                            data={isActiveArray}
                            label="Is Active?"
                            idx="active"
                            onFilterChange={_onFilterChange}
                            defaultSelectTitle="Show All"
                          />
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  }
                  data={data.data}
                  columns={columns}
                  setSelectedRows={setSelectedRows}
                  onFilterChange={_onFilterChange}
                  filter={filter}
                  isDataLoading={isFetching}
                  isDraggable={isDraggable}
                  searchPlaceHolder="Search using name"
                  deletePermissionReq="delete_banner"
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
        <div className="fixed bottom-4 left-4 bg-white shadow-lg border border-gray-200 rounded-lg p-4 flex items-center gap-4">
          <span className="font-bold">Delete {selectedRows.length} rows</span>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
            onClick={() => mutate(selectedRows.map((i) => i.id))}
          >
            {isDeleteLoading ? "Loading..." : "Delete"}
          </button>
        </div>
      )}

      <Flyout
        isOpen={showFlyout}
        onClose={closeFlyout}
        title={"Create Services"}
        cancelText="Cancel"
        width="800px"
      >
        <AdvertisementCreateUpdateForm />
      </Flyout>
    </>
  );
};

export default Advertisements;
