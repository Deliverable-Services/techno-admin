import React, { useState } from 'react'
import { Container, Button, Row, Col, Card, Modal, Spinner } from 'react-bootstrap'
import { AiFillDelete, AiFillEdit, AiFillPlusSquare } from 'react-icons/ai'
import { BiArrowFromRight } from 'react-icons/bi'
import useToggle from '../../hooks/useToggle'
import { secondaryColor } from '../../utils/constants'
import UpdateCreateForm from './AdvertisementUpdateCreateForm';
import LatestAd from './LatestAd'

interface Props {

}

const Advertisements = (props: Props) => {

    const { setStatusCreate, setStatusDefault, status, setStatusEdit } = useToggle()
    const [selectedRowId, setSelectedRowId] = useState<string>("")
    const [deletePopup, setDeletePopup] = useState(false)
    return (
        <>
            <Container fluid className="component-wrapper px-0 py-2">
                <Container fluid className="d-flex justify-content-between py-2">
                    <h2 className="text-primary font-weight-bold">Advertisements</h2>
                    {
                        status !== "default" ?
                            <Button variant="primary" onClick={setStatusDefault}  >
                                <div className="text-secondary">
                                    <BiArrowFromRight size={25} /> <b>Back</b>
                                </div>
                            </Button> :
                            <Button variant="primary" onClick={() => {
                                setSelectedRowId("")
                                setStatusCreate()
                            }}>
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

                        <LatestAd setDeletePopup={setDeletePopup} setSelectedRowId={setSelectedRowId} setStatusEdit={setStatusEdit} />

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

                        // mutate(selectedRowId)
                    }}>
                        {
                            // isDeleteLoading ?
                            // <Spinner animation="border" size="sm" /> :
                            "Delete"
                        }
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Advertisements