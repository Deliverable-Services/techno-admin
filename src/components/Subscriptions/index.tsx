import { useMemo, useState } from "react";
import { Button, Container, Modal, Spinner } from "react-bootstrap";
import { BiSad } from "react-icons/bi";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import IsLoading from "../../shared-components/isLoading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import API from "../../utils/API";
import { primaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showErrorToast } from "../../utils/showErrorToast";
// import UpdateCreateForm from "./FaqsCreateUpdateForm"
import moment from 'moment'

const key = "user-subscriptions";

const deleteFaq = (id: string) => {
  return API.delete(`${key}/${id}`, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const Orders = () => {
  const history = useHistory();
  const [selectedRowId, setSelectedRowId] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [deletePopup, setDeletePopup] = useState(false);
  const { data, isLoading, isFetching, error } = useQuery<any>([key, page], {
    onError: (err: any) => {
      showErrorToast(err.response.data.message);
    },
  });

  const { mutate, isLoading: isDeleteLoading } = useMutation(deleteFaq, {
    onSuccess: () => {
      queryClient.invalidateQueries(key);
      setDeletePopup(false);
    },
    onError: () => {
      showErrorToast("Something went wrong deleteing the records");
    },
  });

  const Status = ({ status }: { status: string }) => {
    const setColor = () => {
      if (status === "cancelled" || status === "error_payment") return "red";

      if (status === "pending" || status === "pending_payment") return "orange";

      return "green";
    };
    return <p style={{ color: setColor() }}>{status}</p>;
  };

  const columns = useMemo(
    () => [
      {
        Header: "#Id",
        accessor: "id", //accessor is the "key" in the data
      },
      {
        Header: "User Name",
        accessor: "user.name", //accessor is the "key" in the data
      },
      {
        Header: "Plan ID",
        accessor: "plan_id", //accessor is the "key" in the data
      },
      {
        Header: "Allowed Usage",
        accessor: "allowed_usage", //accessor is the "key" in the data
      },
      {
        Header: "Order Status",
        accessor: "status", //accessor is the "key" in the data
        Cell: (data: Cell) => <Status status={data.row.values.status} />,
      },
      {
        Header: "No. Times Used",
        accessor: "used", //accessor is the "key" in the data
      },
      {
        Header: "Created At",
        accessor: "created_at", //accessor is the "key" in the data
        Cell: (data: Cell) => moment(data.row.values.created_at).format('DD MMMM YYYY'),
      },


      {
        Header: "Actions",
        Cell: (data: Cell) => {
          return (
            <div className="d-flex">
              <Button
                onClick={() => history.push(`/subscriptions/${data.row.values.id}`)}
              >
                View
              </Button>
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
          <BiSad color={primaryColor} />
          <span className="text-primary display-3">Something went wrong</span>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Container fluid className="component-wrapper px-0 py-2">
        <Container fluid className="d-flex justify-content-between py-2">
          <h2 className="font-weight-bold">Orders</h2>
          {/* {
                        status !== "default" ?
                            <Button variant="primary" onClick={setStatusDefault}  >
                                <div className="text-secondary">
                                    <BiArrowFromRight size={25} /> <b>Back</b>
                                </div>
                            </Button> :
                            <Button variant="primary" onClick={setStatusCreate}>
                                <div className="text-secondary">

                                    <AiFillPlusSquare size={24} /> <b>Create</b>
                                </div>
                            </Button>
                    } */}
        </Container>

        <Container fluid className="h-100 p-0">
          <>
            {isLoading || isFetching ? (
              <IsLoading />
            ) : (
              <>
                {!error && <ReactTable data={data.data} columns={columns} />}
                {!error && data.data.length > 0 ? (
                  <TablePagination
                    currentPage={data.current_page}
                    lastPage={data.last_page}
                    setPage={setPage}
                    hasNextPage={!!data.next_page_url}
                    hasPrevPage={!!data.prev_page_url}
                  />
                ) : null}{" "}
              </>
            )}
          </>
        </Container>
      </Container>
      <Modal show={deletePopup} onHide={() => setDeletePopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Do you really want to delete this record? This process cannot be
          undone
        </Modal.Body>
        <Modal.Footer>
          <Button variant="bg-light" onClick={() => setDeletePopup(false)}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              mutate(selectedRowId);
            }}
          >
            {isDeleteLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Delete"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Orders;
