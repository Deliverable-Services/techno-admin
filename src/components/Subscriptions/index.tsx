import { useMemo, useState } from "react";
import { Badge, Container } from "react-bootstrap";
import { BiSad } from "react-icons/bi";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import CreatedUpdatedAt from "../../shared-components/CreatedUpdatedAt";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import { primaryColor } from "../../utils/constants";
import { showErrorToast } from "../../utils/showErrorToast";

const key = "user-subscriptions";


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


  const Status = ({ status }: { status: string }) => {
    const setVariant = () => {
      if (status === "active") return "success";


      return "danger";
    };
    return <Badge variant={setVariant()} className="p-1">{status.toUpperCase()}</Badge>;
  };


  const _onPlanClick = (id: string) => {
    if (!id) return
    history.push("/plans/create-edit", { id })
  }
  const _onUserClick = (id: string) => {
    if (!id) return
    history.push("/users/create-edit", { id })
  }

  const columns = useMemo(
    () => [
      {
        Header: "#Id",
        accessor: "id", //accessor is the "key" in the data
      },
      {
        Header: "User Name",
        accessor: "user.name", //accessor is the "key" in the data
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
        Header: "Plan ID",
        accessor: "plan.name", //accessor is the "key" in the data
        Cell: (data: Cell) => {
          return (
            <p
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => _onPlanClick((data.row.original as any).plan_id)}

            >{data.row.values["plan.name"]}</p>
          )
        }
      },
      {
        Header: "Allowed Usage",
        accessor: "allowed_usage", //accessor is the "key" in the data
      },
      {
        Header: "Status",
        accessor: "status", //accessor is the "key" in the data
        Cell: (data: Cell) => <Status status={data.row.values.status} />,
      },
      {
        Header: "No. Times Used",
        accessor: "used", //accessor is the "key" in the data
      },
      {
        Header: "Last Used",
        accessor: "last_used_at",
        Cell: (data: Cell) => {
          return (
            <CreatedUpdatedAt date={data.row.values.last_used_at} />
          )
        }
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
      //         <Button
      //           onClick={() => history.push(`/subscriptions/${data.row.values.id}`)}
      //         >
      //           View
      //         </Button>
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
        <PageHeading title="User Subscriptions" />

        <Container fluid className="h-100 p-0">

          {isLoading || isFetching ? (
            <IsLoading />
          ) : (
            <>
              {!error && <ReactTable
                data={data}
                columns={columns}
              />}
              {!error && data.length > 0 ? (
                <TablePagination
                  currentPage={data?.current_page}
                  lastPage={data?.last_page}
                  setPage={setPage}
                  hasNextPage={!!data?.next_page_url}
                  hasPrevPage={!!data?.prev_page_url}
                />
              ) : null}{" "}
            </>
          )}
        </Container>
      </Container>
    </>
  );
}

export default Orders;
