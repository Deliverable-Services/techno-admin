import bsCustomFileInput from "bs-custom-file-input";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { useMutation } from "react-query";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import { InputField } from "../../shared-components/InputFeild";
import IsLoading from "../../shared-components/isLoading";
import { ICreateUpdateForm } from "../../types/interface";
import API from "../../utils/API";
import { queryClient } from "../../utils/queryClient";

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

const CouponCreateUpdateForm = ({ id = "" }: ICreateUpdateForm) => {
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
      <Col className="mx-auto">
        <Formik
          initialValues={{
            title: apiData ? apiData.title : "",
            coupon_code: apiData ? apiData.coupon_code : "",
            description: apiData ? apiData.description : "",
            terms: apiData ? apiData.terms : "",
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

                {!id && (
                  <InputField
                    name="coupon_code"
                    placeholder="Coupon Code"
                    label="Coupon Code"
                    required
                  />
                )}
                {!id && (
                  <InputField
                    name="description"
                    placeholder="Description"
                    label="Descrition"
                    as="textarea"
                    required
                  />
                )}

                {!id && (
                  <InputField
                    name="terms"
                    placeholder="Terms"
                    label="Terms"
                    as="textarea"
                    required
                  />
                )}
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
