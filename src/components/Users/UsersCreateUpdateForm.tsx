import bsCustomFileInput from "bs-custom-file-input"
import { Form, Formik } from 'formik'
import { useEffect } from 'react'
import { Alert, Button, Col, Row, Spinner } from 'react-bootstrap'
import { useMutation } from "react-query"
import useGetSingleQuery from "../../hooks/useGetSingleQuery"
import { InputField } from '../../shared-components/InputFeild'
import IsLoading from "../../shared-components/isLoading"
import { ICreateUpdateForm } from "../../types/interface"
import API from "../../utils/API"
import { queryClient } from "../../utils/queryClient"


const key = "users"



const createUpdateUser = ({ formdata, id }: { formdata: { name: any }, id: string }) => {
    if (!id) {
        return API.post(`${key}`, formdata, {
            headers: { "Content-Type": "application/json" },

        })
    }

    return API.post(`${key}/${id}`, formdata, {
        headers: { "Content-Type": "application/json" },

    })
}

const CategoriesCreateUpdateForm = ({ id = "" }: ICreateUpdateForm) => {


    useEffect(() => {
        bsCustomFileInput.init()
    }, [])
    const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key })
    const { mutate, isLoading, error, status } = useMutation(createUpdateUser, {
        onSuccess: () => {
            setTimeout(() =>
                queryClient.invalidateQueries(key)
                , 500)
        }
    })



    const apiData = data && (data as any);






    if (dataLoading)
        return <IsLoading />


    return (
        <Row className="px-3 rounded">
            <Col className=" box-shadow py-3 mx-auto">

                <Formik
                    initialValues={{ name: apiData ? apiData.name : "", phone: apiData ? apiData.phone : "", email: apiData ? apiData.email : "" }}
                    onSubmit={(values) => {

                        console.log(values)
                        mutate({ formdata: values, id })
                    }}>
                    {() => (
                        <Form className="w-100">
                            <h1 className="text-primary text-center my-3"><b>{id ? "Update User" : "Create User"}</b></h1>
                            {status === "success" &&
                                <Alert variant="success">{id ? "User updated successfully" : "User created successfully"}</Alert>
                            }
                            {error &&
                                <Alert variant="danger">{(error as Error).message}</Alert>
                            }

                            <div className="form-container py-2">
                                <InputField
                                    name="name"
                                    placeholder="Name"
                                    label="Name"
                                    required
                                />
                                <InputField
                                    name="phone"
                                    placeholder="phone"
                                    label="Phone"
                                    required
                                />
                                <InputField
                                    name="email"
                                    placeholder="Email"
                                    label="Email"
                                    required
                                />


                            </div>
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
    )
}

export default CategoriesCreateUpdateForm
