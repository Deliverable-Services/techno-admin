import axios from "axios"
import bsCustomFileInput from "bs-custom-file-input"
import { Form, Formik } from 'formik'
import { useEffect } from 'react'
import { Alert, Button, Col, Container, Row, Spinner } from 'react-bootstrap'
import { useMutation, useQuery } from "react-query"
import useGetSingleQuery from "../../hooks/useGetSingleQuery"
import { InputField } from '../../shared-components/InputFeild'
import IsLoading from "../../shared-components/isLoading"
import { ICreateUpdateForm } from "../../types/interface"
import API from "../../utils/API"
import { adminApiBaseUrl } from "../../utils/constants"
import { queryClient } from "../../utils/queryClient"


const key = "brand-models"


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
        <Row className="px-3 rounded">
            <Col className=" box-shadow mx-auto pb-3">

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
                            <h1 className="text-primary my-3 text-center"><b>{id ? "Update Brand Model" : "Create Brand Model"}</b></h1>
                            {status === "success" &&
                                <Alert variant="success">{id ? "Brand model updated successfully" : "Brand model created successfully"}</Alert>
                            }
                            {error &&
                                <Alert variant="danger">{(error as Error).message}</Alert>
                            }
                            <div className={`form-container  py-2 `}>
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
