import { Formik, Form, Field } from "formik";
import { Button, Spinner } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import * as Yup from "yup";
import { useOrganisation } from "../../context/OrganisationContext";
import API from "../../utils/API";
import { showMsgToast } from "../../utils/showMsgToast";
import { handleApiError } from "../../hooks/handleApiErrors";
import { AxiosError } from "axios";
import { useHistory } from "react-router-dom";

const key = "configuration";

const ValidationSchema = Yup.object().shape({
  "contact-email": Yup.string()
    .email("Invalid email")
    .required("Contact email is required"),
  "contact-phone": Yup.string().required("Contact phone is required"),
  "contact-address": Yup.string().required("Contact address is required"),
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

const WebsiteTab = () => {
  const history = useHistory();
  const { selectedOrg } = useOrganisation();

  const {
    data: configData,
    isLoading,
    error,
  } = useQuery(
    [`${key}-website`, selectedOrg?.id],
    () =>
      API.get(`${key}?per_page=50&type=website&org_id=${selectedOrg?.id}`).then(
        (res) => res.data
      ),
    {
      enabled: !!selectedOrg?.id,
      onError: (error: AxiosError) => handleApiError(error, history),
    }
  );

  const configs = configData?.data || [];
  const initialValues = {
    "contact-email":
      configs.find((d) => d.key === "contact-email")?.value || "",
    "contact-phone":
      configs.find((d) => d.key === "contact-phone")?.value || "",
    "contact-address":
      configs.find((d) => d.key === "contact-address")?.value || "",
  };

  const mutation = useMutation(updateConfig, {
    onSuccess: () => showMsgToast("Website contact details updated!"),
    onError: handleApiError,
  });

  return (
    <>
      <div className="tab-header">
        <h4>Contact Details</h4>
        <p>Update your website contact details here.</p>
      </div>
      <div>
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
                      const original = configs.find(
                        (d) => d.key === key
                      )?.value;
                      return value !== original;
                    }
                  );

                  // Make API calls for each changed config
                  await Promise.all(
                    changed.map(([key, value]) => {
                      const config = configs.find((d) => d.key === key);
                      // Send the whole config object plus the new value
                      return mutation.mutateAsync({
                        ...config,
                        value, // override value with the changed one
                      });
                    })
                  );
                  setSubmitting(false);
                  resetForm({ values });
                }}
              >
                {({ values, errors, touched, isSubmitting, handleChange }) => (
                  <Form className="w-100 mt-2">
                    <div className="border-div form-group w-100 mt-4 d-flex align-items-center">
                      <label htmlFor="contact-email">Contact Email</label>
                      <Field
                        type="email"
                        className="form-control input-div"
                        id="contact-email"
                        name="contact-email"
                        placeholder="Enter contact email"
                      />
                      {errors["contact-email"] && touched["contact-email"] && (
                        <div className="text-danger ms-2">
                          {errors["contact-email"]}
                        </div>
                      )}
                    </div>
                    <div className="border-div form-group w-100 mt-3 d-flex align-items-center">
                      <label htmlFor="contact-phone">Contact Phone</label>
                      <Field
                        type="text"
                        className="form-control input-div"
                        id="contact-phone"
                        name="contact-phone"
                        placeholder="Enter contact phone"
                      />
                      {errors["contact-phone"] && touched["contact-phone"] && (
                        <div className="text-danger ms-2">
                          {errors["contact-phone"]}
                        </div>
                      )}
                    </div>
                    <div className="border-div form-group w-100 mt-3 d-flex align-items-center">
                      <label htmlFor="contact-address">Contact Address</label>
                      <Field
                        type="text"
                        className="form-control input-div"
                        id="contact-address"
                        name="contact-address"
                        placeholder="Enter contact address"
                      />
                      {errors["contact-address"] &&
                        touched["contact-address"] && (
                          <div className="text-danger ms-2">
                            {errors["contact-address"]}
                          </div>
                        )}
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
    </>
  );
};

export default WebsiteTab;
