import { useMemo, useState } from "react"
import { Button, Container, Modal } from "react-bootstrap"
import { AiFillDelete, AiFillEdit, AiFillPlusSquare } from "react-icons/ai"
import { BiArrowFromRight } from "react-icons/bi"
import { Cell } from "react-table"
import useToggle from "../../hooks/useToggle"
import ReactTable from "../../shared-components/ReactTable"
import { secondaryColor } from "../../utils/constants"
import { mockData } from "../../utils/mockData"
import UsersCreateUpdateForm from "./UsersCreateUpdateForm"

const Brands = () => {
    const { setStatusCreate, setStatusDefault, status, setStatusEdit } = useToggle()
    const [deletePopup, setDeletePopup] = useState(false)
    const data: any = useMemo(
        () => [
            ...mockData
        ],
        []
    )
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
                Cell: () => (
                    <div className="d-flex">
                        <button onClick={() => {
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
        ],
        [setStatusEdit]
    )

    return (
        <>
            <Container fluid className="component-wrapper px-0 py-2">
                <Container className="d-flex justify-content-between py-2">
                    <h2 className="text-primary font-weight-bold">Users</h2>
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
                            <UsersCreateUpdateForm />
                        </Container>
                    }

                    {
                        status === "editing" &&
                        <Container fluid className="mt-2 py-4">
                            <UsersCreateUpdateForm title="test title" description="test description" />
                        </Container>
                    }

                    {
                        status === "default" &&
                        <ReactTable data={data} columns={columns} />
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
