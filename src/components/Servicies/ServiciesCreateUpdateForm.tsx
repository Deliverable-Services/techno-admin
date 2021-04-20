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
    const { data: categories, isLoading: isCategoriesLoading } = useQuery(["categories"])
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
        <Row>
            <Col md={6} className="mx-auto">

                <Formik
                    initialValues={{ name: apiData ? apiData[0].name : "", url: apiData ? apiData[0].url : "", price: apiData ? apiData[0].price : "", category_id: "" }}
                    onSubmit={(values) => {

                        // console.log("values", values)

                        mutate({ formdata: values, id })
                    }}>
                    {({ setFieldValue }) => (
                        <Form>
                            <div className="form-container px-3 py-2 rounded">
                                <h1 className="text-primary my-3"><b>{id ? "Update Services " : "Create Service"}</b></h1>
                                {status === "success" &&
                                    <Alert variant="success">{id ? "Service updated successfully" : "Service created successfully"}</Alert>
                                }
                                {error &&
                                    <Alert variant="danger">{(error as Error).message}</Alert>
                                }
                                <InputField
                                    name="name"
                                    placeholder="Name"
                                    label="Name"
                                    required
                                />

                                {
                                    !id &&
                                    <InputField name="url" placeholder="Url" label="Url" required />
                                }
                                {
                                    !id &&
                                    <InputField name="price" placeholder="Price" label="Price" type="number" />
                                }
                                {
                                    !id &&
                                    <InputField name="details" placeholder="Details" label="Details" as="textarea" />
                                }
                                {
                                    !id &&
                                    <InputField name="category_id" placeholder="Category" label="Choose Category" as="select" selectData={!isCategoriesLoading && (categories as any).data} />
                                }
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? <Spinner animation="border" size="sm" /> : "Submit"}
                                </Button>
                            </div>
                        </Form>

                    )}
                </Formik>

            </Col>
        </Row>
    )
}

export default BrandsCreateUpdateForm
