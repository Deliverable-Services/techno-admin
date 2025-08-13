import { AxiosError } from "axios";
// Removed bs-custom-file-input
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { Button, Col, Row, Spinner } from "../ui/bootstrap-compat";
import { useMutation, useQuery } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import { handleApiError } from "../../hooks/handleApiErrors";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import { InputField } from "../../shared-components/InputFeild";
import IsLoading from "../../shared-components/isLoading";
import API from "../../utils/API";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import Restricted from "../../shared-components/Restricted";
import { Label } from "../ui/label";
import EditorJsEditor, {
  editorInitialValues,
} from "../../shared-components/WYSIWIG/Editor";

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
  useEffect(() => {}, []);
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
      if (id) return showMsgToast("Testimonial updated successfully");
      showMsgToast("Testimonial created successfully");
      history.replace("/testimonials");
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
        {/* <BackButton title={title} /> */}
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
              initialValues={
                apiData
                  ? {
                      ...apiData,
                      description: editorInitialValues(apiData.description),
                    }
                  : {
                      description: {
                        blocks: [{ type: "paragraph", data: { text: "" } }],
                      },
                    }
              }
              onSubmit={(values) => {
                const { picture, user_id, description, ...rest } = values;
                const formdata = new FormData();
                for (let k in rest) formdata.append(k, rest[k]);

                if (picture) formdata.append("picture", picture);
                if (description)
                  formdata.append(
                    "description",
                    JSON.stringify(description || {})
                  );

                mutate({ formdata, id });
              }}
            >
              {({ setFieldValue, values }) => (
                <Form>
                  <div className="form-container ">
                    <InputField name="name" placeholder="Name" label="Name" />

                    <InputField name="link" placeholder="Link" label="Link" />
                    <InputField
                      name="picture"
                      placeholder="picture"
                      label="Picture"
                      isFile
                      folder="testimonials"
                      setFieldValue={setFieldValue}
                    />
                  </div>

                  <Label htmlFor="testimonialEditor">Description</Label>
                  <EditorJsEditor
                    holderId="testimonialEditor"
                    data={values.description}
                    onChange={(data) => setFieldValue("description", data)}
                  />

                  <Row className="d-flex justify-content-start">
                    <Col md="12">
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
