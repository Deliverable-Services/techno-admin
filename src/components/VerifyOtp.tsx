import axios from 'axios'
import { Form, Formik } from 'formik'
import { useEffect } from 'react'
import { Alert, Button, Container, Spinner } from 'react-bootstrap'
import { useMutation } from 'react-query'
import { useHistory, useParams } from 'react-router'
import * as Yup from "yup"
import useTokenStore from '../hooks/useTokenStore'
import { InputField } from '../shared-components/InputFeild'
import Logo from '../shared-components/Logo'
import { appApiBaseUrl } from '../utils/constants'

interface Props {

}

const VerifySchema = Yup.object().shape({
    otp: Yup.string().max(4).min(4).required("Otp is required")
})


const verifyOtp = (formData: FormData) => {
    return axios.post(`${appApiBaseUrl}auth/verify-otp`, formData, {
        headers: { "Content-Type": "multipart/form-data" },

    })
}

const VerifyOtp = (props: Props) => {
    const setToken = useTokenStore(state => state.setToken)
    const { mutate, data, isLoading, error } = useMutation(verifyOtp)
    const params: { id: string } = useParams()
    const history = useHistory()
    useEffect(() => {
        if (data) {
            console.log("verify-otp", data)
            setToken(data.data.token)
            history.push("/")
        }



    }, [data])

    return (
        <Container fluid className="login-page" >
            <Formik initialValues={{ otp: "" }} onSubmit={values => {

                const formData = new FormData()
                formData.append("phone", params.id)
                formData.append("otp", values.otp)

                mutate(formData)


            }}
                validationSchema={VerifySchema}
            >

                {
                    ({ errors }) => {

                        return (
                            <Form >
                                <div className="form-container px-3 py-5 rounded">

                                    <div className="logo-container">
                                        <Logo />
                                    </div>


                                    <h1 className="text-primary my-3"><b>Verify OTP</b></h1>
                                    <p>Please enter the code sent on your mobile number</p>
                                    {
                                        error &&
                                        <Alert variant="danger">{(error as any).response.data.error}</Alert>
                                    }

                                    <InputField name="otp" placeholder="Enter the Otp" label="Verify Otp" error={errors.otp} />
                                    <Button variant="primary" type="submit" className="my-2">
                                        {
                                            isLoading ?
                                                <Spinner animation="border" variant="secondary" size="sm" /> :
                                                <div className="text-secondary">
                                                    <b>Verify OTP</b>
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

export default VerifyOtp
