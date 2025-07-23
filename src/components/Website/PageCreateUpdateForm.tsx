import { AxiosError } from "axios";
import bsCustomFileInput from "bs-custom-file-input";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { useMutation } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import { handleApiError } from "../../hooks/handleApiErrors";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import useUserProfileStore from "../../hooks/useUserProfileStore";
import BackButton from "../../shared-components/BackButton";
import { InputField } from "../../shared-components/InputFeild";
import IsLoading from "../../shared-components/isLoading";
import Restricted from "../../shared-components/Restricted";
import API from "../../utils/API";
import { isPublishedArray } from "../../utils/arrays";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";

const key = "pages";

const createUpdataPage = ({
  formdata,
  id,
}: {
  formdata: FormData;
  id: string;
}) => {
  if (!id) {
    return API.post(`${key}`, formdata, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  return API.put(`${key}/${id}`, formdata, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const updatePage = async (data, id) => {
  await API.put(`${key}/${id}`, data, {
    headers: { "Content-Type": "application/json" },
  });
};

const PageCreateUpdateForm = () => {
  const { state } = useLocation();
  const history = useHistory();
  const loggedInUser = useUserProfileStore((state) => state.user);
  const id = state ? (state as any).id : null;
  const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key });
  const { mutate, isLoading } = useMutation(createUpdataPage, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries(key), 500);
      if (id) return showMsgToast("Page updated successfully");
      showMsgToast("Page created successfully");
      history.replace("/website");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  useEffect(() => {
    bsCustomFileInput.init();
  }, []);

  const apiData = data?.data as any;

  const initialValues = {
    name: apiData?.name || "",
    slug: apiData?.slug || "",
    organisation_id: loggedInUser?.organisation?.id || "",
    title: apiData?.seo_details?.title || "",
    description: apiData?.seo_details?.description || "",
    keywords: apiData?.seo_details?.keywords || "",
    og_title: apiData?.seo_details?.og_title || "",
    og_description: apiData?.seo_details?.og_description || "",
    og_image: apiData?.seo_details?.og_image || "",
    is_published: apiData?.is_published ?? "",
  };

  if (dataLoading) return <IsLoading />;

  return (
    <>
      <div className="card view-padding p-2 d-flex mt-3">
        <BackButton title={id ? "Update Page" : "Add Page"} />

        {/* <div className="text-primary">
          <div className="d-flex justify-content-between">
            <div
              className="text-black pb-3"
              style={{ cursor: "pointer", fontWeight: 600 }}
            >
              Basic Information
            </div>
          </div>
        </div>

        <hr className="mb-3" /> */}

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

                const formdata = new FormData();

                if (id) {
                  // Extract and group seo_details
                  seoKeys.forEach((key) => {
                    editedData.seo_details = editedData.seo_details || {};
                    editedData.seo_details[key] = values[key];
                  });

                  // Other top-level fields
                  Object.keys(values).forEach((key) => {
                    if (
                      !seoKeys.includes(key) &&
                      values[key] !== initialValues[key]
                    ) {
                      editedData[key] = values[key];
                    }
                  });

                  updatePage(editedData, id);
                } else {
                  Object.entries(rest).forEach(([key, value]) => {
                    if (
                      value !== undefined &&
                      value !== null &&
                      value !== "" &&
                      !(
                        typeof value === "object" &&
                        Object.keys(value).length === 0
                      )
                    ) {
                      formdata.append(key, value);
                    }
                  });

                  seoKeys.forEach((key) => {
                    formdata.append(`seo_details[${key}]`, rest[key]);
                  });
                }
                mutate({ formdata, id });
              }}
            >
              {({ setFieldValue }) => (
                <Form>
                  <div className="form-container ">
                    <InputField
                      name="name"
                      placeholder="Name"
                      label="Name"
                      required
                    />

                    <InputField
                      name="slug"
                      placeholder="Slug"
                      label="Slug"
                      required
                    />

                    <InputField
                      name="organisation_id"
                      placeholder="Organisation Id"
                      label="Organisation Id"
                      value={loggedInUser?.organisation?.id}
                      required
                      readOnly
                    />

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

                    {/* <InputField
                      name="socialFeaturedImage"
                      folder="brands"
                      placeholder="Featured Image"
                      label="Choose Featured Image"
                      isFile
                      setFieldValue={setFieldValue}
                    /> */}

                    <InputField
                      as="select"
                      selectData={isPublishedArray}
                      name="is_published"
                      label="Publish"
                      placeholder="Choose is active"
                    />
                    {/* <InputField
                      as="select"
                      selectData={isActiveArray}
                      name="isArchived"
                      label="Archived"
                      placeholder="Choose is active"
                    /> */}
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
      </div>
    </>
  );
};

export default PageCreateUpdateForm;
