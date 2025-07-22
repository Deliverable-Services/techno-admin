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
import { isActiveArray } from "../../utils/arrays";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";

const key = "brands";

const createUpdataBrand = ({
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

  return API.post(`${key}/${id}`, formdata, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const PageCreateUpdateForm = () => {
  const { state } = useLocation();
  const history = useHistory();
  const id = state ? (state as any).id : null;
  const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key });
  const { mutate, isLoading } = useMutation(createUpdataBrand, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries(key), 500);
      if (id) return showMsgToast("Brand updated successfully");
      showMsgToast("Brands created successfully");
      history.replace("/brands");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  useEffect(() => {
    bsCustomFileInput.init();
  }, []);

  const apiData = data as any;

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
              initialValues={apiData || { is_active: "1" }}
              onSubmit={(values) => {
                console.log({ values });
                const { logo, ...rest } = values;
                const formdata = new FormData();
                for (let k in rest) formdata.append(k, rest[k]);

                if (logo) formdata.append("logo", logo);

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

                    {/* <InputField
                      name="organisationId"
                      placeholder="Organisation Id"
                      label="Organisation Id"
                      required
                      readOnly
                    /> */}
                   

                    <InputField
                      name="metaTitle"
                      placeholder="Meta Title"
                      label="Meta Title"
                      // required
                    />
                    <InputField
                      name="metaDescription"
                      placeholder="Meta Description"
                      label="Meta Description"
                      // required
                    />
                    <InputField
                      name="metaKeywords"
                      placeholder="Meta Keywords"
                      label="Meta Keywords"
                      // required
                    />
                     <InputField
                      name="socialFeaturedImage"
                      folder="brands"
                      placeholder="Featured Image"
                      label="Choose Featured Image"
                      isFile
                      setFieldValue={setFieldValue}
                    />

                    <InputField
                      as="select"
                      selectData={isActiveArray}
                      name="isPublished"
                      label="Publish"
                      placeholder="Choose is active"
                    />
                    <InputField
                      as="select"
                      selectData={isActiveArray}
                      name="isArchived"
                      label="Archived"
                      placeholder="Choose is active"
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
      </div>
    </>
  );
};

export default PageCreateUpdateForm;
