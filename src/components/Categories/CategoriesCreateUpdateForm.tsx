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


const key = "categories"



const createUpdataCategories = ({ formdata, id }: { formdata: { name: any }, id: string }) => {
    if (!id) {
        return axios.post(`${adminApiBaseUrl}${key}`, formdata, {
            headers: { "Content-Type": "application/json" },

        })
    }

    return axios.post(`${adminApiBaseUrl}${key}/${id}`, formdata, {
        headers: { "Content-Type": "application/json" },

    })
}

const CategoriesCreateUpdateForm = ({ id = "" }: ICreateUpdateForm) => {


    useEffect(() => {
        bsCustomFileInput.init()
    }, [])
    const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key })
    const { mutate, isLoading, error, status } = useMutation(createUpdataCategories, {
        onSuccess: () => {
            setTimeout(() =>
                queryClient.invalidateQueries(key)
                , 500)
        }
    })



    const apiData = data && (data as any);

    console.log("apiData", data)




    if (dataLoading)
        return <IsLoading />


    return (
        <Row>
            <Col md={6} className="mx-auto">

                <Formik
                    initialValues={{ name: apiData ? apiData.name : "" }}
                    onSubmit={(values) => {

                        console.log(values)
                        mutate({ formdata: values, id })
                    }}>
                    {() => (
                        <Form>
                            <div className="form-container px-3 py-2 rounded">
                                <h1 className="text-primary my-3"><b>{id ? "Update Cateory" : "Create Category"}</b></h1>
                                {status === "success" &&
                                    <Alert variant="success">{id ? "Category updated successfully" : "Category created successfully"}</Alert>
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

export default CategoriesCreateUpdateForm
