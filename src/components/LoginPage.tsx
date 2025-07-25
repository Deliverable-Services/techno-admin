import { AxiosError } from "axios";
import { Form, Formik } from "formik";
import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useMutation } from "react-query";
import { useHistory } from "react-router";
import * as Yup from "yup";

import { InputField } from "../shared-components/InputFeild";
import { handleApiError } from "../hooks/handleApiErrors";
import useTokenStore from "../hooks/useTokenStore";
import useUserProfileStore from "../hooks/useUserProfileStore";
import API from "../utils/API";
import { showErrorToast } from "../utils/showErrorToast";
import { showMsgToast } from "../utils/showMsgToast";

import logo from "../assets/logo.svg";

const LoginSchema = Yup.object().shape({
  phone: Yup.string()
    .required("Phone number required"),
});

const VerifySchema = Yup.object().shape({
  otp: Yup.string().max(4).min(4).required("OTP is required"),
});

const sendOtp = (formData: FormData) =>
  API.post(`auth/send-otp`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

const verifyOtp = (formData: FormData) =>
  API.post(`auth/verify-otp`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

const LoginFlow = () => {
  const history = useHistory();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [step, setStep] = useState<"login" | "otp">("login");
  const [phone, setPhone] = useState("");

  const setToken = useTokenStore((state) => state.setToken);
  const setUser = useUserProfileStore((state) => state.setUser);
  const setUserPermissions = useUserProfileStore(
    (state) => state.setUserPermssions
  );

  const { mutate: sendOtpMutate, isLoading: isSendingOtp } = useMutation(sendOtp, {
    onSuccess: () => {
      showMsgToast("OTP sent successfully");
      setStep("otp");
    },
    onError: (error: AxiosError) => {
      handleApiError(error);
    },
  });

  const { mutate: verifyOtpMutate, isLoading: isVerifyingOtp } = useMutation(
    verifyOtp,
    {
      onSuccess: (data) => {
        setToken(data.data.token);
        setUser(data.data.user);
        setUserPermissions(data?.data?.permissions);
        showMsgToast("Login successful!");
        history.push("/");
      },
      onError: (error: AxiosError) => {
        showErrorToast(error.message);
      },
    }
  );

  const { mutate: resendOtpMutate } = useMutation(sendOtp, {
    onSuccess: () => {
      showMsgToast("OTP resent successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(error);
    },
  });

  return (
    <div className="vh-100 px-0 login-main m-0 p-0">
      <div className="row h-100 no-gutters align-items-center">
        {/* LEFT SIDE IMAGE */}
        <div
          className="col-md-6 d-none d-md-block h-100 text-center text-white login-left-panel"
          style={{
            backgroundImage: 'url("/assets/order.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{ width: 200, marginBottom: 30 }}
          />
          <h1 className="px-4">Your Smart Workspace for Growth & Success</h1>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-white">
          <div className="w-100 px-4 py-5" style={{ maxWidth: "400px" }}>
            {/* Title and description - Only in login step */}
            {step === "login" && (
              <div className="text-center mb-3">
                <h4 className="mb-0 font-weight-bold">Sign In</h4>
                <small className="text-muted">
                  OTP will be sent to your number.
                </small>
              </div>
            )}

            {/* Tabs - Only in login step */}
            {step === "login" && (
              <ul className="nav nav-pills nav-justified mb-4 login-tab">
                <li className="nav-item">
                  <a
                    className={`nav-link btn ${activeTab === "login" ? "active" : ""}`}
                    href="#"
                    onClick={() => {
                      setActiveTab("login");
                      setStep("login");
                    }}
                  >
                    Login
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link btn ${activeTab === "signup" ? "active" : ""}`}
                    href="#"
                    onClick={() => setActiveTab("signup")}
                  >
                    Sign Up
                  </a>
                </li>
              </ul>
            )}

            {/* === LOGIN FORM === */}
            {activeTab === "login" && step === "login" && (
              <Formik
                initialValues={{ phone: "" }}
                onSubmit={(values) => {
                  const formData = new FormData();
                  formData.append("phone", values.phone);
                  setPhone(values.phone);
                  sendOtpMutate(formData);
                }}
                validationSchema={LoginSchema}
              >
                {({ errors }) => (
                  <Form>
                    <InputField
                      name="phone"
                      placeholder="Enter phone number"
                      label="Phone number"
                      type="text"
                      error={errors.phone}
                    />
                    <Button
                      type="submit"
                      className="btn btn-primary btn-block mt-3"
                      disabled={isSendingOtp}
                    >
                      {isSendingOtp ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <b>Submit</b>
                      )}
                    </Button>
                  </Form>
                )}
              </Formik>
            )}

            {/* === OTP FORM === */}
            {activeTab === "login" && step === "otp" && (
              <Formik
                initialValues={{ otp: "" }}
                onSubmit={(values) => {
                  const formData = new FormData();
                  formData.append("phone", phone);
                  formData.append("otp", values.otp);
                  verifyOtpMutate(formData);
                }}
                validationSchema={VerifySchema}
              >
                {({ errors }) => (
                  <Form>
                    <div className="text-center mb-3">
                      <h4 className="mb-0 font-weight-bold">Enter OTP</h4>
                      <small className="text-muted">
                        Sent to <b>{phone}</b>
                      </small>
                    </div>

                    <InputField
                      name="otp"
                      placeholder="Enter OTP"
                      label="Verify OTP"
                      type="text"
                      error={errors.otp}
                    />

                

                    {/* Resend OTP */}
                    <div className="text-right">
                      <small
                        className="text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          const formData = new FormData();
                          formData.append("phone", phone);
                          resendOtpMutate(formData);
                        }}
                      >
                        Resend OTP
                      </small>
                    </div>

                    <Button
                      type="submit"
                      className="btn btn-primary btn-block mt-3"
                      disabled={isVerifyingOtp}
                    >
                      {isVerifyingOtp ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <b>Verify</b>
                      )}
                    </Button>
                        {/* Back button */}
                        <div className="mb-2 mt-2 text-center">
                      <Button
                        variant="link"
                        className="px-0"
                        onClick={() => setStep("login")}
                      >
                        ← Back to change number
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            )}

            {/* === SIGN UP === */}
            {activeTab === "signup" && step === "login" && (
              <div className="text-center mt-5">
                <p className="text-muted">
                  To purchase the product, please contact us at:
                  <br />
                  <a href="mailto:purchase@techno.com" className="text-muted">
                    <strong>purchase@techno.com</strong>
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginFlow;
