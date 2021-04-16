import axios from "axios"
import bsCustomFileInput from "bs-custom-file-input"
import { Form, Formik } from 'formik'
import { useEffect } from 'react'
import { Alert, Button, Spinner } from 'react-bootstrap'
import { useMutation } from "react-query"
import { InputField } from '../../shared-components/InputFeild'
import { ICreateUpdateForm } from "../../types/interface"
import { adminApiBaseUrl } from "../../utils/constants"


const createUpdataBrand = ({ formdata, id }: { formdata: FormData, id: string }) => {
    if (!id) {
        return axios.post(`${adminApiBaseUrl}brands`, formdata, {
            headers: { "Content-Type": "multipart/form-data" },

        })
    }

    return axios.put(`${adminApiBaseUrl}brands/${id}`, formdata, {
        headers: { "Content-Type": "multipart/form-data" },

    })
}

const BrandsCreateUpdateForm = ({ id = "" }: ICreateUpdateForm) => {

    const { mutate, isLoading, error } = useMutation(createUpdataBrand)

    useEffect(() => {
        bsCustomFileInput.init()
    }, [])
    return (

        <Formik
            initialValues={{ name: "", url: "", logo: "" }}
            onSubmit={(values) => {
                const formdata = new FormData()
                formdata.append("name", values.name)
                formdata.append("url", values.url)
                formdata.append("logo", values.logo)
                if (id)
                    formdata.append("id", id)

                mutate({ formdata, id })
            }}>
            {({ setFieldValue }) => (
                <Form>
                    {error &&
                        <Alert variant="danger">{(error as Error).message}</Alert>
                    }
                    <InputField
                        name="name"
                        placeholder="Name"
                        label="Name"
                    />

                    <InputField name="url" placeholder="Url" label="Url" />
                    <InputField name="logo" placeholder="logo" label="Choose Brand Logo" isFile setFieldValue={setFieldValue} />
                    {/* <input type="file" name="image" id="image" onChange={(e: ChangeEvent) => {
                        const input = (e.currentTarget as HTMLInputElement).files
                        if (input) {
                            setFieldValue("image", input[0])
                        }
                    }} /> */}
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? <Spinner animation="border" size="sm" /> : "Submit"}
                    </Button>

                </Form>

            )}
        </Formik>

    )
}

export default BrandsCreateUpdateForm
