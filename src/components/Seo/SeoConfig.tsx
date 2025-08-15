import { Formik, Form, Field } from "formik";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { AxiosError } from "axios";
import API from "../../utils/API";
import { showMsgToast } from "../../utils/showMsgToast";
import { handleApiError } from "../../hooks/handleApiErrors";
import { useOrganisation } from "../../context/OrganisationContext";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import PageHeading from "../../shared-components/PageHeading";
import { ToolCase } from "lucide-react";

const key = "configuration";

// Update existing config
const updateConfig = async (config) => {
  const formdata = new FormData();
  Object.entries(config).forEach(([k, v]) => {
    if (k !== "id") formdata.append(k, String(v));
  });
  return API.post(`configuration/${config.id}`, formdata, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Create new config
const createConfig = async (config) => {
  const formdata = new FormData();
  Object.entries(config).forEach(([k, v]) => {
    formdata.append(k, String(v));
  });
  return API.post(`configuration`, formdata, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Define all SEO keys
const seoKeys = [
  "seo_meta_title",
  "seo_meta_description",
  "seo_meta_keywords",
  "seo_og_title",
  "seo_og_description",
  "seo_og_image",
  "seo_og_url",
  //   "seo_twitter_title",
  //   "seo_twitter_description",
  //   "seo_twitter_image",
  "seo_canonical_url",
  "seo_site_language",
  "seo_favicon",
  "seo_schema_json",
  "script_before_head",
  "script_after_head",
  "script_before_body",
  "script_after_body",
];

const metaImages = ["seo_og_image", "seo_favicon"];
const typeTextarea = [
  "seo_meta_description",
  "seo_og_description",
  "seo_schema_json",
  "script_before_head",
  "script_after_head",
  "script_before_body",
  "script_after_body",
];

const SeoConfig = () => {
  const history = useHistory();
  const { selectedOrg } = useOrganisation();

  const { data: configData, isLoading } = useQuery(
    [`${key}-website`, selectedOrg?.id],
    () =>
      API.get(`${key}?perPage=100&type=website&org_id=${selectedOrg?.id}`).then(
        (res) => res.data
      ),
    {
      enabled: !!selectedOrg?.id,
      onError: (error: AxiosError) => handleApiError(error, history),
    }
  );

  const configs = configData?.data || [];

  // Prefill initial values with existing config or blank
  const initialValues = seoKeys.reduce((acc, seoKey) => {
    acc[seoKey] = configs.find((d) => d.key === seoKey)?.value || "";
    return acc;
  }, {});

  const mutation = useMutation(
    async (changes) => {
      return Promise.all(
        changes.map(async ({ keyName, value }) => {
          const existing = configs.find((c) => c.key === keyName);
          if (existing) {
            return updateConfig({ ...existing, value });
          } else {
            return createConfig({
              key: keyName,
              value,
              type: "website",
              org_id: selectedOrg.id,
            });
          }
        })
      );
    },
    {
      onSuccess: () => showMsgToast("SEO settings updated!"),
      onError: handleApiError,
    }
  );

  const handleUploadImage = async (keyName, e) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await API.post(`upload-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        const imageUrl = response.data?.data?.full_url;

        const existing = configs.find((c) => c.key === keyName);
        if (existing) {
          updateConfig({ ...existing, value: imageUrl });
        } else {
          createConfig({
            key: keyName,
            value: imageUrl,
            type: "website",
            org_id: selectedOrg.id,
          });
        }
        showMsgToast("SEO settings updated!");
      }
    } catch (err) {
      console.error("Image upload failed", err);
      showMsgToast("Failed to upload image");
    }
  };

  return (
    <>
      <div className="p-4">
        <PageHeading
          icon={<ToolCase size={24} />}
          title="Configure SEO"
          description="Manage your site's SEO"
        />
      </div>
      <hr className="border-gray-200" />

      <div className="p-4">
        <div className="right-content">
          {isLoading ? (
            <Spinner className="mt-8" />
          ) : (
            <Formik
              enableReinitialize
              initialValues={initialValues}
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);

                // Find only changed fields
                const changed = Object.entries(values)
                  .filter(([keyName, value]) => {
                    const original =
                      configs.find((d) => d.key === keyName)?.value || "";
                    return value !== original;
                  })
                  .map(([keyName, value]) => ({ keyName, value }));

                if (changed.length > 0) {
                  await mutation.mutateAsync(changed);
                }

                setSubmitting(false);
              }}
            >
              {({ isSubmitting }) => (
                <Form className="w-100 mt-2">
                  {seoKeys.map((seoKey) => (
                    <div
                      key={seoKey}
                      className="border-div form-group w-100 mt-3 align-items-center"
                    >
                      <Label htmlFor={seoKey} className="capitalize">
                        {seoKey.replace(/^seo_/, "").replace(/_/g, " ")}
                      </Label>

                      {metaImages?.includes(seoKey) ? (
                        <div>
                          <input
                            id={seoKey}
                            name={seoKey}
                            accept="image/*"
                            placeholder={`Enter ${seoKey
                              .replace(/^seo_/, "")
                              .replace(/_/g, " ")}`}
                            className="form-control input-div"
                            type="file"
                            onChange={(e) => handleUploadImage(seoKey, e)}
                          />

                          {initialValues[seoKey] && (
                            <img
                              src={initialValues[seoKey]}
                              alt="og-image"
                              className="rounded w-[120px] mt-1"
                            />
                          )}
                        </div>
                      ) : (
                        <Field
                          type="text"
                          as={
                            typeTextarea?.includes(seoKey)
                              ? "textarea"
                              : "input"
                          }
                          className="form-control input-div"
                          id={seoKey}
                          name={seoKey}
                          placeholder={`Enter ${seoKey
                            .replace(/^seo_/, "")
                            .replace(/_/g, " ")}`}
                        />
                      )}
                    </div>
                  ))}

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
    </>
  );
};

export default SeoConfig;
