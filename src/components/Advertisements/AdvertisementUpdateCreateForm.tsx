import axios from "axios";
import bsCustomFileInput from "bs-custom-file-input";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { Alert, Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import { InputField } from "../../shared-components/InputFeild";
import IsLoading from "../../shared-components/isLoading";
import { ICreateUpdateForm } from "../../types/interface";
import API from "../../utils/API";
import { adminApiBaseUrl } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { types } from "./AdvertisementTypes";
import DateTime from "react-datetime";
import DatePicker from "../../shared-components/DatePicker";
import { useLocation } from "react-router-dom";
import BackButton from "../../shared-components/BackButton";
import { stableValueHash } from "react-query/types/core/utils";
import { isActiveArray } from "../../utils/arrays";

const key = "banners";

const createUpdataAdvertisement = ({
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

const AdvertisementCreateUpdateForm = () => {
  const { state } = useLocation()
  const id = state ? (state as any).id : null
  useEffect(() => {
    bsCustomFileInput.init();
  }, []);

  const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key });
  const { mutate, isLoading, error, status } = useMutation(
    createUpdataAdvertisement,
    {
      onSuccess: () => {
        setTimeout(() => {
          queryClient.invalidateQueries("banners/list");
          if (id) queryClient.invalidateQueries(`${key}/${id}`);
        }, 500);
      },
    }
  );

  const apiData = data && (data as any);

  if (dataLoading) return <IsLoading />;

  return (
    <Row className="rounded">
      <BackButton title="Advertisements" />
      <Col className="mx-auto">
        <Formik
          initialValues={apiData || {}}
          onSubmit={(values) => {
            const { image, ...rest } = values;
            console.log({ values })
            const formdata = new FormData();
            for (let k in rest) formdata.append(k, rest[k])
            if (image)
              formdata.append("image", values.image);

            mutate({ formdata, id });
          }}
        >
          {({ setFieldValue }) => (
            <Form>
              {status === "success" && (
                <Alert variant="success">
                  {id
                    ? "Advertisement  updated successfully"
                    : "Advertisement created successfully"}
                </Alert>
              )}
              {error && (
                <Alert variant="danger">{(error as Error).message}</Alert>
              )}
              <div className={`form-container  py-2 `}>
                <InputField
                  name="name"
                  placeholder="Name"
                  label="Name"
                  required
                />
                <InputField
                  name="title"
                  placeholder="Title"
                  label="Title"
                  required
                />

                <InputField
                  name="deeplink"
                  placeholder="Deep Link"
                  label="Deep Link"
                  required
                />
                <InputField
                  type="number"
                  name="order"
                  placeholder="Order"
                  label="Order"
                  required
                />


                <DatePicker
                  name="valid_from"
                  label="Valid From"
                  setFieldValue={setFieldValue}
                />
                <DatePicker
                  name="valid_to"
                  label="Valid To"
                  setFieldValue={setFieldValue}
                />
                <InputField
                  name="image"
                  placeholder="image"
                  label="Image"
                  isFile
                  setFieldValue={setFieldValue}
                />
                <InputField as="select" selectData={isActiveArray} name="is_active" label="Is active?" placeholder="Choose is active" />
                <InputField
                  name="type"
                  placeholder="Advertisement type"
                  label="Choose Type"
                  as="select"
                  selectData={types}
                />

                <InputField
                  as="textarea"
                  name="description"
                  placeholder="Description"
                  label="Description"
                  required
                />
                <InputField
                  as="textarea"
                  name="terms"
                  placeholder="Terms"
                  label="Terms"
                  required
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

export default AdvertisementCreateUpdateForm;
