import { Formik, Form, Field } from "formik";
import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import API from "../../utils/API";
import { showMsgToast } from "../../utils/showMsgToast";
import useTokenStore from "../../hooks/useTokenStore";
import { handleApiError } from "../../hooks/handleApiErrors";
import { queryClient } from "../../utils/queryClient";
import { useOrganisation } from "../../context/OrganisationContext";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

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
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-1">
          Organization Settings
        </h4>
        <p className="text-sm text-gray-600 mb-0">
          Update your organization details and preferences.
        </p>
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
                <div className="mb-6">
                  <Label
                    htmlFor="organizationName"
                    className="block text-sm font-semibold text-gray-700 mb-1.5"
                  >
                    Organization Name
                  </Label>
                  <Field
                    type="text"
                    className="h-11 border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm transition-colors focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none bg-white w-full"
                    id="organizationName"
                    name="organizationName"
                    placeholder="Enter organization name"
                  />
                  {errors.organizationName && touched.organizationName && (
                    <div className="text-red-600 text-xs mt-1">
                      {errors.organizationName}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-6">
                  <Label
                    htmlFor="organizationEmail"
                    className="block text-sm font-semibold text-gray-700 mb-1.5"
                  >
                    Organization Email
                  </Label>
                  <Field
                    type="email"
                    className="h-11 border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm transition-colors focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none bg-white w-full"
                    id="organizationEmail"
                    name="organizationEmail"
                    placeholder="Enter organization email"
                  />
                  {errors.organizationEmail && touched.organizationEmail && (
                    <div className="text-red-600 text-xs mt-1">
                      {errors.organizationEmail}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Organization Type Selection */}
            <div className="mb-6">
              <Label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Organization Type
              </Label>
              <p className="text-gray-600 mb-3 text-sm">
                Choose the type that best describes your organization
              </p>

              <div className="row g-4">
                {/* CRM Option */}
                <div className="col-md-6">
                  <div
                    className={`card h-100 border-2 transition-all duration-200 cursor-pointer ${
                      values.storeType === "crm"
                        ? "border-blue-600 shadow-lg shadow-blue-600/30"
                        : "border-gray-200"
                    }`}
                    onClick={() => setFieldValue("storeType", "crm")}
                  >
                    <img
                      src="https://miro.medium.com/v2/resize:fit:1400/1*TR-8mgpp0_X5P0ZbB6XYfQ.jpeg"
                      className="card-img-top w-full h-36 object-cover rounded-lg"
                      alt="CRM"
                    />
                    <div className="card-body position-relative">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <h5 className="card-title mb-0 text-blue-600 text-base font-semibold">
                          CRM System
                        </h5>
                        {values.storeType === "crm" && (
                          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
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
                      <p className="card-text text-gray-600 text-sm">
                        Manage leads, sales, and customer relationships with
                        advanced CRM tools.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ecommerce Option */}
                <div className="col-md-6">
                  <div
                    className={`card h-100 border-2 transition-all duration-200 cursor-pointer ${
                      values.storeType === "ecommerce"
                        ? "border-blue-600 shadow-lg shadow-blue-600/30"
                        : "border-gray-200"
                    }`}
                    onClick={() => setFieldValue("storeType", "ecommerce")}
                  >
                    <img
                      src="https://s3.envato.com/files/101016168/2a.UCM-CRM-dashboard-desktop.png"
                      className="card-img-top w-full h-36 object-cover rounded-lg"
                      alt="Ecommerce"
                    />
                    <div className="card-body position-relative">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <h5 className="card-title mb-0 text-base font-semibold">
                          E-commerce
                        </h5>
                        {values.storeType === "ecommerce" && (
                          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
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
                      <p className="card-text text-gray-600 text-sm">
                        Control your online store, manage products, and track
                        orders efficiently.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {errors.storeType && touched.storeType && (
                <div className="text-red-600 text-xs mt-2">
                  {errors.storeType}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="d-flex justify-content-end gap-3 mt-4 pt-4 border-top">
              <Button variant="outline" type="button" disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="px-4">
                {isLoading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
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
