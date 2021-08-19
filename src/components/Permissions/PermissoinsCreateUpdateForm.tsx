import { AxiosError } from "axios";
import bsCustomFileInput from "bs-custom-file-input";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { useMutation } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import { handleApiError } from "../../hooks/handleApiErrors";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import BackButton from "../../shared-components/BackButton";
import { InputField } from "../../shared-components/InputFeild";
import IsLoading from "../../shared-components/isLoading";
import API from "../../utils/API";
import { isActiveArray } from "../../utils/arrays";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";

const key = "create-permission";

const createUpdataBrand = ({
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
    headers: { "Content-Type": "application/json" },
  });
};

const PermissionsCreateUpdateForm = () => {
  const { state } = useLocation();
  const history = useHistory();
  const id = state ? (state as any).id : null;
  useEffect(() => {
    bsCustomFileInput.init();
  }, []);
  const { data, isLoading: dataLoading } = useGetSingleQuery({
    id,
    key: "get-permission",
  });
  const { mutate, isLoading } = useMutation(createUpdataBrand, {
    onSuccess: () => {
      setTimeout(
        () => queryClient.invalidateQueries("get-all-permission"),
        500
      );
      history.replace("/permissions");
      if (id) return showMsgToast("Permission updated successfully");
      showMsgToast("Permission created successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const apiData = data as any;

  if (dataLoading) return <IsLoading />;

  return (
    <>
      <div className="card view-padding p-2 d-flex mt-3">
        <BackButton title={id ? "Update Permission" : "Add Permission"} />
        {/* <div className="text-primary">
          <div className="d-flex justify-content-between">
            <div
              className="text-black pb-3"
              style={{ cursor: "pointer", fontWeight: 600 }}
            >
              Basic Information
            </div>
          </div>
        </div> */}

        <hr className="mb-3" />

        <Row className="rounded">
          <Col className="mx-auto">
            <Formik
              enableReinitialize
              initialValues={apiData || {}}
              onSubmit={(values) => {
                mutate({ formdata: values, id });
              }}
            >
              {({ setFieldValue }) => (
                <Form>
                  <div className="form-container ">
                    <InputField
                      name="name"
                      placeholder="Name"
                      label="Name"
                      required
                    />
                  </div>

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
      </div>
    </>
  );
};

export default PermissionsCreateUpdateForm;
