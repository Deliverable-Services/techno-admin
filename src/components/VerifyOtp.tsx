import axios, { AxiosError } from "axios";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { Alert, Button, Container, Spinner } from "react-bootstrap";
import { useMutation } from "react-query";
import { useHistory, useParams } from "react-router";
import { useLocation } from "react-router-dom";
import * as Yup from "yup";
import { handleApiError } from "../hooks/handleApiErrors";
import useTokenStore from "../hooks/useTokenStore";
import useUserProfileStore from "../hooks/useUserProfileStore";
import { InputField } from "../shared-components/InputFeild";
import Logo from "../shared-components/Logo";
import API from "../utils/API";
import { appApiBaseUrl } from "../utils/constants";
import { showErrorToast } from "../utils/showErrorToast";
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

const resendOtp = (formData: FormData) => {
  return API.post(`auth/send-otp`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const VerifyOtp = (props: Props) => {
  const { state } = useLocation();
  const history = useHistory();
  const setToken = useTokenStore((state) => state.setToken);
  const setUser = useUserProfileStore((state) => state.setUser);

  const { mutate, isLoading } = useMutation(verifyOtp, {
    onSuccess: (data) => {
      const roles = {
        role: "admin",
        permissions: [
          "update_brand",
          "create_brand",
          "delete_brand",
          "read_brand",
        ],
      };
      setToken(data.data.token);
      setUser({ ...data.data.user, ...roles });
      history.push("/");
    },
    onError: (error: AxiosError) => {
      showErrorToast(error.message);
    },
  });

  const { mutate: mutateResend } = useMutation(resendOtp, {
    onSuccess: (data) => {
      showMsgToast("OTP resend successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });
  return (
    <Container fluid className="login-page">
      <Formik
        initialValues={{ otp: (state as any).otp }}
        onSubmit={(values) => {
          const formData = new FormData();
          formData.append("phone", (state as any).phone);
          formData.append("otp", (state as any).otp);
          // formData.append("otp", values.otp);

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
                  width: "100vw",
                  maxWidth: "450px",
                }}
              >
                <h1 className="text-black">
                  <b>Verify</b>
                </h1>
                <p className="text-muted text-center">
                  Please enter the code sent on your mobile number
                </p>
                <br />

                <InputField
                  name="otp"
                  placeholder="Enter the Otp"
                  label="Verify Otp"
                  error={errors.otp as string}
                />
                <div className="w-100">
                  <p
                    className="text-primary text-right m-0"
                    onClick={() => {
                      const formData = new FormData();
                      formData.append("phone", (state as any).phone);
                      mutateResend(formData);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    Resend OTP
                  </p>
                </div>
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
