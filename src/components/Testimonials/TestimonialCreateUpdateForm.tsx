import { AxiosError } from "axios";
import bsCustomFileInput from "bs-custom-file-input";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import { handleApiError } from "../../hooks/handleApiErrors";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import BackButton from "../../shared-components/BackButton";
import { InputField } from "../../shared-components/InputFeild";
import IsLoading from "../../shared-components/isLoading";
import TextEditor from "../../shared-components/TextEditor";
import API from "../../utils/API";
import { isActiveArray } from "../../utils/arrays";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import SelectSearch, { SelectSearchOption } from "react-select-search";
import Users from "../Users";
import Restricted from "../../shared-components/Restricted";

const key = "testimonial";

const createUpdataTestimonial = ({
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

const TestimonialCreateUpdateForm = () => {
  const { state } = useLocation();
  const history = useHistory();
  const id = state ? (state as any).id : null;
  useEffect(() => {
    bsCustomFileInput.init();
  }, []);
  const {
    data: Users,
    error,
    isLoading: isUsersLoading,
    isFetching,
  } = useQuery<any>(["users", , {}]);
  const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key });
  const { mutate, isLoading } = useMutation(createUpdataTestimonial, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries(key), 500);
      if (id)
        setTimeout(() => queryClient.invalidateQueries(`${key}/${id}`), 500);
      history.replace("/testimonials");
      if (id) return showMsgToast("Testimonial updated successfully");
      showMsgToast("Testimonial created successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const title = id ? "Update Testimonial" : "Add Testimonial";

  const apiData = data as any;

  if (dataLoading) return <IsLoading />;

  return (
    <>
      <div className="card view-padding p-2 d-flex mt-3">
        <BackButton title={title} />
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
              initialValues={apiData || {}}
              onSubmit={(values) => {
                const { picture, ...rest } = values;
                const formdata = new FormData();
                for (let k in rest) formdata.append(k, rest[k]);

                if (picture && typeof picture !== "string")
                  formdata.append("picture", picture);

                console.log({ formdata });
                mutate({ formdata, id });
              }}
            >
              {({ setFieldValue }) => (
                <Form>
                  <div className="form-container ">
                    <InputField name="name" placeholder="Name" label="Name" />

                    <InputField
                      name="picture"
                      placeholder="picture"
                      label="Picture"
                      isFile
                      setFieldValue={setFieldValue}
                    />
                    <InputField name="link" placeholder="Link" label="Link" />
                    <InputField
                      name="user_id"
                      placeholder="User"
                      label="Choose User"
                      as="select"
                      selectData={!isUsersLoading && Users.data}
                      altTitleKey="id"
                    />
                  </div>
                  <Row>
                    <Col md={12} xl={12}>
                      <TextEditor
                        name="description"
                        label="Description"
                        setFieldValue={setFieldValue}
                      />
                    </Col>
                  </Row>

                  <Row className="d-flex justify-content-start">
                    <Col md="2">
                      <Restricted
                        to={id ? "update_testimonial" : "create_testimonial"}
                      >
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

export default TestimonialCreateUpdateForm;
