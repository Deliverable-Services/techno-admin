import { AxiosError } from "axios";
import bsCustomFileInput from "bs-custom-file-input";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import { handleApiError } from "../../hooks/handleApiErrors";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import BackButton from "../../shared-components/BackButton";
import { InputField } from "../../shared-components/InputFeild";
import IsLoading from "../../shared-components/isLoading";
import API from "../../utils/API";
import { isActiveArray, IssueRelatedTo, IssueStatus } from "../../utils/arrays";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";

const key = "tickets";

const createTicket = ({ formdata }: { formdata: any }) => {
  return API.post(`${key}/create`, formdata, {
    headers: { "Content-Type": "application/json" },
  });
};

const IssuesCreateForm = ({ onHideModal }) => {
  // const { state } = useLocation();
  const history = useHistory();
  useEffect(() => {
    bsCustomFileInput.init();
  }, []);

  const { data: customersList } = useQuery<any>(
    [`users?role=customer&perPage=1000`, ,],
    {
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  const { mutate, isLoading } = useMutation(createTicket, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries(key), 500);
      onHideModal();
      showMsgToast("Issue created successfully");
    },
    onError: (error: AxiosError) => {
      onHideModal();
      handleApiError(error, history);
    },
  });

  const initialValues = {
    title: "",
    description: "",
    status: "",
    order_id: "",
    ref_id: "",
  };

  // if (!state) return <h1>Order Id is required</h1>;

  return (
    <>
      {/* <BackButton
        title={`Create issue for order #${(state as any)?.order_id}`}
      /> */}
      <Row className="rounded">
        <Col className="mx-auto">
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => {
              mutate({ formdata: values });
            }}
          >
            {({ setFieldValue }) => (
              <Form>
                <div className={`form-container  py-2 `}>
                  <InputField
                    name="title"
                    placeholder="Title"
                    label="Title"
                    required
                  />

                  <InputField
                    as="select"
                    selectData={IssueStatus}
                    name="status"
                    label="Status"
                    placeholder="Choose Status"
                  />
                  <InputField
                    name="related_to"
                    label="Related To"
                    placeholder="Related To?"
                    selectData={IssueRelatedTo}
                    as="select"
                  />
                  <InputField
                    name="order_id"
                    label="Order"
                    placeholder="Order Id"
                  />
                  <InputField
                    name="customer"
                    label="Add Customer"
                    placeholder="Select Customer"
                    selectData={customersList?.data}
                    as="select"
                  />
                </div>
                <Row>
                  <Col md={12}>
                    <InputField
                      name="description"
                      label="Description"
                      placeholder="Description"
                      as="textarea"
                    />
                  </Col>
                </Row>
                <Row className="d-flex justify-content-start">
                  <Col md="2">
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

export default IssuesCreateForm;
