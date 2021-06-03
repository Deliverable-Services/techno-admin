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
import { ICreateUpdateForm } from "../../types/interface";
import API from "../../utils/API";
import { conditionType, isActiveArray } from "../../utils/arrays";
import { queryClient } from "../../utils/queryClient";
import DatePicker from "../../shared-components/DatePicker";
const key = "coupons";

const createUpdataCoupons = ({
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

const CouponCreateUpdateForm = () => {
  const { state } = useLocation()
  const id = state ? (state as any).id : null
  useEffect(() => {
    bsCustomFileInput.init();
  }, []);
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
      <BackButton title="Coupons" />
      <Col className="mx-auto">
        <Formik
          initialValues={apiData || {}}

          onSubmit={(values) => {
            console.log("values", values)

            mutate({ formdata: values, id });
          }}
        >
          {({ setFieldValue }) => (
            <Form>
              {status === "success" && (
                <Alert variant="success">
                  {id
                    ? "Coupon updated successfully"
                    : "Coupon created successfully"}
                </Alert>
              )}
              {error && (
                <Alert variant="danger">{(error as Error).message}</Alert>
              )}
              <div className="form-container  py-2 ">
                <InputField
                  name="title"
                  placeholder="Title"
                  label="Title"
                  required
                />

                <InputField
                  name="coupon_code"
                  placeholder="Coupon Code"
                  label="Coupon Code"
                  required
                />
                <InputField
                  type="number"
                  name="condition"
                  placeholder="Condition"
                  label="Condition"
                  required
                />
                <DatePicker
                  name="valid_from"
                  setFieldValue={setFieldValue}
                  label="Valid From"
                  inputProps={{ placeholder: "Valid from", required: true }}
                />
                <DatePicker
                  name="valid_to"
                  setFieldValue={setFieldValue}
                  label="Valid To"
                  inputProps={{ placeholder: "Valid to", required: true }}
                />
                <InputField as="select" selectData={isActiveArray} name="is_active" label="Is active?" placeholder="Choose is active" />
                <InputField as="select" selectData={conditionType} name="condition_type" label="Condition Type" placeholder="Condition Type" />
                <InputField
                  name="description"
                  placeholder="Description"
                  label="Descrition"
                  as="textarea"
                  required
                />

                <InputField
                  name="terms"
                  placeholder="Terms"
                  label="Terms"
                  as="textarea"
                  required
                />
              </div>
              <Row className="d-flex justify-content-center">
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

export default CouponCreateUpdateForm;
