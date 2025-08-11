import { Formik, Form, Field } from "formik";
import { useMutation, useQuery } from "react-query";
import * as Yup from "yup";
import API from "../../utils/API";
import { showMsgToast } from "../../utils/showMsgToast";
import { handleApiError } from "../../hooks/handleApiErrors";
import { AxiosError } from "axios";
import { useHistory } from "react-router-dom";
import { queryClient } from "../../utils/queryClient";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

const ValidationSchema = Yup.object().shape({
  primary_color: Yup.string().required("Primary color is required"),
  secondary_color: Yup.string().required("Secondary color is required"),
  language: Yup.string().required("Language is required"),
  currency: Yup.string().required("Currency is required"),
});

const key = "configuration";

const updateConfig = async (config) => {
  const formdata = new FormData();
  // Append all config fields except id
  Object.entries(config).forEach(([key, val]) => {
    if (key !== "id") formdata.append(key, String(val));
  });
  return API.post(`configuration/${config.id}`, formdata, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const AppearanceTab = () => {
  const history = useHistory();

  const {
    data: configData,
    isLoading,
    isFetching,
    error,
  } = useQuery<any>([`${key}?per_page=50`, ,], {
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const initialValues = {
    primary_color:
      configData?.data?.find((d) => d.key === "primary_color")?.value ||
      "#000000",
    secondary_color:
      configData?.data?.find((d) => d.key === "secondary_color")?.value ||
      "#ffffff",
    language: configData?.data?.find((d) => d.key === "language")?.value || "",
    currency: configData?.data?.find((d) => d.key === "currency")?.value || "",
  };

  const mutation = useMutation(updateConfig, {
    onSuccess: () => {
      queryClient.invalidateQueries(`${key}?per_page=50`);
      showMsgToast("Appearance updated successfully!");
    },
    onError: handleApiError,
  });

  return (
    <div>
      <div className="tab-header">
        <h4>Appearance</h4>
        <p>Used to manage the organisation’s branding and color scheme.</p>
      </div>
      <div className="right-content">
        <div className="profile-card d-flex flex-column align-items-center">
          {isLoading ? (
            <Spinner className="mt-8" />
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
                    const original = configData?.data.find(
                      (d) => d.key === key
                    )?.value;
                    return value !== original;
                  }
                );

                // Make API calls for each changed config
                await Promise.all(
                  changed.map(([key, value]) => {
                    const config = configData?.data.find((d) => d.key === key);
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
              {({ values, errors, touched, isSubmitting }) => (
                <Form className="w-100 mt-2">
                  <div className="border-div form-group w-100 mt-4 d-flex align-items-center">
                    <Label htmlFor="primary_color">Brand Primary Color</Label>
                    <Field
                      type="color"
                      className="border border-gray-300 w-11 h-11 p-0 rounded-lg cursor-pointer"
                      id="primary_color"
                      name="primary_color"
                    />
                    <span className="ms-3 input-color">
                      {values.primary_color}
                    </span>
                    {errors.primary_color && touched.primary_color && (
                      <div className="text-danger ms-2">
                        {String(errors.primary_color)}
                      </div>
                    )}
                  </div>
                  <div className="border-div form-group w-100 mt-3 d-flex align-items-center">
                    <Label htmlFor="secondary_color">
                      Brand Secondary Color
                    </Label>
                    <Field
                      type="color"
                      className="border border-gray-300 w-11 h-11 p-0 rounded-lg cursor-pointer"
                      id="secondary_color"
                      name="secondary_color"
                    />
                    <span className="ms-3 input-color">
                      {values.secondary_color}
                    </span>
                    {errors.secondary_color && touched.secondary_color && (
                      <div className="text-danger ms-2">
                        {String(errors.secondary_color)}
                      </div>
                    )}
                  </div>
                  <div className="border-div form-group w-100 mt-3 d-flex align-items-center">
                    <Label htmlFor="language">Preferences Language</Label>
                    <Field
                      as="select"
                      className="h-11 border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm transition-colors focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none bg-white"
                      id="language"
                      name="language"
                    >
                      <option value="">Select Language</option>
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="Turkey">Turkey</option>
                    </Field>
                    {errors.language && touched.language && (
                      <div className="text-danger ms-2">
                        {String(errors.language)}
                      </div>
                    )}
                  </div>
                  <div className="border-div form-group w-100 mt-3 d-flex align-items-center">
                    <Label htmlFor="currency">Preferences Currency</Label>
                    <Field
                      as="select"
                      className="h-11 border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm transition-colors focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none bg-white"
                      id="currency"
                      name="currency"
                    >
                      <option value="">Select Currency</option>
                      <option value="IN">IN</option>
                      <option value="US">US</option>
                      <option value="EURO">EURO</option>
                    </Field>
                    {errors.currency && touched.currency && (
                      <div className="text-danger ms-2">
                        {String(errors.currency)}
                      </div>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting || mutation.isLoading}
                    className="mt-3"
                  >
                    {isSubmitting || mutation.isLoading ? (
                      <Spinner size="sm" />
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

export default AppearanceTab;
