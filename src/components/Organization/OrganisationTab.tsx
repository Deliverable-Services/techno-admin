import { Formik, Form, Field } from "formik";
import { Button, Spinner } from "react-bootstrap";
import { showMsgToast } from "../../utils/showMsgToast";
import useTokenStore from "../../hooks/useTokenStore";
import API from "../../utils/API";
import { handleApiError } from "../../hooks/handleApiErrors";
import { queryClient } from "../../utils/queryClient";
import { useMutation } from "react-query";
import { AxiosError } from "axios";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { useOrganisation } from "../../context/OrganisationContext";

const key = "organisations";

const ValidationSchema = Yup.object().shape({
  organizationName: Yup.string().required("Organisation name is required"),
  organizationEmail: Yup.string()
    .email("Invalid email")
    .required("Organisation email is required"),
  storeType: Yup.string().required("Store type is required"),
});

const OrganizationTab = () => {
  const history = useHistory();
  const token = useTokenStore((state) => state.accessToken);
  const { organisations, selectedOrg, setSelectedOrg } = useOrganisation();

  const initialValues = {
    organizationName: selectedOrg?.name || "",
    organizationEmail: selectedOrg?.email || "",
    storeType: (selectedOrg?.store_type || "crm").toLowerCase(),
  };

  const updateOrganisation = async (values) => {
    const storeType = values.storeType === "crm" ? "CRM" : "ECOMMERCE";
    await API.put(
      `${key}/${selectedOrg.id}`,
      {
        name: values.organizationName,
        email: values.organizationEmail,
        store_type: storeType,
      },
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          "Content-Type": "application/json",
        },
      }
    );
  };

  const { mutate, isLoading } = useMutation(updateOrganisation, {
    onSuccess: (_, variables) => {
      const updatedOrg = {
        ...selectedOrg,
        name: variables.organizationName,
        email: variables.organizationEmail,
        store_type: variables.storeType.toUpperCase(),
      };
      setSelectedOrg(updatedOrg); // also update context and localstorage

      queryClient.invalidateQueries("profile");
      showMsgToast("Organization updated successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  return (
    <div>
      {/* Section Header */}
      <div className="section-header">
        <h4>Organization Settings</h4>
        <p>Update your organization details and preferences.</p>
      </div>

      {/* Form Content */}
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={ValidationSchema}
        onSubmit={(values) => {
          mutate(values);
        }}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form>
            {/* Basic Information */}
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="organizationName">Organization Name</label>
                  <Field
                    type="text"
                    className="form-control"
                    id="organizationName"
                    name="organizationName"
                    placeholder="Enter organization name"
                  />
                  {errors.organizationName && touched.organizationName && (
                    <div className="text-danger fs-12 mt-1">
                      {errors.organizationName}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="organizationEmail">Organization Email</label>
                  <Field
                    type="email"
                    className="form-control"
                    id="organizationEmail"
                    name="organizationEmail"
                    placeholder="Enter organization email"
                  />
                  {errors.organizationEmail && touched.organizationEmail && (
                    <div className="text-danger fs-12 mt-1">
                      {errors.organizationEmail}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Organization Type Selection */}
            <div className="form-group">
              <label>Organization Type</label>
              <p className="text-muted mb-3" style={{ fontSize: "14px" }}>
                Choose the type that best describes your organization
              </p>

              <div className="row g-4">
                {/* CRM Option */}
                <div className="col-md-6">
                  <div
                    className={`card h-100 border-2 ${
                      values.storeType === "crm"
                        ? "border-primary selected"
                        : "border-light"
                    }`}
                    onClick={() => setFieldValue("storeType", "crm")}
                    style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                  >
                    <img
                      src="https://miro.medium.com/v2/resize:fit:1400/1*TR-8mgpp0_X5P0ZbB6XYfQ.jpeg"
                      className="card-img-top"
                      alt="CRM"
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                    <div className="card-body position-relative">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <h5
                          className="card-title mb-0 text-primary"
                          style={{ fontSize: "16px", fontWeight: "600" }}
                        >
                          CRM System
                        </h5>
                        {values.storeType === "crm" && (
                          <div
                            style={{
                              width: "20px",
                              height: "20px",
                              backgroundColor: "#0b64fe",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                            >
                              <path
                                d="M10 3L4.5 8.5L2 6"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p
                        className="card-text text-muted"
                        style={{ fontSize: "14px" }}
                      >
                        Manage leads, sales, and customer relationships with
                        advanced CRM tools.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ecommerce Option */}
                <div className="col-md-6">
                  <div
                    className={`card h-100 border-2 ${
                      values.storeType === "ecommerce"
                        ? "border-primary selected"
                        : "border-light"
                    }`}
                    onClick={() => setFieldValue("storeType", "ecommerce")}
                    style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                  >
                    <img
                      src="https://s3.envato.com/files/101016168/2a.UCM-CRM-dashboard-desktop.png"
                      className="card-img-top"
                      alt="Ecommerce"
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                    <div className="card-body position-relative">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <h5
                          className="card-title mb-0"
                          style={{ fontSize: "16px", fontWeight: "600" }}
                        >
                          E-commerce
                        </h5>
                        {values.storeType === "ecommerce" && (
                          <div
                            style={{
                              width: "20px",
                              height: "20px",
                              backgroundColor: "#0b64fe",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                            >
                              <path
                                d="M10 3L4.5 8.5L2 6"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p
                        className="card-text text-muted"
                        style={{ fontSize: "14px" }}
                      >
                        Control your online store, manage products, and track
                        orders efficiently.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {errors.storeType && touched.storeType && (
                <div className="text-danger fs-12 mt-2">{errors.storeType}</div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="d-flex justify-content-end gap-3 mt-4 pt-4 border-top">
              <Button
                variant="outline-primary"
                type="button"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isLoading}
                className="px-4"
              >
                {isLoading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default OrganizationTab;
