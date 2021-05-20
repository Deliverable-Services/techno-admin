import axios from "axios"
import { useMemo, useState } from "react"
import { Button, Container, Modal, Spinner } from "react-bootstrap"
import { AiFillDelete, AiFillEdit, AiFillPlusSquare } from "react-icons/ai"
import { BiArrowFromRight, BiSad } from "react-icons/bi"
import { useMutation, useQuery } from "react-query"
import { Cell } from "react-table"
import useToggle from "../../hooks/useToggle"
import IsLoading from "../../shared-components/isLoading"
import TablePagination from "../../shared-components/Pagination"
import ReactTable from "../../shared-components/ReactTable"
import API from "../../utils/API"
import { adminApiBaseUrl, baseUploadUrl, primaryColor, secondaryColor } from "../../utils/constants"
import { queryClient } from "../../utils/queryClient"
import { showErrorToast } from "../../utils/showErrorToast"
import UpdateCreateForm from "./BrandsCreateUpdateForm"


const key = "brands"



const deleteBrand = (id: string) => {

    return API.delete(`${key}/${id}`, {
        headers: { "Content-Type": "multipart/form-data" },

    })


}

const Brands = () => {

    const { setStatusCreate, setStatusDefault, status, setStatusEdit } = useToggle()
    const [selectedRowId, setSelectedRowId] = useState<string>("")
    const [page, setPage] = useState<number>(1)
    const [deletePopup, setDeletePopup] = useState(false)
    const { data, isLoading, isFetching, error } = useQuery<any>([key, page], {
        onError: (err: any) => {

            showErrorToast(err.response.data.message)
        }
    })

    const { mutate, isLoading: isDeleteLoading } = useMutation(deleteBrand, {
        onSuccess: () => {

            queryClient.invalidateQueries(key)
            setDeletePopup(false)
        },
        onError: () => {

            showErrorToast("Something went wrong deleteing the records")
        }
    })

    const columns = useMemo(
        () => [
            {
                Header: '#Id',
                accessor: 'id',  //accessor is the "key" in the data
            },
            {
                Header: 'Logo',
                accessor: 'logo',
                Cell: (data: Cell) =>
                    <div className="table-image">
                        <img src={`${baseUploadUrl}brands/${data.row.values.logo}`} alt="name" />
                    </div>


            },
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Url',
                accessor: 'url',
            },
            {
                Header: 'Actions',
                Cell: (data: Cell) => {

                    return (
                        <div className="d-flex">
                            <button onClick={() => {
                                setSelectedRowId(data.row.values.id)
                                setStatusEdit()
                            }}>
                                <AiFillEdit color={secondaryColor} size={24} />
                            </button>
                            <button className="ml-2" onClick={() => {
                                setSelectedRowId(data.row.values.id)
                                setDeletePopup(true)
                            }}>
                                <AiFillDelete color="red" size={24} />
                            </button>
                        </div>
                    )
                }
            }
        ],
        []
    )


    if (!data && (!isLoading || !isFetching)) {
        return (
            <Container fluid className="d-flex justify-content-center display-3">
                <div className="d-flex flex-column align-items-center">

                    <BiSad color={primaryColor} />
                    <span className="text-primary display-3">Something went wrong</span>
                </div>
            </Container>
        )
    }



    return (
        <>
            <Container fluid className="component-wrapper px-0 py-2">
                <Container fluid className="d-flex justify-content-between py-2">
                    <h2 className="text-primary font-weight-bold">Brands</h2>
                    {
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
                    }

                </Container>

                <Container fluid className="h-100 p-0">

                    {
                        status === "creating" &&
                        <Container fluid className="mt-2 py-4">
                            <UpdateCreateForm />
                        </Container>
                    }

                    {
                        status === "editing" &&
                        <Container fluid className="mt-2 py-4">
                            <UpdateCreateForm id={selectedRowId} />
                        </Container>
                    }

                    {
                        (status === "default") &&
                        <>
                            {
                                (isLoading || isFetching) ?
                                    <IsLoading /> :


                                    <>
                                        {
                                            !error &&
                                            <ReactTable data={data.data} columns={columns} />
                                        }
                                        {
                                            !error && data.data.length > 0 ?
                                                <TablePagination
                                                    currentPage={(data).current_page}
                                                    lastPage={(data).last_page}
                                                    setPage={setPage}
                                                    hasNextPage={!!(data).next_page_url}
                                                    hasPrevPage={!!(data).prev_page_url}
                                                />
                                                : null
                                        }  </>
                            }
                        </>

                    }

                </Container>
            </Container>
            <Modal show={deletePopup} onHide={() => setDeletePopup(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Are you sure?</Modal.Title>
                </Modal.Header>
                <Modal.Body>Do you really want to delete this record? This process cannot be undone</Modal.Body>
                <Modal.Footer>
                    <Button variant="bg-light" onClick={() => setDeletePopup(false)}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={() => {

                        mutate(selectedRowId)
                    }}>
                        {
                            isDeleteLoading ?
                                <Spinner animation="border" size="sm" /> :
                                "Delete"
                        }
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Brands
