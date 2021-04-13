import { Form, Formik } from 'formik'
import { Button, Container, Spinner } from 'react-bootstrap'
import { InputField } from '../shared-components/InputFeild'
import Logo from '../shared-components/Logo'

interface Props {

}

const LoginPage = (props: Props) => {
    return (
        <Container fluid className="login-page" >
            <Formik initialValues={{ phone: "" }} onSubmit={values => console.log(values)}>

                {
                    ({ isSubmitting }) => {
                        return (
                            <Form >
                                <div className="form-container px-3 py-5 rounded">

                                    <div className="logo-container">
                                        <Logo />
                                    </div>
                                    <h1 className="text-primary my-3"><b>Login</b></h1>

                                    <InputField name="phone" placeholder="Enter your phone number" label="Phone number" />
                                    <Button variant="primary" type="submit" className="my-2">
                                        {
                                            isSubmitting ?
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
