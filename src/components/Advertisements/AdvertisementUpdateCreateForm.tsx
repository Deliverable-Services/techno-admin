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
import { types } from "./AdvertisementTypes"
import DateTime from 'react-datetime';
import DatePicker from "../../shared-components/DatePicker"


const key = "banners"

const createUpdataAdvertisement = ({ formdata, id }: { formdata: FormData, id: string }) => {
    if (!id) {
        return API.post(`${key}`, formdata, {
            headers: { "Content-Type": "multipart/form-data" },

        })
    }

    return API.post(`${key}/${id}`, formdata, {
        headers: { "Content-Type": "multipart/form-data" },

    })
}

const AdvertisementCreateUpdateForm = ({ id = "" }: ICreateUpdateForm) => {


    useEffect(() => {
        bsCustomFileInput.init()
    }, [])

    const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key })
    const { mutate, isLoading, error, status } = useMutation(createUpdataAdvertisement, {
        onSuccess: () => {
            setTimeout(() =>
                queryClient.invalidateQueries("banner/list")
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
                    initialValues={{ name: apiData ? apiData.name : "", deeplink: apiData ? apiData.url : "", image: "", type: "", valid_to: "", valid_from: "" }}
                    onSubmit={(values) => {
                        const formdata = new FormData()
                        formdata.append("name", values.name)
                        if (!id) {
                            formdata.append("image", values.image)
                            formdata.append("deeplink", values.deeplink)
                            formdata.append("type", values.type)
                            formdata.append("valid_to", values.valid_to)
                            formdata.append("valid_from", values.valid_from)

                        }
                        // console.log("values", values)

                        mutate({ formdata, id })
                    }}>
                    {({ setFieldValue }) => (
                        <Form>
                            <h1 className="text-primary my-3 text-center"><b>{id ? "Update Advertisement" : "Create Advertisement"}</b></h1>
                            {status === "success" &&
                                <Alert variant="success">{id ? "Advertisement  updated successfully" : "Advertisement created successfully"}</Alert>
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
                                    <InputField name="deeplink" placeholder="Deep Link" label="Deep Link" required />
                                }
                                {
                                    !id &&
                                    <DatePicker name="valid_from" setFieldValue={setFieldValue} label="Valid From" inputProps={{ placeholder: "Valid from", required: true }} />
                                }
                                {
                                    !id &&
                                    <DatePicker name="valid_to" setFieldValue={setFieldValue} label="Valid To" inputProps={{ placeholder: "Valid to", required: true }} />
                                }
                                {
                                    !id &&
                                    <InputField name="image" placeholder="image" label="Image" isFile setFieldValue={setFieldValue} />
                                }
                                {
                                    !id &&
                                    <InputField name="type" placeholder="Advertisement type" label="Choose Type" as="select" selectData={types} />
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

export default AdvertisementCreateUpdateForm
