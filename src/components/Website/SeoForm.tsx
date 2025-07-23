import React, { useEffect } from "react";
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

const key = "pages";

const createUpdataBrand = ({
  formdata,
  id,
}: {
  formdata: FormData;
  id: string;
}) => {
  if (id)
    return API.put(`${key}/${id}`, formdata, {
      headers: { "Content-Type": "multipart/form-data" },
    });
};

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

const updatePage = async (data: UpdatePageData, id: string): Promise<void> => {
  try {
    const res = await API.put(`${key}/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });

    if (res) showMsgToast("SEO details updated successfully");
    else {
    }
  } catch (error: any) {
    throw error;
  }
};

const SeoForm = ({ seoDetails }) => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  const { mutate, isLoading } = useMutation(createUpdataBrand, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries(key), 500);
      if (id) return showMsgToast("Brand updated successfully");
      showMsgToast("Page created successfully");
      history.replace("/website");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const initialValues = {
    title: seoDetails?.title || "",
    description: seoDetails?.description || "",
    keywords: seoDetails?.keywords || "",
    og_title: seoDetails?.og_title || "",
    og_description: seoDetails?.og_description || "",
    og_image: seoDetails?.og_image || "",
  };

  console.log(seoDetails, "seoDetails");
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
              const { ...rest } = values;

              const seoKeys = [
                "title",
                "description",
                "keywords",
                "og_title",
                "og_description",
                "og_image",
              ];

              if (id) {
                // Extract and group seo_details
                seoKeys.forEach((key) => {
                  editedData.seo_details = editedData.seo_details || {};
                  editedData.seo_details[key] = values[key];
                });

                updatePage(editedData, id);
              }
              // mutate({ formdata, id });
            }}
          >
            {({ setFieldValue }) => (
              <Form>
                <div className="form-container ">
                  <InputField
                    name="title"
                    placeholder="Meta Title"
                    label="Meta Title"
                    // required
                  />
                  <InputField
                    name="description"
                    placeholder="Meta Description"
                    label="Meta Description"
                    // required
                  />
                  <InputField
                    name="keywords"
                    placeholder="Meta Keywords"
                    label="Meta Keywords"
                    // required
                  />

                  <InputField
                    name="og_image"
                    folder="brands"
                    placeholder="OG Image"
                    label="OG Image"
                    isFile
                    // setFieldValue={setFieldValue}
                    // onChange={(e) => {
                    //   console.log("e.target.files", e.target);
                    //   setFieldValue("og_image", Object.values(e.target.files));
                    // }}
                    // required
                  />
                  <InputField
                    name="og_title"
                    placeholder="OG Title"
                    label="OG Title"
                    // required
                  />
                  <InputField
                    name="og_description"
                    placeholder="OG Description"
                    label="OG Description"
                    // required
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
