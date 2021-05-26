import axios from "axios";
import bsCustomFileInput from "bs-custom-file-input";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import { InputField } from "../../shared-components/InputFeild";
import IsLoading from "../../shared-components/isLoading";
import { ICreateUpdateForm } from "../../types/interface";
import API from "../../utils/API";
import { adminApiBaseUrl } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";

const key = "services";

const createUpdataServices = ({
  formdata,
  id,
}: {
  formdata: any;
  id: string;
}) => {
  if (!id) {
    return API.post(`${key}`, formdata, {
      headers: { "Content-Type": "applicatioin/json" },
    });
  }

  return API.post(`${key}/${id}`, formdata, {
    headers: { "Content-Type": "application/json" },
  });
};

const ServicesCreateUpdateForm = ({ id = "" }: ICreateUpdateForm) => {
  console.log("id", id);
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

  console.log("apiData", apiData);

  if (dataLoading) return <IsLoading />;

  return (
    <Row className="rounded">
      <Col className="mx-auto">
        <Formik
          initialValues={{
            name: apiData ? apiData.name : "",
            url: apiData ? apiData.url : "",
            price: apiData ? apiData.price : "",
            category_id: "",
          }}
          onSubmit={(values) => {
            // console.log("values", values)

            mutate({ formdata: values, id });
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

                {!id && (
                  <InputField
                    name="url"
                    placeholder="Url"
                    label="Url"
                    required
                  />
                )}
                {!id && (
                  <InputField
                    name="price"
                    placeholder="Price"
                    label="Price"
                    type="number"
                  />
                )}
                {!id && (
                  <InputField
                    name="category_id"
                    placeholder="Category"
                    label="Choose Category"
                    as="select"
                    selectData={
                      !isCategoriesLoading && (categories as any).data
                    }
                  />
                )}
                {!id && (
                  <InputField
                    name="details"
                    placeholder="Details"
                    label="Details"
                    as="textarea"
                  />
                )}
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
