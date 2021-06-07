import bsCustomFileInput from "bs-custom-file-input";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import {
  Alert,
  Button,
  Col,
  Row,
  Spinner
} from "react-bootstrap";
import { useMutation } from "react-query";
import { useLocation } from "react-router-dom";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import BackButton from "../../shared-components/BackButton";
import { InputField } from "../../shared-components/InputFeild";
import IsLoading from "../../shared-components/isLoading";
import TextEditor from "../../shared-components/TextEditor";
import API from "../../utils/API";
import { isActiveArray } from "../../utils/arrays";
import { queryClient } from "../../utils/queryClient";

const key = "faqs";

const createUpdataFaq = ({
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

const FaqCreateUpdateForm = () => {
  const { state } = useLocation()
  const id = state ? (state as any).id : null
  useEffect(() => {
    bsCustomFileInput.init();
  }, []);
  const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key });
  const { mutate, isLoading, error, status } = useMutation(createUpdataFaq, {
    onSuccess: (data) => {
      console.log("mutate", data);
      setTimeout(() => {
        queryClient.invalidateQueries(key)
        queryClient.invalidateQueries(`${key}/${id}`)
      }, 500);
    },
  });

  const apiData = data as any;

  if (dataLoading) return <IsLoading />;

  return (
    <Row className="rounded">
      <BackButton title="Faqs" />
      <Col className="mx-auto">
        <Formik
          initialValues={apiData || {}}
          onSubmit={(values) => {
            const formdata = new FormData();
            formdata.append("title", values.title);
            formdata.append("description", values.description);
            formdata.append("is_active", values.is_active);

            mutate({ formdata, id });
          }}
        >
          {({ setFieldValue }) => (
            <Form>
              {status === "success" && (
                <Alert variant="success">
                  {id ? "Faq updated successfully" : "Faq created successfully"}
                </Alert>
              )}
              {error && (
                <Alert variant="danger">{(error as Error).message}</Alert>
              )}
              <div className="form-container ">
                <InputField
                  name="title"
                  placeholder="title"
                  label="Title"
                  required
                />

                <InputField
                  name="is_active"
                  placeholder="Is Active?"
                  label="Is Active?"
                  as="select"
                  selectData={isActiveArray}
                />
              </div>
              <TextEditor
                name="description"
                label="Description"
                setFieldValue={setFieldValue}
              />
              {/* <InputField name="is_active" placeholder="isActive" label="Is Active?" /> */}

              <Row className="d-flex justify-content-start">
                <Col md="2">
                  <Button type="submit" disabled={isLoading} className="w-100">
                    {isLoading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

export default FaqCreateUpdateForm;
