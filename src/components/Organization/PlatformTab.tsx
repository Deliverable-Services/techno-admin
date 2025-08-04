import { useState, useMemo } from "react";
import { Formik, Form, Field } from "formik";
import { Button, Spinner, Row, Col, Card } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import * as Yup from "yup";
import { useOrganisation } from "../../context/OrganisationContext";
import API from "../../utils/API";
import { showMsgToast } from "../../utils/showMsgToast";
import { handleApiError } from "../../hooks/handleApiErrors";
import { AxiosError } from "axios";
import { useHistory } from "react-router-dom";

const key = "configuration";

const socialOptions = [
  { key: "social-media-facebook", label: "Facebook" },
  { key: "social-media-instagram", label: "Instagram" },
  { key: "social-media-linkedin", label: "LinkedIn" },
  { key: "social-media-twitter", label: "Twitter" },
  { key: "social-media-website", label: "Website" },
  { key: "social-media-youtube", label: "YouTube" },
];

const ValidationSchema = Yup.object().shape({
  "minimum-order-cart": Yup.string().required("Minimum order cart is required"),
  "copyright-message": Yup.string().required("Copyright message is required"),
});

const updateConfig = async (config) => {
  const formdata = new FormData();
  Object.entries(config).forEach(([k, v]) => {
    if (k !== "id") formdata.append(k, String(v));
  });
  return API.post(`configuration/${config.id}`, formdata, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const PlatformTab = () => {
  const history = useHistory();
  const { selectedOrg } = useOrganisation();

  const {
    data: configData,
    isLoading,
    error,
  } = useQuery(
    [`${key}-platform`, selectedOrg?.id],
    () =>
      API.get(
        `${key}?per_page=50&type=platform&org_id=${selectedOrg?.id}`
      ).then((res) => res.data),
    {
      enabled: !!selectedOrg?.id,
      onError: (error: AxiosError) => handleApiError(error, history),
    }
  );

  const configs = configData?.data || [];
  const initialValues = {
    "minimum-order-cart":
      configs.find((d) => d.key === "minimum-order-cart")?.value || "",
    "copyright-message":
      configs.find((d) => d.key === "copyright-message")?.value || "",
    ...socialOptions.reduce((acc, opt) => {
      acc[opt.key] = configs.find((d) => d.key === opt.key)?.value || "";
      return acc;
    }, {}),
  };

  const mutation = useMutation(updateConfig, {
    onSuccess: () => showMsgToast("Platform configuration updated!"),
    onError: handleApiError,
  });

  const [selectedSocial, setSelectedSocial] = useState(socialOptions[0].key);

  const currentSocialValue = useMemo(
    () => initialValues[selectedSocial],
    [selectedSocial, initialValues]
  );

  return (
    <div>
      <div className="tab-header">
        <h4>Platform Configurations</h4>
        <p>Used for setting global business rules or platform logic.</p>
      </div>
      <div className="right-content">
        <div className="profile-card d-flex flex-column align-items-center">
          {isLoading ? (
            <Spinner className="mt-8" animation="border" />
          ) : (
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={ValidationSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                setSubmitting(true);
                // Find changed fields
                const changed = Object.entries(values).filter(
                  ([key, value]) => {
                    const original = configs.find((d) => d.key === key)?.value;
                    return value !== original;
                  }
                );

                await Promise.all(
                  changed.map(([key, value]) => {
                    const config = configs.find((d) => d.key === key);
                    return mutation.mutateAsync({
                      ...config,
                      value,
                    });
                  })
                );
                setSubmitting(false);
                resetForm({ values });
              }}
            >
              {({ values, errors, touched, isSubmitting, setFieldValue }) => (
                <Form className="w-100 mt-2">
                  <div className="border-div form-group w-100 mt-4 d-flex align-items-center">
                    <label htmlFor="minimum-order-cart">
                      Minimum Order Cart
                    </label>
                    <Field
                      type="number"
                      className="form-control input-div"
                      id="minimum-order-cart"
                      name="minimum-order-cart"
                      placeholder="Enter minimum order cart value"
                    />
                    {errors["minimum-order-cart"] &&
                      touched["minimum-order-cart"] && (
                        <div className="text-danger ms-2">
                          {errors["minimum-order-cart"]}
                        </div>
                      )}
                  </div>
                  <div className="border-div form-group w-100 mt-3 d-flex align-items-center">
                    <label htmlFor="copyright-message">Copyright Message</label>
                    <Field
                      type="text"
                      className="form-control input-div"
                      id="copyright-message"
                      name="copyright-message"
                      placeholder="Enter copyright message"
                    />
                    {errors["copyright-message"] &&
                      touched["copyright-message"] && (
                        <div className="text-danger ms-2">
                          {errors["copyright-message"]}
                        </div>
                      )}
                  </div>
                  <div className="form-group w-100 mt-3">
                    <div className="d-flex align-items-center mb-4">
                      <label className="me-3">Social Media Links</label>
                      <select
                        className="form-control mr-2 form-custom"
                        style={{ maxWidth: "fit-content" }}
                        value={selectedSocial}
                        onChange={(e) => setSelectedSocial(e.target.value)}
                      >
                        {socialOptions.map((opt) => (
                          <option key={opt.key} value={opt.key}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <Field
                        type="text"
                        className="form-control mr-2"
                        style={{ maxWidth: 300 }}
                        placeholder={`Enter ${
                          socialOptions.find(
                            (opt) => opt.key === selectedSocial
                          )?.label
                        } link or username`}
                        name={selectedSocial}
                        value={values[selectedSocial]}
                        onChange={(e) =>
                          setFieldValue(selectedSocial, e.target.value)
                        }
                      />
                    </div>
                    <Row className="g-3 social-cards px-2">
                      {socialOptions.map((opt) => (
                        <Col
                          key={opt.key}
                          xs={12}
                          sm={6}
                          md={4}
                          lg={3}
                          className="p-2"
                        >
                          <Card className="position-relative mb-3 shadow-sm border-0 mb-0">
                            <Card.Body className="d-flex align-items-center">
                              <div className="d-flex align-items-top">
                                <span
                                  className="d-flex icon-social-media"
                                  style={{ fontSize: 30, marginRight: 10 }}
                                ></span>
                                <div>
                                  <div className="font-weight-bold ">
                                    {opt.label}
                                  </div>
                                  <div
                                    className="text-muted small"
                                    style={{ wordBreak: "break-word" }}
                                  >
                                    {values[opt.key]}
                                  </div>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting || mutation.isLoading}
                    className="mt-3"
                  >
                    {isSubmitting || mutation.isLoading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlatformTab;
