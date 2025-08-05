import { Formik, Form, Field } from "formik";
import Select from "react-select";
import { Button, Col, Row, Spinner } from "react-bootstrap";
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

  const handleSetSelectedOrg = async (option) => {
    const org = organisations.find((o) => o.id === option.value);
    if (org) {
      try {
        await API.post(`${key}/${org.id}/switch`);
      } catch (error) {
        handleApiError(error, history);
      }
      setSelectedOrg(org);
    }
  };

  const organisationOptions = organisations.map((org) => ({
    value: org.id,
    label: org.name,
    ...org,
  }));

  return (
    <>
      <div className="tab-header">
        <h4>Update Your Organization</h4>
      </div>
      <div>
        <div className="right-content">
          <div className="profile-card d-flex flex-column align-items-center">
            <div className="border-div form-group w-100 mt-4 d-flex align-items-center">
              <label htmlFor="organizationName">Select Organisation</label>
              <Select
                options={organisationOptions}
                value={
                  selectedOrg
                    ? {
                        value: selectedOrg.id,
                        label: selectedOrg.name,
                      }
                    : null
                }
                onChange={handleSetSelectedOrg}
                placeholder="Select Organisation"
                isClearable={false}
                className="input-div"
              />
            </div>

            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={ValidationSchema}
              onSubmit={(values) => {
                mutate(values);
              }}
            >
              {({ values, errors, touched, setFieldValue }) => (
                <Form className="w-100 mt-2">
                  <div className="border-div form-group w-100 mt-4 d-flex align-items-center">
                    <label htmlFor="organizationName">Organisation Name</label>
                    <div className="w-100">
                      <Field
                        type="text"
                        className="form-control input-div"
                        id="organizationName"
                        name="organizationName"
                        placeholder="Enter organisation name"
                      />
                      {errors.organizationName && touched.organizationName && (
                        <div className="text-danger fs-12 ms-2">
                          {errors.organizationName}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="border-div form-group w-100 mt-3 d-flex align-items-center">
                    <label htmlFor="organizationEmail">
                      Organisation Email
                    </label>
                    <div className="w-100">
                      <Field
                        type="email"
                        className="form-control input-div"
                        id="organizationEmail"
                        name="organizationEmail"
                        placeholder="Enter organisation email"
                      />
                      {errors.organizationEmail &&
                        touched.organizationEmail && (
                          <div className="text-danger fs-12 ms-2">
                            {errors.organizationEmail}
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="border-div form-group w-100 mt-3 d-flex">
                    <label htmlFor="organizationSlug">
                      Organisation Preference
                    </label>
                    <div className="row" style={{ gap: "30px" }}>
                      {/* CRM */}
                      <div
                        className="position-relative"
                        style={{ width: "250px" }}
                      >
                        <div
                          className={`card mb-4 ${
                            values.storeType === "crm"
                              ? "border-crm selected"
                              : ""
                          }`}
                          onClick={() => setFieldValue("storeType", "crm")}
                          style={{ cursor: "pointer" }}
                        >
                          <img
                            src="https://miro.medium.com/v2/resize:fit:1400/1*TR-8mgpp0_X5P0ZbB6XYfQ.jpeg"
                            className="card-img-top"
                            alt="CRM"
                          />
                          {values.storeType === "crm" && (
                            <div className="active-dot"></div>
                          )}
                        </div>
                        <div className="position-relative">
                          <h5
                            className="card-title text-primary"
                            style={{ fontSize: "16px" }}
                          >
                            CRM
                          </h5>
                          <p style={{ fontSize: "14px" }}>
                            Manage leads, sales, and customer relationships.
                          </p>
                        </div>
                      </div>
                      {/* Ecommerce */}
                      <div
                        className="position-relative"
                        style={{ width: "250px" }}
                      >
                        <div
                          className={`card mb-4 shadow ${
                            values.storeType === "ecommerce"
                              ? "border-crm selected"
                              : ""
                          }`}
                          onClick={() =>
                            setFieldValue("storeType", "ecommerce")
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <img
                            src="https://s3.envato.com/files/101016168/2a.UCM-CRM-dashboard-desktop.png"
                            className="card-img-top"
                            alt="Ecommerce"
                          />
                          {values.storeType === "ecommerce" && (
                            <div className="active-dot"></div>
                          )}
                        </div>
                        <div className="text-left">
                          <h5
                            className="card-title"
                            style={{ fontSize: "16px" }}
                          >
                            Ecommerce
                          </h5>
                          <p style={{ fontSize: "14px" }}>
                            Control your online store, products, and orders.
                          </p>
                        </div>
                      </div>
                    </div>
                    {errors.storeType && touched.storeType && (
                      <div className="text-danger ms-2">{errors.storeType}</div>
                    )}
                  </div>
                  <Row className="d-flex justify-content-start">
                    <Col md="2">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-100"
                      >
                        {isLoading ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          "Save"
                        )}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrganizationTab;
