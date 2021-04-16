import { useMemo, useState } from "react"
import { Button, Container, Modal } from "react-bootstrap"
import { AiFillDelete, AiFillEdit, AiFillPlusSquare } from "react-icons/ai"
import { BiArrowFromRight } from "react-icons/bi"
import { useQuery } from "react-query"
import { Cell } from "react-table"
import useToggle from "../../hooks/useToggle"
import IsLoading from "../../shared-components/isLoading"
import TablePagination from "../../shared-components/Pagination"
import ReactTable from "../../shared-components/ReactTable"
import { secondaryColor } from "../../utils/constants"
import BrandsUpdateCreateForm from "./BrandsCreateUpdateForm"

const Brands = () => {

    const { data, isLoading, isFetching } = useQuery("brands")

    const { setStatusCreate, setStatusDefault, status, setStatusEdit } = useToggle()
    const [selectedRowId, setSelectedRowId] = useState<string>("")
    const [deletePopup, setDeletePopup] = useState(false)

    const columns = useMemo(
        () => [
            {
                Header: '#Id',
                accessor: 'id',  //accessor is the "key" in the data
            },
            {
                Header: 'Image',
                accessor: 'imageScr',
                Cell: (data: Cell) =>
                    <div className="table-image">
                        <img src={data.row.values.imageScr} alt="name" />
                    </div>


            },
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'User',
                accessor: 'created_by',
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

    if (isLoading || isFetching)
        return <IsLoading />



    return (
        <>
            <Container fluid className="component-wrapper px-0 py-2">
                <Container className="d-flex justify-content-between py-2">
                    <h2 className="text-primary font-weight-bold">Brand Models</h2>
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
                            <BrandsUpdateCreateForm />
                        </Container>
                    }

                    {
                        status === "editing" &&
                        <Container fluid className="mt-2 py-4">
                            <BrandsUpdateCreateForm id={selectedRowId} />
                        </Container>
                    }

                    {
                        (status === "default") &&
                        <>
                            <ReactTable data={(data as any).data} columns={columns} />
                            {
                                (data as any).data.length > 0 ?
                                    <TablePagination />
                                    : null
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
                    <Button variant="danger" onClick={() => setDeletePopup(false)}>
                        Delete
          </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Brands
