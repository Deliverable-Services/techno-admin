import bsCustomFileInput from "bs-custom-file-input";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { useMutation } from "react-query";
import { useLocation } from "react-router-dom";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import BackButton from "../../shared-components/BackButton";
import { InputField } from "../../shared-components/InputFeild";
import IsLoading from "../../shared-components/isLoading";
import API from "../../utils/API";
import { isActiveArray } from "../../utils/arrays";
import { queryClient } from "../../utils/queryClient";

const key = "categories";

const createUpdataCategories = ({
  formdata,
  id,
}: {
  formdata: FormData;
  id: string;
}) => {
  if (!id) {
    return API.post(`${key}`, formdata, {
      headers: { "Content-Type": "application/json" },
    });
  }

  return API.post(`${key}/${id}`, formdata, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const CategoriesCreateUpdateForm = () => {
  const { state } = useLocation()
  const id = state ? (state as any).id : null
  useEffect(() => {
    bsCustomFileInput.init();
  }, []);
  const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key });
  const { mutate, isLoading, error, status } = useMutation(
    createUpdataCategories,
    {
      onSuccess: () => {
        setTimeout(() => queryClient.invalidateQueries(key), 500);
      },
    }
  );

  const apiData = data && (data as any);


  if (dataLoading) return <IsLoading />;

  return (
    <>
      <BackButton title="Categories" />
      <Row className="rounded">
        <Col className="mx-auto">
          <Formik
            initialValues={apiData || {}}
            onSubmit={(values) => {
              const formdata = new FormData()
              formdata.append("name", values.name);
              formdata.append("url", values.url);
              formdata.append("order", values.order);
              formdata.append("is_active", values.is_active);
              if (values.logo)
                formdata.append("logo", values.logo);

              mutate({ formdata, id });
            }}
          >
            {({ setFieldValue }) => (
              <Form className="w-100">
                {status === "success" && (
                  <Alert variant="success">
                    {id
                      ? "Category updated successfully"
                      : "Category created successfully"}
                  </Alert>
                )}
                {error && (
                  <Alert variant="danger">{(error as Error).message}</Alert>
                )}

                <div className="form-container py-2">
                  <InputField
                    name="name"
                    placeholder="Name"
                    label="Name"
                    required
                  />
                  <InputField
                    name="url"
                    placeholder="Url"
                    label="Url"
                    required
                  />
                  <InputField
                    name="order"
                    placeholder="order"
                    label="order"
                    required
                  />

                  <InputField as="select" selectData={isActiveArray} name="is_active" label="Is active?" placeholder="Choose is active" />
                  {/* <InputField
                    name="logo"
                    placeholder="logo"
                    label="Choose Category Logo"
                    isFile
                    setFieldValue={setFieldValue}
                  /> */}
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
    </>
  );
};

export default CategoriesCreateUpdateForm;
