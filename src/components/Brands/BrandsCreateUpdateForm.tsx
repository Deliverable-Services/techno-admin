import axios from "axios"
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
import { adminApiBaseUrl } from "../../utils/constants"
import { queryClient } from "../../utils/queryClient"


const key = "brands"


const createUpdataBrand = ({ formdata, id }: { formdata: FormData, id: string }) => {
    if (!id) {
        return API.post(`${key}`, formdata, {
            headers: { "Content-Type": "multipart/form-data" },

        })
    }

    return API.post(`${key}/${id}`, formdata, {
        headers: { "Content-Type": "multipart/form-data" },

    })
}

const BrandsCreateUpdateForm = ({ id = "" }: ICreateUpdateForm) => {

    useEffect(() => {
        bsCustomFileInput.init()
    }, [])
    const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key })
    const { mutate, isLoading, error, status } = useMutation(createUpdataBrand, {
        onSuccess: () => {
            setTimeout(() =>
                queryClient.invalidateQueries(key)
                , 500)
        }
    })

    console.log("data", data)



    const apiData = data as any;




    if (dataLoading)
        return <IsLoading />


    return (
        <Row className="px-3 rounded">
            <Col className=" box-shadow py-3 mx-auto">

                <Formik
                    initialValues={{ name: data ? apiData.name : "", url: data ? apiData.url : "", logo: "" }}
                    onSubmit={(values) => {
                        const formdata = new FormData()
                        formdata.append("name", values.name)
                        formdata.append("url", values.url)
                        if (!id)
                            formdata.append("logo", values.logo)


                        mutate({ formdata, id })
                    }}>
                    {({ setFieldValue }) => (
                        <Form>
                            <h1 className="text-primary text-center my-3"><b>{id ? "Update Brand" : "Create Brand"}</b></h1>
                            {status === "success" &&
                                <Alert variant="success">{id ? "Brand updated successfully" : "Brand created successfully"}</Alert>
                            }
                            {error &&
                                <Alert variant="danger">{(error as Error).message}</Alert>
                            }
                            <div className="form-container ">


                                <InputField
                                    name="name"
                                    placeholder="Name"
                                    label="Name"
                                    required
                                />


                                <InputField name="url" placeholder="Url" label="Url" required />
                                {
                                    !id &&

                                    <InputField name="logo" placeholder="logo" label="Choose Brand Logo" isFile setFieldValue={setFieldValue} />
                                }
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

export default BrandsCreateUpdateForm
