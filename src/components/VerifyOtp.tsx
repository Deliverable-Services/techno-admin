import axios from "axios";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { Alert, Button, Container, Spinner } from "react-bootstrap";
import { useMutation } from "react-query";
import { useHistory, useParams } from "react-router";
import * as Yup from "yup";
import useTokenStore from "../hooks/useTokenStore";
import useUserProfileStore from "../hooks/useUserProfileStore";
import { InputField } from "../shared-components/InputFeild";
import Logo from "../shared-components/Logo";
import API from "../utils/API";
import { appApiBaseUrl } from "../utils/constants";
import { showMsgToast } from "../utils/showMsgToast";

interface Props {}

const VerifySchema = Yup.object().shape({
  otp: Yup.string().max(4).min(4).required("Otp is required"),
});

const verifyOtp = (formData: FormData) => {
  return API.post(`auth/verify-otp`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const VerifyOtp = (props: Props) => {
  const params: { id: string; otp: string } = useParams();
  const history = useHistory();
  const setToken = useTokenStore((state) => state.setToken);
  const setUser = useUserProfileStore((state) => state.setUser);

  const { mutate, data, isLoading, error } = useMutation(verifyOtp, {
    onSuccess: (data) => {
      console.log({ data });
      console.log({ data });
      setToken(data.data.token);
      setUser(data.data.user);
      history.push("/");
    },
  });

  return (
    <Container fluid className="login-page">
      <Formik
        initialValues={{ otp: params.otp || "" }}
        onSubmit={(values) => {
          const formData = new FormData();
          formData.append("phone", params.id);
          formData.append("otp", values.otp);

          mutate(formData);
        }}
        validationSchema={VerifySchema}
      >
        {({ errors }) => {
          return (
            <Form>
              <div
                className="d-flex flex-column align-items-center px-3 py-5"
                style={{
                  width: "450px",
                }}
              >
                <h1 className="text-black">
                  <b>Verify</b>
                </h1>
                <p className="text-muted">
                  Please enter the code sent on your mobile number
                </p>
                <br />
                {error && (
                  <Alert variant="danger">
                    {(error as any).response.data.error}
                  </Alert>
                )}

                <InputField
                  name="otp"
                  placeholder="Enter the Otp"
                  label="Verify Otp"
                  error={errors.otp}
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
                      <b>Verify</b>
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

export default VerifyOtp;
