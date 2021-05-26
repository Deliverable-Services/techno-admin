import axios from "axios";
import bsCustomFileInput from "bs-custom-file-input";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import {
  Alert,
  Button,
  Col,
  Row,
  Spinner,
  Form as BForm,
} from "react-bootstrap";
import { useMutation } from "react-query";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import { InputField } from "../../shared-components/InputFeild";
import IsLoading from "../../shared-components/isLoading";
import { ICreateUpdateForm } from "../../types/interface";
import API from "../../utils/API";
import { adminApiBaseUrl } from "../../utils/constants";
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

const BrandsCreateUpdateForm = ({ id = "" }: ICreateUpdateForm) => {
  useEffect(() => {
    bsCustomFileInput.init();
  }, []);
  const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key });
  const { mutate, isLoading, error, status } = useMutation(createUpdataFaq, {
    onSuccess: (data) => {
      console.log("mutate", data);
      setTimeout(() => queryClient.invalidateQueries(key), 500);
    },
  });

  const apiData = data as any;

  if (dataLoading) return <IsLoading />;

  return (
    <Row className="rounded">
      <Col className="mx-auto">
        <Formik
          initialValues={{
            title: data ? apiData.title : "",
            description: data ? apiData.description : "",
            is_active: data ? apiData.is_active : "",
          }}
          onSubmit={(values) => {
            const formdata = new FormData();
            formdata.append("title", values.title);
            formdata.append("description", values.description);
            if (!id) formdata.append("is_active", values.is_active);

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

                {!id && (
                  <InputField
                    name="is_active"
                    placeholder="Is Active?"
                    label="Choose is Faq active?"
                    as="select"
                    selectData={[
                      { id: 1, name: "Yes" },
                      { id: 0, name: "NO" },
                    ]}
                  />
                )}

                <InputField
                  name="description"
                  placeholder="Description"
                  label="Description"
                  required
                  as="textarea"
                />
                {/* <InputField name="is_active" placeholder="isActive" label="Is Active?" /> */}
              </div>

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

export default BrandsCreateUpdateForm;
