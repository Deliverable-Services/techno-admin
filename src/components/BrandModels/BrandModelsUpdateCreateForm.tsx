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


const key = "brand-models"


const createUpdataBrand = ({ formdata, id }: { formdata: FormData, id: string }) => {
    if (!id) {
        return axios.post(`${adminApiBaseUrl}${key}`, formdata, {
            headers: { "Content-Type": "multipart/form-data" },

        })
    }

    return axios.post(`${adminApiBaseUrl}${key}/${id}`, formdata, {
        headers: { "Content-Type": "multipart/form-data" },

    })
}

const BrandsCreateUpdateForm = ({ id = "" }: ICreateUpdateForm) => {
    console.log(id)

    useEffect(() => {
        bsCustomFileInput.init()
    }, [])
    const { data: brands, isLoading: isBrandLoading } = useQuery<any>(["brands"])
    const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key })
    const { mutate, isLoading, error, status } = useMutation(createUpdataBrand, {
        onSuccess: () => {
            setTimeout(() =>
                queryClient.invalidateQueries(key)
                , 500)
        }
    })


    console.log(data)

    const apiData = data && (data as any);






    if (dataLoading)
        return <IsLoading />


    return (
        <Row>
            <Col md={6} className="mx-auto">

                <Formik
                    initialValues={{ name: apiData ? apiData.name : "", url: apiData ? apiData.url : "", image: "", brand_id: "" }}
                    onSubmit={(values) => {
                        const formdata = new FormData()
                        formdata.append("name", values.name)
                        if (!id) {
                            formdata.append("image", values.image)
                            formdata.append("url", values.url)
                            formdata.append("brand_id", values.brand_id)

                        }
                        // console.log("values", values)

                        mutate({ formdata, id })
                    }}>
                    {({ setFieldValue }) => (
                        <Form>
                            <div className="form-container px-3 py-2 rounded">
                                <h1 className="text-primary my-3"><b>{id ? "Update Brand Model" : "Create Brand Model"}</b></h1>
                                {status === "success" &&
                                    <Alert variant="success">{id ? "Brand model updated successfully" : "Brand model created successfully"}</Alert>
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
                                    <InputField name="image" placeholder="image" label="Choose Brand Model Image" isFile setFieldValue={setFieldValue} />
                                }
                                {
                                    !id &&
                                    <InputField name="brand_id" placeholder="Brand" label="Choose Brand" as="select" selectData={!isBrandLoading && (brands).data} />
                                }
                                <Button type="submit" disabled={isLoading} >
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
