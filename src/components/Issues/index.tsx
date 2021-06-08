
import { useMemo, useState } from "react";
import { Badge, Button, Container, Modal, Spinner } from "react-bootstrap";
import { BiSad } from "react-icons/bi";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Cell } from "react-table";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import TablePagination from "../../shared-components/Pagination";
import ReactTable from "../../shared-components/ReactTable";
import API from "../../utils/API";
import { primaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showErrorToast } from "../../utils/showErrorToast";

const key = "bookings";


const Issues = () => {
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
        const setVairant = () => {
            if (status === "cancelled" || status === "error_payment") return "danger";

            if (status === "pending" || status === "pending_payment") return "warning";

            return "success";
        };
        return <Badge variant={setVairant()}>{status}</Badge>;
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
                Header: "Issue Status",
                accessor: "status",
                Cell: (data: Cell) => <Status status={data.row.values.status} />,
            },
            {
                Header: "Actions",
                Cell: (data: Cell) => {
                    return (
                        <div className="d-flex">
                            <Button
                                onClick={() => history.push(`/issues/${data.row.values.id}`)}
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
            <PageHeading title="Issues" />
            <Container fluid className="card component-wrapper px-0 py-2">
                <Container fluid className="h-100 p-0">
                    <>
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
                    </>
                </Container>
            </Container>
        </>
    );
};

export default Issues;
