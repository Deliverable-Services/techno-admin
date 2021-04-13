import bsCustomFileInput from "bs-custom-file-input"
import { Form, Formik } from 'formik'
import { useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { InputField } from '../../shared-components/InputFeild'

interface IBrandsCreateUpdateForm {
    title?: string,
    description?: string
}

const BrandsCreateUpdateForm = ({ description = "", title = "" }: IBrandsCreateUpdateForm) => {

    useEffect(() => {
        bsCustomFileInput.init()
    }, [])
    return (

        <Formik
            initialValues={{ title, description, image: null }}
            onSubmit={(values) => {
                console.log(values)
            }}>
            {({ setFieldValue }) => (
                <Form>
                    <InputField
                        name="title"
                        placeholder="Title"
                        label="Title"
                    />

                    <InputField name="description" placeholder="description" label="Description" />
                    <InputField name="image" placeholder="image" label="Choose Brand" isFile setFieldValue={setFieldValue} />
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

export default BrandsCreateUpdateForm
