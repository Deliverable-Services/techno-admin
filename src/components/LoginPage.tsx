import { AxiosError } from "axios";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { Button, Container, Spinner } from "react-bootstrap";
import { useMutation } from "react-query";
import { useHistory } from "react-router";
import * as Yup from "yup";
import { handleApiError } from "../hooks/handleApiErrors";
import { InputField } from "../shared-components/InputFeild";
import API from "../utils/API";

interface Props {}
const phoneRegExp = /^[6-9]\d{9}$/;
const LoginSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Phone number required"),
});

const sendOtp = (formData: FormData) => {
  return API.post(`auth/send-otp`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const LoginPage = (props: Props) => {
  const history = useHistory();

  const { mutate, data, isLoading } = useMutation(sendOtp, {
    onSuccess: (data) => {
      history.push(`/verify-otp/`, {
        phone: data.data.user.phone,
        otp: data.data.user.otp,
      });
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  return (
    <Container fluid className="login-page">
      <Formik
        initialValues={{ phone: "7018064278" }}
        onSubmit={(values) => {
          const formData = new FormData();
          formData.append("phone", values.phone);

          mutate(formData);
        }}
        validationSchema={LoginSchema}
      >
        {({ errors }) => {
          return (
            <Form>
              <div
                className="d-flex flex-column align-items-center justify-content-between px-3 py-3"
                style={{
                  width: "100vw",
                  maxWidth: "450px",
                }}
              >
                <h1 className="text-black">
                  <b>Sign In</b>
                </h1>
                <p className="text-muted">OTP will be send to your number.</p>
                <br />
                <InputField
                  name="phone"
                  placeholder="Enter your phone number"
                  label="Phone number"
                  type="text"
                  error={errors.phone}
                />

                <Button
                  variant="primary"
                  type="submit"
                  className="full-width my-2"
                >
                  {isLoading ? (
                    <Spinner animation="border" variant="secondary" size="sm" />
                  ) : (
                    <div className="text-white">
                      <b>Submit</b>
                    </div>
                  )}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Container>
  );
};

export default LoginPage;
