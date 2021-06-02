import axios from "axios";
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
import { ICreateUpdateForm } from "../../types/interface";
import API from "../../utils/API";
import { isActiveArray } from "../../utils/arrays";
import { adminApiBaseUrl } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";

const key = "services";

const createUpdataServices = ({
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

const ServicesCreateUpdateForm = () => {
  const { state } = useLocation()
  const id = state ? (state as any).id : null
  useEffect(() => {
    bsCustomFileInput.init();
  }, []);
  const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key });
  const { data: categories, isLoading: isCategoriesLoading } =
    useQuery("categories");
  const { mutate, isLoading, error, status } = useMutation(
    createUpdataServices,
    {
      onSuccess: () => {
        setTimeout(() => queryClient.invalidateQueries(key), 500);
      },
    }
  );

  const apiData = data && (data as any);


  if (dataLoading) return <IsLoading />;

  return (

    <Row className="rounded">
      <BackButton title="Services" />
      <Col className="mx-auto">
        <Formik
          initialValues={apiData || {}}
          onSubmit={(values) => {
            // console.log("values", values)
            const formdata = new FormData()
            formdata.append("name", values.name);
            formdata.append("url", values.url);
            formdata.append("details", values.details);
            formdata.append("order", values.order);
            formdata.append("is_active", values.is_active);
            formdata.append("category_id", values.category_id);
            formdata.append("price", values.price);
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
                    ? "Service updated successfully"
                    : "Service created successfully"}
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
                  name="url"
                  placeholder="Url"
                  label="Url"
                  required
                />
                <InputField
                  name="price"
                  placeholder="Price"
                  label="Price"
                  type="number"
                />
                <InputField
                  name="category_id"
                  placeholder="Category"
                  label="Choose Category"
                  as="select"
                  selectData={
                    !isCategoriesLoading && (categories as any).data
                  }
                />
                <InputField as="select" selectData={isActiveArray} name="is_active" label="Is active?" placeholder="Choose is active" />
                <InputField
                  name="image"
                  placeholder="image"
                  label="Choose Service Image"
                  isFile
                  setFieldValue={setFieldValue}
                />
                <InputField
                  name="details"
                  placeholder="Details"
                  label="Details"
                  as="textarea"
                />
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

export default ServicesCreateUpdateForm;
