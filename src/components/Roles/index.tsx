// Roles/index.tsx

import { AxiosError } from "axios";
import { useMemo, useState } from "react";
import { Button, Container } from "../ui/bootstrap-compat";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import { handleApiError } from "../../hooks/handleApiErrors";
import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import ReactTable from "../../shared-components/ReactTable";
import API from "../../utils/API";
import { primaryColor } from "../../utils/constants";
import { showMsgToast } from "../../utils/showMsgToast";
import { CommonModal } from "../CommonPopup/CommonModal";
import { queryClient } from "../../utils/queryClient";
import { useFlyout } from "../../hooks/useFlyout";
import Flyout from "../../shared-components/Flyout";
import RolesCreateUpdateForm from "./RolesCreateUpdateForm";
import { Hammer } from "../ui/icon";

const key = "get-all-roles";

const removeRole = (id: string) => {
  return API.post(`remove-role/${id}`);
};

const intitialFilter = {
  q: "",
  page: 1,
  perPage: 25,
};

const Roles = () => {
  const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const [filter, setFilter] = useState(intitialFilter);
  const [modalShow, setModalShow] = useState(false);
  const { isOpen: showFlyout, openFlyout, closeFlyout } = useFlyout();
  const { data, isLoading, isFetching, error } = useQuery<any>(
    [key, , filter],
    {
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  const { mutate, isLoading: isRemoveLoading } = useMutation(removeRole, {
    onSuccess: () => {
      queryClient.invalidateQueries(key);
      showMsgToast("Role removed successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const _onCreateClick = () => {
    // setModalShow(true);
    openFlyout();
  };
  const _onEditClick = (id: string) => {
    history.push("/roles/create-edit", { id });
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
      // {
      //   Header: "Actions",
      //   Cell: (data: Cell) => {
      //     return (
      //       <EditButton
      //         onClick={() => {
      //           _onEditClick(data.row.values.id);
      //         }}
      //       />
      //     );
      //   },
      // },
    ],
    []
  );

  const _toggleModal = () => {
    setModalShow(!modalShow);
  };

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
      <CommonModal
        title="Create New Role"
        modalShow={modalShow}
        onModalHideClick={_toggleModal}
      >
        <RolesCreateUpdateForm setShowModal={_toggleModal} />
      </CommonModal>
      <Container fluid className="card component-wrapper view-padding">
        <PageHeading
          title="Roles"
          onClick={_onCreateClick}
          totalRecords={data?.total}
          permissionReq="create_role"
        />
      </Container>
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
                deletePermissionReq="delete_role"
                isSelectable={false}
              />
            )}
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
              mutate(selectedRows.map((i) => i.id)[0]);
            }}
          >
            {isRemoveLoading ? "Loading..." : "Remove"}
          </Button>
        </div>
      )}

      <Flyout
        isOpen={showFlyout}
        onClose={closeFlyout}
        title={"Create Services"}
        cancelText="Cancel"
      >
        <RolesCreateUpdateForm setShowModal={_toggleModal} />
      </Flyout>
    </>
  );
};

export default Roles;
