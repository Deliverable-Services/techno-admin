import { AxiosError } from "axios";
import bsCustomFileInput from "bs-custom-file-input";
import { Form, Formik } from "formik";
import moment from "moment";
import { useEffect } from "react";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { useMutation } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import { handleApiError } from "../../hooks/handleApiErrors";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import BackButton from "../../shared-components/BackButton";
import DatePicker from "../../shared-components/DatePicker";
import { InputField } from "../../shared-components/InputFeild";
import IsLoading from "../../shared-components/isLoading";
import TextEditor from "../../shared-components/TextEditor";
import API from "../../utils/API";
import { conditionType, isActiveArray } from "../../utils/arrays";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
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
  const history = useHistory();
  const { state } = useLocation();
  const id = state ? (state as any).id : null;
  useEffect(() => {
    bsCustomFileInput.init();
  }, []);
  const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key });
  const { mutate, isLoading, error, status } = useMutation(
    createUpdataCoupons,
    {
      onSuccess: () => {
        setTimeout(() => queryClient.invalidateQueries(key), 500);
        history.replace("/coupons");
        if (id) return showMsgToast("Brand updated successfully");
        showMsgToast("Brands created successfully");
      },
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  const apiData = data && (data as any);

  console.log("apiData", apiData);

  if (dataLoading) return <IsLoading />;

  return (
    <>
      <BackButton title="Coupons" />
      <Row className="rounded">
        <Col className="mx-auto">
          <Formik
            initialValues={
              apiData || {
                valid_to: moment().format("YYYY-MM-DD hh:mm:ss"),
                valid_from: moment().format("YYYY-MM-DD hh:mm:ss"),
              }
            }
            onSubmit={(values) => {
              mutate({ formdata: values, id });
            }}
          >
            {({ setFieldValue }) => (
              <Form>
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
                    label="Valid From"
                    setFieldValue={setFieldValue}
                  />
                  <DatePicker
                    name="valid_to"
                    label="Valid To"
                    setFieldValue={setFieldValue}
                  />
                  <InputField
                    as="select"
                    selectData={isActiveArray}
                    name="is_active"
                    label="Is active?"
                    placeholder="Choose is active"
                  />
                  <InputField
                    as="select"
                    selectData={conditionType}
                    name="condition_type"
                    label="Condition Type"
                    placeholder="Condition Type"
                  />
                </div>
                <TextEditor
                  name="description"
                  label="Description"
                  setFieldValue={setFieldValue}
                />

                <TextEditor
                  name="terms"
                  label="Terms"
                  setFieldValue={setFieldValue}
                />
                <Row className="d-flex justify-content-center">
                  <Col md="6">
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

export default CouponCreateUpdateForm;
