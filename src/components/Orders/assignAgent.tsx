import { Formik, Form } from 'formik'
import { error } from 'node:console'
import { StringDecoder } from 'node:string_decoder'
import React from 'react'
import { Container, Button, Alert, Col, Row, Spinner } from 'react-bootstrap'
import { AiFillPlusSquare } from 'react-icons/ai'
import { BiArrowFromRight } from 'react-icons/bi'
import { useMutation } from 'react-query'
import { useHistory, useParams } from 'react-router-dom'
import { InputField } from '../../shared-components/InputFeild'
import isLoading from '../../shared-components/isLoading'
import API from '../../utils/API'
import { queryClient } from '../../utils/queryClient'

const key = "bookings"

const agents = [
    {
        id: 2,
        name: "Hitesh"
    },
    {
        id: 2,
        name: "Hitesh"
    },
    {
        id: 2,
        name: "Hitesh"
    },
    {
        id: 2,
        name: "Hitesh"
    },
]

const assignAgent = ({ formdata, id }: { formdata: { agent_id: string }, id: string }) => {

    return API.post(`bookings/${id}/assign-agent`, formdata, {
        headers: { "Content-Type": "application/json" },

    })
}

const AssignAgent = () => {
    const { id }: { id: string } = useParams()

    const history = useHistory()
    const { data, mutate, isLoading, error, status } = useMutation(assignAgent, {
        onSuccess: (data) => {
            setTimeout(() => {
                queryClient.invalidateQueries(key)
                queryClient.invalidateQueries(`${key}/${id}`)
                history.goBack()
            }
                , 500)
        }
    })

    return (
        <Container>

            <Container fluid className="d-flex justify-content-between py-2">
                <h2 className="text-primary font-weight-bold">Assign Aggent</h2>
                <Button variant="primary" onClick={() => history.goBack()}  >
                    <div className="text-secondary">
                        <BiArrowFromRight size={25} /> <b>Back</b>
                    </div>
                </Button>

            </Container>

            <Row className="px-3 rounded">
                <Col className=" box-shadow py-3 mx-auto">

                    <Formik
                        initialValues={{ agent_id: "" }}
                        onSubmit={(values) => {

                            mutate({ formdata: values, id })
                        }}>
                        {({ setFieldValue }) => (
                            <Form>
                                <h1 className="text-primary text-center my-3"><b>Assign Aggent </b></h1>
                                {status === "success" &&
                                    <Alert variant="success">Agent Successfully Assigned</Alert>
                                }
                                {/* {error &&
                                <Alert variant="danger">{(error as Error).message}</Alert>
                            } */}

                                <Row className="align-items-center justify-content-center">
                                    <Col sm md={6} >
                                        <InputField name="agent_id" placeholder="Select Agent" label="Select Agent" as="select" selectData={agents} />
                                    </Col>
                                </Row>

                                <Row className="d-flex justify-content-center">
                                    <Col md="6">
                                        <Button type="submit" disabled={isLoading} className="w-100">
                                            {isLoading ? <Spinner animation="border" size="sm" /> : "Submit"}
                                        </Button>
                                    </Col>
                                </Row>

                            </Form>

                        )}
                    </Formik>

                </Col>
            </Row>
        </Container>
    )
}

export default AssignAgent
