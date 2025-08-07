import { AxiosError } from "axios";
import { Form, Formik } from "formik";
import { Button, Container, Spinner } from "react-bootstrap";
import { useMutation } from "react-query";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import * as Yup from "yup";

import { MdVerifiedUser, MdSecurity } from "react-icons/md";
import { primaryColor } from "../utils/constants";
import { handleApiError } from "../hooks/handleApiErrors";
import useTokenStore from "../hooks/useTokenStore";
import useUserProfileStore from "../hooks/useUserProfileStore";
import OtpInput from "../shared-components/OtpInput";
import API from "../utils/API";
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

  console.log({ state });
  const history = useHistory();
  const setToken = useTokenStore((state) => state.setToken);
  const setUser = useUserProfileStore((state) => state.setUser);
  const setUserPermissions = useUserProfileStore(
    (state) => state.setUserPermssions
  );

  const { mutate, isLoading } = useMutation(verifyOtp, {
    onSuccess: (data) => {
      setToken(data.data.token);
      setUser(data.data.user);
      setUserPermissions(data?.data?.permissions);
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
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
          animation: "float 6s ease-in-out infinite",
        }}
      />

      <Container
        fluid
        className="login-page"
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "500px",
        }}
      >
        <Formik
          initialValues={{ otp: (state as any).otp || "" }}
          onSubmit={(values) => {
            const formData = new FormData();
            formData.append("phone", (state as any).phone);
            formData.append("otp", values.otp);
            mutate(formData);
          }}
          validationSchema={VerifySchema}
        >
          {({ errors, setFieldValue, values }) => {
            return (
              <Form>
                <div
                  className="d-flex flex-column align-items-center px-4 py-5"
                  style={{
                    width: "100%",
                    maxWidth: "450px",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "24px",
                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.2)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    margin: "20px",
                  }}
                >
                  <div className="text-center mb-4">
                    <h2
                      className="mb-2"
                      style={{
                        fontWeight: "700",
                        color: "#2c3e50",
                        fontSize: "28px",
                      }}
                    >
                      Enter your one-time code
                    </h2>
                    <p
                      className="text-muted text-center"
                      style={{
                        fontSize: "16px",
                        lineHeight: "1.5",
                        marginBottom: "8px",
                      }}
                    >
                      Enter the 4-digit security code sent to your mobile number
                    </p>
                    <div
                      className="d-flex align-items-center justify-content-center mt-2 mb-4"
                      style={{
                        padding: "6px 12px",
                        backgroundColor: `${primaryColor}10`,
                        borderRadius: "16px",
                        border: `1px solid ${primaryColor}20`,
                      }}
                    >
                      <MdSecurity
                        size={14}
                        color={primaryColor}
                        className="mr-1"
                      />
                      <small
                        style={{
                          color: primaryColor,
                          fontWeight: "600",
                          fontSize: "12px",
                        }}
                      >
                        Secure Verification
                      </small>
                    </div>
                  </div>

                  {/* Enhanced OTP Input */}
                  <div className="w-100 mb-4">
                    <OtpInput
                      length={4}
                      onComplete={(otp) => {
                        setFieldValue("otp", otp);
                        // Auto-submit when OTP is complete
                        const formData = new FormData();
                        formData.append("phone", (state as any).phone);
                        formData.append("otp", otp);
                        mutate(formData);
                      }}
                      onChange={(otp) => setFieldValue("otp", otp)}
                      error={errors.otp as string}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Resend OTP Section */}
                  <div className="text-center mb-4 w-100">
                    <p className="text-muted mb-2" style={{ fontSize: "14px" }}>
                      Didn't receive the code?
                    </p>
                    <button
                      type="button"
                      className="btn btn-link p-0"
                      style={{
                        color: primaryColor,
                        fontSize: "14px",
                        fontWeight: "600",
                        textDecoration: "none",
                      }}
                      onClick={() => {
                        const formData = new FormData();
                        formData.append("phone", (state as any).phone);
                        mutateResend(formData);
                      }}
                    >
                      Resend Security Code
                    </button>
                  </div>

                  {/* Enhanced Verify Button */}
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100"
                    style={{
                      height: "56px",
                      backgroundColor: primaryColor,
                      borderColor: primaryColor,
                      borderRadius: "16px",
                      fontSize: "16px",
                      fontWeight: "600",
                      boxShadow: `0 6px 20px ${primaryColor}30`,
                      border: "none",
                      transition: "all 0.3s ease",
                    }}
                    disabled={isLoading || values.otp.length !== 4}
                  >
                    {isLoading ? (
                      <div className="d-flex align-items-center justify-content-center">
                        <Spinner
                          animation="border"
                          size="sm"
                          className="mr-2"
                        />
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      <div className="d-flex align-items-center justify-content-center">
                        <MdVerifiedUser size={18} className="mr-2" />
                        <span>Verify & Continue</span>
                      </div>
                    )}
                  </Button>

                  {/* Security Note */}
                  <div className="text-center mt-4">
                    <small className="text-muted" style={{ fontSize: "12px" }}>
                      🔒 Your verification is secured with end-to-end encryption
                    </small>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </Container>
    </div>
  );
};

export default VerifyOtp;
