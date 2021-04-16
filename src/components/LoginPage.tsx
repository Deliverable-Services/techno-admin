import axios from 'axios'
import { Form, Formik } from 'formik'
import { FormEvent, useEffect } from 'react'
import { Button, Container, Spinner } from 'react-bootstrap'
import { useMutation } from 'react-query'
import { useHistory } from 'react-router'
import * as Yup from 'yup'
import { InputField } from '../shared-components/InputFeild'
import Logo from '../shared-components/Logo'
import { appApiBaseUrl } from '../utils/constants'

interface Props {

}
const phoneRegExp = /^[6-9]\d{9}$/
const LoginSchema = Yup.object().shape({
    phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required("Phone number required")
})

const sendOtp = (formData: FormData) => {
    return axios.post(`${appApiBaseUrl}auth/send-otp`, formData, {
        headers: { "Content-Type": "multipart/form-data" },

    })
}

const LoginPage = (props: Props) => {

    const history = useHistory()

    const { mutate, data, isLoading } = useMutation(sendOtp)

    useEffect(() => {
        if (data) {
            console.log("send-otp", data.data)
            history.push(`/verify-otp/${data.data.user.phone}`)
        }

    }, [data])



    return (
        <Container fluid className="login-page" >
            <Formik initialValues={{ phone: "" }}
                onSubmit={values => {
                    const formData = new FormData()
                    formData.append("phone", values.phone)

                    mutate(formData)

                }}
                validationSchema={LoginSchema}
            >

                {
                    ({ errors }) => {
                        return (
                            <Form >
                                <div className="form-container px-3 py-5 rounded">

                                    <div className="logo-container">
                                        <Logo />
                                    </div>

                                    <h1 className="text-primary my-3"><b>Login</b></h1>
                                    <p >We will send you a 4-digit
                                        verification code to this number</p>
                                    <InputField name="phone" placeholder="Enter your phone number" label="Phone number" type="text" error={errors.phone} />

                                    <Button variant="primary" type="submit" className="my-2">
                                        {
                                            isLoading ?
                                                <Spinner animation="border" variant="secondary" size="sm" /> :
                                                <div className="text-secondary">
                                                    <b>Send OTP</b>
                                                </div>
                                        }
                                    </Button>
                                </div>
                            </Form>
                        )
                    }
                }
            </Formik>
        </Container>
    )
}

export default LoginPage
