import { AxiosError } from "axios";
import { useMemo, useState } from "react";
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
import { primaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import { useFlyout } from "../../hooks/useFlyout";
import FaqCreateUpdateForm from "./FaqsCreateUpdateForm";
import Flyout from "../../shared-components/Flyout";
import { Hammer, CircleQuestionMark, Frown } from 'lucide-react';

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
  const { isOpen: showFlyout, openFlyout, closeFlyout } = useFlyout();
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

  const _onCreateClick = () => openFlyout();
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
      { Header: "#Id", accessor: "id" },
      { Header: "Title", accessor: "title" },
      {
        Header: "Is Active?",
        accessor: "is_active",
        Cell: (data: Cell) => (
          <IsActiveBadge value={data.row.values.is_active} />
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
          <div className="flex items-center justify-end gap-3">
            <EditButton
              onClick={() => _onEditClick(data.row.values.id)}
              permissionReq="update_faq"
            />
            <div className="relative">
              <button className="p-1 border border-gray-300 rounded hover:bg-gray-100">
                <Hammer size={18} />
              </button>
              {/* Dropdown */}
              <div className="absolute right-0 mt-1 w-32 bg-white border rounded shadow hidden group-hover:block">
                <button
                  onClick={() => {
                    mutate(selectedRows.map((i) => i.id));
                  }}
                  className="w-full px-3 py-1 text-sm text-red-500 hover:bg-gray-100 flex items-center gap-1"
                >
                  <Hammer size={16} /> Delete
                </button>
              </div>
            </div>
          </div>
        ),
      },
    ],
    [selectedRows]
  );

  if (!data && (!isLoading || !isFetching)) {
    return (
      <div className="flex justify-center items-center w-full py-10">
        <div className="flex flex-col items-center">
          <Hammer color={primaryColor} />
          <span className="text-primary text-2xl font-semibold">
            Something went wrong
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-4 py-3">
        <PageHeading
          icon={<CircleQuestionMark size={24} />}
          description="This will be show on your website & support center"
          title="Frequently Asked Questions"
          onClick={_onCreateClick}
          totalRecords={data?.total}
          permissionReq="create_faq"
        />
      </div>
      <hr />
      {(() => {
        if (isLoading) return <IsLoading />;

        if (error) {
          return (
            <div className="flex justify-center items-center py-10">
              <div className="flex flex-col items-center">
                <Frown color={primaryColor} />
                <span className="text-primary text-xl">
                  Something went wrong
                </span>
              </div>
            </div>
          );
        }

        return (
          <>
            <ReactTable
              tabs={
                <div className="flex justify-between">
                  {!isLoading && (
                    <div className="flex border-b border-gray-200">
                      {[
                        { key: "", label: `All (${data?.data?.length || 0})` },
                        {
                          key: "active",
                          label: `Active (${
                            data?.data?.filter(
                              (item) => item.status === "1"
                            ).length || 0
                          })`,
                        },
                        {
                          key: "notActive",
                          label: `Not Active (${
                            data?.data?.filter(
                              (item) => item.status === "0"
                            ).length || 0
                          })`,
                        },
                      ].map((tab) => (
                        <button
                          key={tab.key}
                          onClick={() =>
                            _onFilterChange("active", tab.key)
                          }
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
                  )}
                </div>
              }
              data={data?.data}
              columns={columns}
              setSelectedRows={setSelectedRows}
              filter={filter}
              onFilterChange={_onFilterChange}
              isDataLoading={isFetching}
              searchPlaceHolder="Search using title"
              deletePermissionReq="delete_faq"
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

      {selectedRows.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-red-100 p-4 rounded shadow flex items-center gap-3">
          <span>
            <b>Delete {selectedRows.length} rows</b>
          </span>
          <button
            onClick={() => {
              mutate(selectedRows.map((i) => i.id));
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            {isDeleteLoading ? "Loading..." : "Delete"}
          </button>
        </div>
      )}
      <Flyout
        isOpen={showFlyout}
        onClose={closeFlyout}
        title={"Create Faq"}
        cancelText="Cancel"
        width="800px"
      >
        <FaqCreateUpdateForm />
      </Flyout>
    </>
  );
};

export default Faqs;
