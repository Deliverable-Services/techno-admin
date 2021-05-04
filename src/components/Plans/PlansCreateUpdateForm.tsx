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


const key = "plans"


const createUpdataCoupons = ({ formdata, id }: { formdata: any, id: string }) => {
    if (!id) {
        return API.post(`${key}`, formdata, {
            headers: { "Content-Type": "applicatioin/json" },

        })
    }

    return API.post(`${key}/${id}`, formdata, {
        headers: { "Content-Type": "application/json" },

    })
}

const CouponCreateUpdateForm = ({ id = "" }: ICreateUpdateForm) => {


    useEffect(() => {
        bsCustomFileInput.init()
    }, [])
    const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key })
    const { mutate, isLoading, error, status } = useMutation(createUpdataCoupons, {
        onSuccess: () => {
            setTimeout(() =>
                queryClient.invalidateQueries(key)
                , 500)
        }
    })



    const apiData = data && (data as any);

    console.log("apiData", apiData)




    if (dataLoading)
        return <IsLoading />


    return (
        <Row className="px-3 rounded">
            <Col className=" box-shadow pb-3 mx-auto">

                <Formik
                    initialValues={{ name: apiData ? apiData.name : "", description: apiData ? apiData.description : "", price: apiData ? apiData.price : "" }}
                    onSubmit={(values) => {

                        // console.log("values", values)

                        mutate({ formdata: values, id })
                    }}>
                    {({ setFieldValue }) => (
                        <Form>
                            <h1 className="text-primary text-center my-3"><b>{id ? "Update Plan " : "Create Plan"}</b></h1>
                            {status === "success" &&
                                <Alert variant="success">{id ? "Plan updated successfully" : "Plan created successfully"}</Alert>
                            }
                            {error &&
                                <Alert variant="danger">{(error as Error).message}</Alert>
                            }
                            <div className="form-container  py-2 ">
                                <InputField
                                    name="name"
                                    placeholder="Name"
                                    label="Name"
                                    required
                                />

                                {
                                    !id &&
                                    <InputField type="number" name="price" placeholder="Price" label="Price" required />
                                }
                                {
                                    !id &&
                                    <InputField name="description" placeholder="Description" label="Descrition" as="textarea" required />
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

export default CouponCreateUpdateForm
