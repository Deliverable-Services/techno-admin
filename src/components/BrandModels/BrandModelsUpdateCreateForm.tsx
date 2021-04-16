
import bsCustomFileInput from "bs-custom-file-input"
import { Form, Formik } from 'formik'
import { useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { useQuery } from "react-query"
import useGetSingleQuery from "../../hooks/useGetSingleQuery"
import { InputField } from '../../shared-components/InputFeild'

interface IBrandsModalCreateUpdateForm {
    id?: string
}

const BrandsModalCreateUpdateForm = ({ id = "" }: IBrandsModalCreateUpdateForm) => {


    const { data } = useGetSingleQuery({ id, key: "brands-model" })

    useEffect(() => {
        bsCustomFileInput.init()
    }, [])
    return (

        <Formik
            initialValues={{ name: "", url: "", image: "" }}
            onSubmit={(values) => {
                console.log(values)
            }}>
            {({ setFieldValue }) => (
                <Form>
                    <InputField
                        name="name"
                        placeholder="Name"
                        label="Name"
                    />

                    <InputField name="url" placeholder="Url" label="Url" />
                    <InputField name="image" placeholder="image" label="Choose Brand Modal" isFile setFieldValue={setFieldValue} />
                    {/* <input type="file" name="image" id="image" onChange={(e: ChangeEvent) => {
                        const input = (e.currentTarget as HTMLInputElement).files
                        if (input) {
                            setFieldValue("image", input[0])
                        }
                    }} /> */}
                    <Button type="submit">Submit</Button>

                </Form>

            )}
        </Formik>

    )
}

export default BrandsModalCreateUpdateForm
