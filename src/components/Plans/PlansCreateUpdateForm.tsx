import bsCustomFileInput from "bs-custom-file-input";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import BackButton from "../../shared-components/BackButton";
import { InputField } from "../../shared-components/InputFeild";
import IsLoading from "../../shared-components/isLoading";
import TextEditor from "../../shared-components/TextEditor";
import { ICreateUpdateForm } from "../../types/interface";
import API from "../../utils/API";
import { isActiveArray } from "../../utils/arrays";
import { queryClient } from "../../utils/queryClient";

const key = "plans";

const createUpdataCoupons = ({
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

const PlanCreateUpdateForm = () => {
  const { state } = useLocation()
  const id = state ? (state as any).id : null
  useEffect(() => {
    bsCustomFileInput.init();
  }, []);

  const { data: categories, isLoading: isCategoriesLoading } = useQuery<any>(["categories"]);
  const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key });
  const { mutate, isLoading, error, status } = useMutation(
    createUpdataCoupons,
    {
      onSuccess: () => {
        setTimeout(() => queryClient.invalidateQueries(key), 500);
      },
    }
  );

  const apiData = data && (data as any);

  console.log("apiData", apiData);

  if (dataLoading) return <IsLoading />;

  return (
    <Row className="rounded">
      <BackButton title="Plans" />
      <Col className="mx-auto">
        <Formik
          initialValues={apiData || {}}

          onSubmit={(values) => {
            const formdata = new FormData();
            formdata.append("name", values.name);
            formdata.append("price", values.price);
            formdata.append("is_active", values.is_active);
            formdata.append("is_popular", values.is_popular);
            formdata.append("description", values.description);
            formdata.append("allowed_usage", values.allowed_usage);
            formdata.append("category_id", values.category_id);
            if (values.image)
              formdata.append("image", values.image);

            mutate({ formdata, id });
          }}
        >
          {({ setFieldValue }) => (
            <Form>
              {status === "success" && (
                <Alert variant="success">
                  {id
                    ? "Plan updated successfully"
                    : "Plan created successfully"}
                </Alert>
              )}
              {error && (
                <Alert variant="danger">{(error as Error).message}</Alert>
              )}
              <div className="form-container  py-2 ">
                <InputField
                  name="name"
                  placeholder="Name"
                  label="Name"
                  required
                />

                <InputField
                  type="number"
                  name="price"
                  placeholder="Price"
                  label="Price"
                  required
                />
                <InputField
                  type="number"
                  name="allowed_usage"
                  placeholder="Allowed Usage"
                  label="Allowed Usage"
                  required
                />

                <InputField
                  name="image"
                  placeholder="image"
                  label="Choose Plan Image"
                  isFile
                  setFieldValue={setFieldValue}
                />

                <InputField
                  name="category_id"
                  placeholder="Category"
                  label="Choose Category"
                  as="select"
                  selectData={!isCategoriesLoading && categories.data}
                />

                <InputField as="select" selectData={isActiveArray} name="is_active" label="Is active?" placeholder="Choose is active" />
                <InputField as="select" selectData={isActiveArray} name="is_popular" label="Is Popular?" placeholder="Choose is popular" />
              </div>
              <TextEditor
                name="description"
                label="Description"
                setFieldValue={setFieldValue}
              />
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

export default PlanCreateUpdateForm;
