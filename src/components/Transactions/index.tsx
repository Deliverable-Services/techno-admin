import { useMemo, useState } from "react";
import { Button, Container, Modal, Spinner } from "react-bootstrap";
import { BiSad } from "react-icons/bi";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import API from "../../utils/API";
import {
  primaryColor
} from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showErrorToast } from "../../utils/showErrorToast";

const key = "transactions";

const deleteBrand = (id: string) => {
  return API.delete(`${key}/${id}`, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const Transactions = () => {
  const history = useHistory()
  const [selectedRowId, setSelectedRowId] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [deletePopup, setDeletePopup] = useState(false);
  const { data, isLoading, isFetching, error } = useQuery<any>([key, page], {
    onError: (err: any) => {
      showErrorToast(err.response.data.message);
    },
  });

  const { mutate, isLoading: isDeleteLoading } = useMutation(deleteBrand, {
    onSuccess: () => {
      queryClient.invalidateQueries(key);
      setDeletePopup(false);
    },
    onError: () => {
      showErrorToast("Something went wrong deleteing the records");
    },
  });

  const _onCreateClick = () => {
    history.push("/brands/create-edit")
  }
  const _onEditClick = (id: string) => {
    history.push("/brands/create-edit", { id })
  }

  const _onUserClick = (id: string) => {
    if (!id) return
    history.push("/users/create-edit", { id })
  }

  const _onOrderClick = (id: string) => {
    if (!id) return
    history.push(`/orders/${id}`)
  }
  const columns = useMemo(
    () => [
      {
        Header: "#Id",
        accessor: "id", //accessor is the "key" in the data
      },
      {
        Header: "Ref Id",
        accessor: "ref_id",
      },
      {
        Header: "User",
        accessor: "user.name",
        Cell: (data: Cell) => {
          return (
            <p
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => _onUserClick((data.row.original as any).user_id)}

            >{data.row.values["user.name"]}</p>
          )
        }
      },
      {
        Header: "Order",
        accessor: "order_id",
        Cell: (data: Cell) => {
          return (
            <p
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => _onOrderClick((data.row.values as any).order_id)}

            >{data.row.values.order_id}</p>
          )
        }
      },
      {
        Header: "Paid Amount",
        accessor: "paid_amount",
      },
      {
        Header: "Payment Method",
        accessor: "payment_method",
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Created At",
        accessor: "created_at",
        Cell: (data: Cell) => {
          return (
            <CreatedUpdatedAt date={data.row.values.created_at} />
          )
        }
      },
      {
        Header: "Updated At",
        accessor: "updated_at",
        Cell: (data: Cell) => {
          return (
            <CreatedUpdatedAt date={data.row.values.updated_at} />
          )
        }
      },
      // {
      //   Header: "Actions",
      //   Cell: (data: Cell) => {
      //     return (
      //       <div className="d-flex">
      //         <button
      //           onClick={() => {
      //             _onEditClick(data.row.values.id);
      //           }}
      //         >
      //           <AiFillEdit color={secondaryColor} size={24} />
      //         </button>
      //         <button
      //           className="ml-2"
      //           onClick={() => {
      //             setSelectedRowId(data.row.values.id);
      //             setDeletePopup(true);
      //           }}
      //         >
      //           <AiFillDelete color="red" size={24} />
      //         </button>
      //       </div>
      //     );
      //   },
      // },
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
        <PageHeading title="Transactions" />

        <Container fluid className="h-100 p-0">

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

export default Transactions;
