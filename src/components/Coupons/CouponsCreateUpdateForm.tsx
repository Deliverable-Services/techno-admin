import axios from "axios"
import bsCustomFileInput from "bs-custom-file-input"
import { Form, Formik } from 'formik'
import { useEffect } from 'react'
import { Alert, Button, Col, Row, Spinner } from 'react-bootstrap'
import { useMutation, useQuery } from "react-query"
import useGetSingleQuery from "../../hooks/useGetSingleQuery"
import { InputField } from '../../shared-components/InputFeild'
import IsLoading from "../../shared-components/isLoading"
import { ICreateUpdateForm } from "../../types/interface"
import { adminApiBaseUrl } from "../../utils/constants"
import { queryClient } from "../../utils/queryClient"


const key = "services"


const createUpdataBrand = ({ formdata, id }: { formdata: any, id: string }) => {
    if (!id) {
        return axios.post(`${adminApiBaseUrl}${key}`, formdata, {
            headers: { "Content-Type": "applicatioin/json" },

        })
    }

    return axios.post(`${adminApiBaseUrl}${key}/${id}`, formdata, {
        headers: { "Content-Type": "application/json" },

    })
}

const BrandsCreateUpdateForm = ({ id = "" }: ICreateUpdateForm) => {
    console.log(id)

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



    const apiData = data && (data as any).data;

    console.log("apiData", apiData)




    if (dataLoading)
        return <IsLoading />


    return (
        <Row className="px-3 rounded">
            <Col className=" box-shadow pb-3 mx-auto">

                <Formik
                    initialValues={{ title: apiData ? apiData[0].title : "", coupon_code: apiData ? apiData[0].coupon_code : "", description: apiData ? apiData[0].description : "", terms: apiData ? apiData[0].terms : "" }}
                    onSubmit={(values) => {

                        // console.log("values", values)

                        mutate({ formdata: values, id })
                    }}>
                    {({ setFieldValue }) => (
                        <Form>
                            <h1 className="text-primary text-center my-3"><b>{id ? "Update Coupon " : "Create Coupon"}</b></h1>
                            {status === "success" &&
                                <Alert variant="success">{id ? "Coupon updated successfully" : "Coupon created successfully"}</Alert>
                            }
                            {error &&
                                <Alert variant="danger">{(error as Error).message}</Alert>
                            }
                            <div className="form-container  py-2 ">
                                <InputField
                                    name="title"
                                    placeholder="Title"
                                    label="Title"
                                    required
                                />

                                {
                                    !id &&
                                    <InputField name="coupon_code" placeholder="Coupon Code" label="Coupon Code" required />
                                }
                                {
                                    !id &&
                                    <InputField name="description" placeholder="Description" label="Descrition" as="textarea" />
                                }

                                {
                                    !id &&
                                    <InputField name="terms" placeholder="Terms" label="Terms" as="textarea" />
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
