import { AxiosError } from "axios";
import React, { useMemo, useState } from "react";
import { Button, Container, Dropdown } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import { handleApiError } from "../../hooks/handleApiErrors";
import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import EditButton from "../../shared-components/EditButton";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import API from "../../utils/API";
import { primaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import { useFlyout } from "../../hooks/useFlyout";
import Flyout from "../../shared-components/Flyout";
import CarTypesCreateUpdateForm from "./CarTypesCreateUpdateForm";
import { Hammer } from "../ui/icon";

const key = "brand-model-type";

const deleteCities = (id: Array<any>) => {
  return API.post(`${key}/delete`, {
    id,
  });
};

const intitialFilter = {
  q: "",
  page: 1,
  perPage: 25,
};

const CarTypes = () => {
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

  const { mutate, isLoading: isDeleteLoading } = useMutation(deleteCities, {
    onSuccess: () => {
      queryClient.invalidateQueries(key);
      showMsgToast("Product types deleted successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const _onCreateClick = () => {
    // history.push("/car-types/create-edit");
    openFlyout();
  };
  const _onEditClick = (id: string) => {
    history.push("/car-types/create-edit", { id });
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
        Header: "Name",
        accessor: "name",
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
            <div className="d-flex align-items-center justify-content-end gap-3">
              <EditButton
                onClick={() => {
                  _onEditClick(data.row.values.id);
                }}
                permissionReq="update_brandmodelType"
              />
              <Dropdown className="ellipsis-dropdown">
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
                    onClick={() => {
                      mutate(selectedRows.map((i) => i.id));
                    }}
                    className="text-danger"
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
          title="Product variants"
          description="Create and genrate products variants"
          icon={<Hammer size={24} />}
          onClick={_onCreateClick}
          totalRecords={data?.total}
          permissionReq="create_brandmodelType"
        />
      </div>
      <hr />
      <div className="h-100 p-0">
        {isLoading ? (
          <IsLoading />
        ) : (
          <>
            {!error && (
              <ReactTable
                data={data?.data}
                columns={columns}
                setSelectedRows={setSelectedRows}
                filter={filter}
                onFilterChange={_onFilterChange}
                isDataLoading={isFetching}
                searchPlaceHolder="Search using name"
                deletePermissionReq="delete_brandmodelType"
              />
            )}
            {!error && data?.data?.length > 0 ? (
              <TablePagination
                currentPage={data?.current_page}
                lastPage={data?.last_page}
                setPage={_onFilterChange}
                hasNextPage={!!data?.next_page_url}
                hasPrevPage={!!data?.prev_page_url}
              />
            ) : null}{" "}
          </>
        )}
      </div>
      {selectedRows.length > 0 && (
        <div className="delete-button rounded">
          <span>
            <b>Delete {selectedRows.length} rows</b>
          </span>
          <Button
            variant="danger"
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
        title={"Create Variants"}
        cancelText="Cancel"
      >
        <CarTypesCreateUpdateForm />
      </Flyout>
    </>
  );
};

export default CarTypes;
