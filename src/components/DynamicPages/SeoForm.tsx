import { Formik, Form } from "formik";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import PageHeading from "../../shared-components/PageHeading";
import { InputField } from "../../shared-components/InputFeild";
import Restricted from "../../shared-components/Restricted";
import { useMutation } from "react-query";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import { useHistory, useParams } from "react-router-dom";
import { handleApiError } from "../../hooks/handleApiErrors";
import { AxiosError } from "axios";
import API from "../../utils/API";
import { useState } from "react";

const key = "pages";

interface SeoDetails {
  title?: string;
  description?: string;
  keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
}

interface UpdatePageData {
  seo_details?: SeoDetails;
  [key: string]: any;
}

const createUpdataSEO = ({
  editedData,
  id,
}: {
  editedData: UpdatePageData;
  id: string;
}) => {
  if (id)
    return API.put(`${key}/${id}`, editedData, {
      headers: { "Content-Type": "application/json" },
    });
};

const SeoForm = ({ seoDetails }) => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [uploadedOgImage, setUploadedOgImage] = useState<string>("");

  const { mutate, isLoading } = useMutation(createUpdataSEO, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries(key), 500);
      if (id) return showMsgToast("SEO details updated successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const handleUploadImage = async (e) => {
    const file = e.currentTarget.files?.[0];
    if (!file || !id) return;

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await API.post(`upload-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        const imageUrl = response.data?.data?.full_url;
        setUploadedOgImage(imageUrl); // ✅ store locally
        showMsgToast("Image uploaded successfully");
      }
    } catch (err) {
      console.error("Image upload failed", err);
      showMsgToast("Failed to upload image");
    }
  };

  const initialValues = {
    title: seoDetails?.title || "",
    description: seoDetails?.description || "",
    keywords: seoDetails?.keywords || "",
    og_title: seoDetails?.og_title || "",
    og_description: seoDetails?.og_description || "",
    og_image: seoDetails?.og_image || "",
  };

  return (
    <Container fluid className="card component-wrapper view-padding mb-3 mt-3">
      <PageHeading title="SEO Details" />
      <hr className="mb-3" />

      <Row className="rounded">
        <Col className="mx-auto">
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => {
              const editedData: any = {};
              const seoKeys = [
                "title",
                "description",
                "keywords",
                "og_title",
                "og_description",
                "og_image",
              ];

              if (uploadedOgImage) {
                values.og_image = uploadedOgImage;
              }

              if (id) {
                let seo_details = {};
                seoKeys.forEach((key) => {
                  seo_details[key] = values[key];
                });
                editedData["seo_details"] = seo_details;
                mutate({ editedData, id });
              }
            }}
          >
            {({ setFieldValue }) => (
              <Form>
                <div className="form-container ">
                  <InputField
                    name="title"
                    placeholder="Meta Title"
                    label="Meta Title"
                  />
                  <InputField
                    name="description"
                    placeholder="Meta Description"
                    label="Meta Description"
                  />
                  <InputField
                    name="keywords"
                    placeholder="Meta Keywords"
                    label="Meta Keywords"
                  />

                  <div className="d-flex flex-column gap-3">
                    <div>
                      <label htmlFor="">OG Image</label>
                      <input
                        name="og_image"
                        accept="image/*"
                        placeholder="OG Image"
                        className="form-control input-div"
                        type="file"
                        onChange={(e) => handleUploadImage(e)}
                      />
                    </div>

                    {initialValues.og_image && (
                      <img
                        src={uploadedOgImage || initialValues.og_image}
                        alt="og-image"
                        className="rounded w-25"
                      />
                    )}
                  </div>

                  <InputField
                    name="og_title"
                    placeholder="OG Title"
                    label="OG Title"
                  />
                  <InputField
                    name="og_description"
                    placeholder="OG Description"
                    label="OG Description"
                  />
                </div>

                <Row className="d-flex justify-content-start">
                  <Col md="2">
                    <Restricted to={id ? "update_brand" : "create_brand"}>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-100"
                      >
                        {isLoading ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          "Submit"
                        )}
                      </Button>
                    </Restricted>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

export default SeoForm;
