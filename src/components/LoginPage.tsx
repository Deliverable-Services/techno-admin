import { AxiosError } from "axios";
import { Form, Formik } from "formik";
import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useMutation } from "react-query";
import { useHistory } from "react-router";
import * as Yup from "yup";
import { primaryColor } from "../utils/constants";

import { InputField } from "../shared-components/InputFeild";
import OtpInput from "../shared-components/OtpInput";
import { handleApiError } from "../hooks/handleApiErrors";
import useTokenStore from "../hooks/useTokenStore";
import useUserProfileStore from "../hooks/useUserProfileStore";
import { useOrganisation } from "../context/OrganisationContext";
import API from "../utils/API";
import { showErrorToast } from "../utils/showErrorToast";
import { showMsgToast } from "../utils/showMsgToast";
import { Hammer } from "./ui/icon";

const LoginSchema = Yup.object().shape({
  phone: Yup.string().required("Phone number required"),
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
  const [countryCode, setCountryCode] = useState("+91");

  const setToken = useTokenStore((state) => state.setToken);
  const setUser = useUserProfileStore((state) => state.setUser);
  const setUserPermissions = useUserProfileStore(
    (state) => state.setUserPermssions
  );
  const { setOrganisations, selectedOrg, setSelectedOrg } = useOrganisation();

  const { mutate: sendOtpMutate, isLoading: isSendingOtp } = useMutation(
    sendOtp,
    {
      onSuccess: () => {
        showMsgToast("OTP sent successfully");
        setStep("otp");
      },
      onError: (error: AxiosError) => {
        handleApiError(error);
      },
    }
  );

  const { mutate: verifyOtpMutate, isLoading: isVerifyingOtp } = useMutation(
    verifyOtp,
    {
      onSuccess: (data) => {
        handleSetOrganisations(data?.data?.user?.organisations);
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

  const handleSetOrganisations = (orgs) => {
    setOrganisations(orgs);

    // set default org if not selected
    if (!selectedOrg && orgs.length) {
      const stored = localStorage.getItem("selectedOrganisation");
      if (!stored) {
        setSelectedOrg(orgs[0]);
      }
    }
  };

  return (
    <div
      className="vh-100 px-0 login-main m-0 p-0"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        position: "relative",
      }}
    >
      {/* Background Pattern - Same as VerifyingUserLoader */}
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
      <div className="row h-100 no-gutters align-items-center justify-content-center">
        {/* RIGHT SIDE FORM */}
        <div
          className="col-md-6 d-flex align-items-center justify-content-center"
          style={{ position: "relative", zIndex: 2 }}
        >
          <div
            className="w-100 px-5 py-5 login-wrapper text-center"
            style={{
              maxWidth: "500px",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "24px",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.2)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <img
              src="/assets/logo.svg"
              alt="Logo"
              style={{ width: 120, marginBottom: 30, height: "auto" }}
            />

            {step === "login" && (
              <div className="text-center mb-4">
                <h3
                  className="mb-2"
                  style={{
                    fontWeight: "700",
                    color: "#2c3e50",
                    fontSize: "28px",
                  }}
                >
                  Welcome Back
                </h3>
                <p
                  className="text-muted"
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.5",
                    marginBottom: "24px",
                  }}
                >
                  Enter your phone number to receive the secure one-time code.
                </p>
              </div>
            )}
            {step === "login" && (
              <div className="d-flex justify-content-center mb-4">
                <div
                  className="d-flex"
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderRadius: "12px",
                    padding: "4px",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <button
                    className={`btn ${
                      activeTab === "login" ? "btn-primary" : "btn-light"
                    }`}
                    style={{
                      borderRadius: "8px",
                      padding: "8px 24px",
                      fontSize: "14px",
                      fontWeight: "600",
                      border: "none",
                      backgroundColor:
                        activeTab === "login" ? primaryColor : "transparent",
                      color: activeTab === "login" ? "white" : "#6c757d",
                      transition: "all 0.3s ease",
                    }}
                    onClick={() => {
                      setActiveTab("login");
                      setStep("login");
                    }}
                  >
                    <Hammer size={12} className="mr-1" />
                    Login
                  </button>
                  <button
                    className={`btn ${
                      activeTab === "signup" ? "btn-primary" : "btn-light"
                    }`}
                    style={{
                      borderRadius: "8px",
                      padding: "8px 24px",
                      fontSize: "14px",
                      fontWeight: "600",
                      border: "none",
                      backgroundColor:
                        activeTab === "signup" ? primaryColor : "transparent",
                      color: activeTab === "signup" ? "white" : "#6c757d",
                      transition: "all 0.3s ease",
                    }}
                    onClick={() => setActiveTab("signup")}
                  >
                    <Hammer size={12} className="mr-1" />
                    Sign Up
                  </button>
                </div>
              </div>
            )}

            {activeTab === "login" && step === "login" && (
              <Formik
                initialValues={{ phone: "7018064278" }}
                onSubmit={(values) => {
                  const formData = new FormData();
                  formData.append("phone", `${countryCode}${values.phone}`);
                  formData.append(
                    "organisation_id",
                    `${countryCode}${values.phone}`
                  );
                  setPhone(`${countryCode}${values.phone}`);
                  sendOtpMutate(formData);
                }}
                validationSchema={LoginSchema}
              >
                {({ errors }) => (
                  <Form>
                    <div className="mb-3 text-left">
                      <label
                        htmlFor="phone"
                        className="form-label"
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#495057",
                          marginBottom: "8px",
                        }}
                      >
                        Enter Registered Phone Number
                      </label>
                      <div
                        className="d-flex"
                        style={{
                          border: "2px solid #e9ecef",
                          borderRadius: "12px",
                          overflow: "hidden",
                          transition: "border-color 0.3s ease",
                          backgroundColor: "white",
                        }}
                      >
                        <select
                          className="form-select"
                          style={{
                            maxWidth: 100,
                            border: "none",
                            height: 48,
                            backgroundColor: "#f8f9fa",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                        >
                          <option value="+91">🇮🇳 +91</option>
                          <option value="+1">🇺🇸 +1</option>
                        </select>
                        <span style={{ flex: 1, height: "48px" }}>
                          <InputField
                            name="phone"
                            placeholder="Enter your phone number"
                            type="text"
                            style={{
                              border: "none",
                              height: "48px",
                              fontSize: "16px",
                              backgroundColor: "transparent",
                            }}
                          />
                        </span>
                      </div>
                      {errors.phone && (
                        <small
                          className="text-danger"
                          style={{
                            fontSize: "12px",
                            marginTop: "4px",
                            display: "block",
                          }}
                        >
                          {errors.phone}
                        </small>
                      )}
                    </div>
                    {/* Enhanced Submit Button */}{" "}
                    <Button
                      type="submit"
                      className="btn btn-block"
                      style={{
                        height: "52px",
                        backgroundColor: primaryColor,
                        borderColor: primaryColor,
                        borderRadius: "12px",
                        fontSize: "16px",
                        fontWeight: "600",
                        boxShadow: `0 4px 12px ${primaryColor}25`,
                        border: "none",
                        transition: "all 0.3s ease",
                      }}
                      disabled={isSendingOtp}
                    >
                      {isSendingOtp ? (
                        <div className="d-flex align-items-center justify-content-center">
                          <Spinner
                            animation="border"
                            size="sm"
                            className="mr-2"
                          />
                          Sending OTP...
                        </div>
                      ) : (
                        <div className="d-flex align-items-center justify-content-center">
                          <Hammer size={16} className="mr-2" />
                          Get Secure Code
                        </div>
                      )}
                    </Button>
                  </Form>
                )}
              </Formik>
            )}

            {/* === ENHANCED OTP FORM === */}
            {activeTab === "login" && step === "otp" && (
              <div>
                <div className="text-center mb-4">
                  <h3
                    className="mb-2"
                    style={{
                      fontWeight: "700",
                      color: "#2c3e50",
                      fontSize: "24px",
                    }}
                  >
                    Enter your one-time code
                  </h3>
                  <span className="text-muted mb-0">received on </span>
                  <span
                    style={{
                      fontWeight: "600",
                      color: primaryColor,
                      fontSize: "16px",
                      marginBottom: 0,
                    }}
                  >
                    {phone}
                  </span>
                </div>

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
                  {({ errors, setFieldValue, values }) => (
                    <Form>
                      <div className="mb-4">
                        <OtpInput
                          length={4}
                          onComplete={(otp) => {
                            setFieldValue("otp", otp);
                            // Auto-submit when OTP is complete
                            const formData = new FormData();
                            formData.append("phone", phone);
                            formData.append("otp", otp);
                            verifyOtpMutate(formData);
                          }}
                          onChange={(otp) => setFieldValue("otp", otp)}
                          error={errors.otp}
                          disabled={isVerifyingOtp}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="btn btn-block mb-3"
                        style={{
                          height: "52px",
                          backgroundColor: primaryColor,
                          borderColor: primaryColor,
                          borderRadius: "12px",
                          fontSize: "16px",
                          fontWeight: "600",
                          boxShadow: `0 4px 12px ${primaryColor}25`,
                          border: "none",
                        }}
                        disabled={isVerifyingOtp || values.otp.length !== 4}
                      >
                        {isVerifyingOtp ? (
                          <div className="d-flex align-items-center justify-content-center">
                            <Spinner
                              animation="border"
                              size="sm"
                              className="mr-2"
                            />
                            Verifying...
                          </div>
                        ) : (
                          <div className="d-flex align-items-center justify-content-center">
                            <Hammer size={16} className="mr-2" />
                            Continue
                          </div>
                        )}
                      </Button>

                      <div className="text-center mb-3">
                        <span
                          className="text-muted"
                          style={{ fontSize: "14px" }}
                        >
                          Didn't receive the code?{" "}
                        </span>
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
                            formData.append("phone", phone);
                            resendOtpMutate(formData);
                          }}
                        >
                          Resend Code
                        </button>
                      </div>

                      {/* Back button with icon */}
                      <div className="text-center">
                        <button
                          type="button"
                          className="btn btn-link"
                          style={{
                            color: "#6c757d",
                            fontSize: "14px",
                            textDecoration: "none",
                          }}
                          onClick={() => setStep("login")}
                        >
                          <Hammer size={12} className="mr-2" />
                          Change Phone Number
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
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
