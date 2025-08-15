import { AxiosError } from "axios";
import moment from "moment";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import { handleApiError } from "../../hooks/handleApiErrors";
import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import CustomBadge from "../../shared-components/CustomBadge";
import FilterSelect from "../../shared-components/FilterSelect";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import { areTwoObjEqual } from "../../utils/areTwoObjEqual";
import { IssueRelatedTo } from "../../utils/arrays";
import { primaryColor } from "../../utils/constants";
import { showErrorToast } from "../../utils/showErrorToast";
import IssuesCreateForm from "./IssuesCreateForm";
import Flyout from "../../shared-components/Flyout";
import { Hammer } from "../ui/icon";
import { CircleAlert, Funnel, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const key = "tickets";
const intitialFilter = {
  q: "",
  page: null,
  perPage: 25,
  status: "active",
  user_id: "",
  related_to: "",
  created_at: "",
};

const Issues = () => {
  const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const [filter, setFilter] = useState(intitialFilter);
  const [modalShow, setModalShow] = useState(false);

  const { data, isLoading, isFetching, error } = useQuery<any>(
    [key, , filter],
    {
      onError: (err: any) => {
        showErrorToast(err.response?.data?.message || "Error fetching tickets");
      },
    }
  );

  const { data: Customers, isLoading: isCustomerLoading } = useQuery<any>(
    [
      "users",
      1,
      {
        role: "customer",
      },
    ],
    {
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  const _onUserClick = (id: string) => {
    if (!id) return;
    history.push("/users/create-edit", { id });
  };

  const _onOrderClick = (id: string) => {
    if (!id) return;
    history.push(`/orders/${id}`);
  };

  const _onModalHideClick = () => {
    setModalShow(false);
  };

  const Status = ({ status }: { status: string }) => {
    const setVariant = () => {
      if (status === "closed") return "danger";
      return "success";
    };
    return <CustomBadge variant={setVariant()} title={status} />;
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
      { Header: "Reference Id", accessor: "ref_id" },
      { Header: "Related to", accessor: "related_to" },
      {
        Header: "Issue Status",
        accessor: "status",
        Cell: (data: Cell) => <Status status={data.row.values.status} />,
      },
      {
        Header: "Raised by",
        accessor: "user.name",
        Cell: (data: Cell) => {
          if ((data.row.original as any).user_id)
            return (
              <p
                className="text-gray-700 m-0 cursor-pointer"
                onClick={() => _onUserClick((data.row.original as any).user_id)}
              >
                {data.row.values["user.name"]}
              </p>
            );
          else return "NA";
        },
      },
      {
        Header: "Order Id",
        accessor: "order.ref_id",
        Cell: (data: Cell) => {
          if ((data.row.original as any).order_id)
            return (
              <p
                className="text-gray-700 m-0 cursor-pointer"
                onClick={() =>
                  _onOrderClick((data.row.original as any).order_id)
                }
              >
                {data.row.values["order.ref_id"]}
              </p>
            );
          else return "NA";
        },
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
        Cell: (data: Cell) => {
          return (
            <div className="flex items-center justify-end">
              <Eye
                className="cursor-pointer"
                onClick={() => history.push(`/issues/${data.row.values.id}`)}
              />
            </div>
          );
        },
      },
    ],
    []
  );

  if (!data && (!isLoading || !isFetching)) {
    return (
      <div className="flex justify-center text-5xl w-full mt-10">
        <div className="flex flex-col items-center">
          <Hammer color={primaryColor} />
          <span className="text-primary text-3xl font-semibold">
            Something went wrong
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-4 py-2">
        <PageHeading
          icon={<CircleAlert size={24} />}
          description="Create and manage tickets"
          title="Support Tickets"
          totalRecords={data?.total}
          onClick={() => setModalShow(true)}
          permissionReq="create_issue"
        />
      </div>
      <hr />

      <div className="h-full p-0">
        {isLoading ? (
          <IsLoading />
        ) : (
          <>
            <div className="mt-2" />
            {!error && (
              <ReactTable
                data={data?.data}
                tabs={
                  <div className="flex justify-between">
                    {!isLoading && (
                      <div className="flex space-x-4 border-b border-gray-200 global-navs nav nav-tabs">
                        {[
                          { key: "", label: `All (${data?.data?.length || 0})` },
                          {
                            key: "active",
                            label: `Active (${
                              data?.data?.filter(
                                (item) => item.status === "active"
                              ).length || 0
                            })`,
                          },
                          {
                            key: "closed",
                            label: `Closed (${
                              data?.data?.filter(
                                (item) => item.status === "closed"
                              ).length || 0
                            })`,
                          },
                        ].map((tab) => (
                          <button
                            key={tab.key}
                            onClick={() =>
                              _onFilterChange("status", tab.key)
                            }
                            className={`px-3 py-2 text-sm font-medium ${
                              filter.status === tab.key
                                ? "border-b-2 border-primary text-primary"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                }
                filters={
                  <>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="w-full flex filter-dropdown items-center justify-between rounded-lg py-1 px-3 border border-gray-300 h-9">
                        <span className="flex items-center justify-between gap-2 w-full">
                          <Funnel size={14} /> Filters
                        </span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[400px] p-3">
                        <div className="flex justify-between w-full mb-3">
                          <h4 className="text-lg font-semibold">Filter</h4>
                          <button
                            onClick={() => setFilter(intitialFilter)}
                            className={`px-3 py-1 rounded text-sm ${
                              areTwoObjEqual(intitialFilter, filter)
                                ? "bg-gray-100 text-gray-700"
                                : "bg-primary text-white"
                            }`}
                          >
                            Reset Filters
                          </button>
                        </div>
                        <div className="space-y-4">
                          <FilterSelect
                            currentValue={filter.user_id}
                            data={!isCustomerLoading && Customers.data}
                            label="Customer"
                            idx="user_id"
                            onFilterChange={_onFilterChange}
                          />
                          <FilterSelect
                            currentValue={filter.related_to}
                            data={IssueRelatedTo}
                            label="Related to"
                            idx="related_to"
                            onFilterChange={_onFilterChange}
                          />
                          <div className="flex flex-col space-y-1">
                            <label className="text-gray-500 text-sm">
                              Raised At
                            </label>
                            <input
                              type="date"
                              value={filter.created_at}
                              onChange={(e) => {
                                const value = moment(e.target.value).format(
                                  "YYYY-MM-DD"
                                );
                                _onFilterChange("created_at", value);
                              }}
                              className="text-sm w-40 h-9 border border-gray-300 rounded px-2"
                            />
                          </div>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                }
                columns={columns}
                setSelectedRows={setSelectedRows}
                filter={filter}
                onFilterChange={_onFilterChange}
                isDataLoading={isFetching}
                isSelectable={false}
                searchPlaceHolder="Search using title,ref_id"
              />
            )}
            {!error && data?.length > 0 ? (
              <TablePagination
                currentPage={data?.current_page}
                lastPage={data?.last_page}
                setPage={_onFilterChange}
                hasNextPage={!!data?.next_page_url}
                hasPrevPage={!!data?.prev_page_url}
              />
            ) : null}
          </>
        )}
      </div>

      <Flyout
        isOpen={modalShow}
        onClose={_onModalHideClick}
        title="Raise A Ticket"
        width="600px"
      >
        <IssuesCreateForm onHideModal={_onModalHideClick} />
      </Flyout>

      {selectedRows.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-300 rounded px-4 py-2 flex items-center space-x-3 shadow-lg">
          <span className="font-bold">
            Delete {selectedRows.length} rows
          </span>
          <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
            Delete
          </button>
        </div>
      )}
    </>
  );
};

export default Issues;
