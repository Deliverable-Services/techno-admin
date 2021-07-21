import { AxiosError } from "axios";
import bsCustomFileInput from "bs-custom-file-input";
import { FieldArray, Form, Formik } from "formik";
import { useEffect } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import { handleApiError } from "../../hooks/handleApiErrors";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import BackButton from "../../shared-components/BackButton";
import { InputField } from "../../shared-components/InputFeild";
import IsLoading from "../../shared-components/isLoading";
import API from "../../utils/API";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";

const key = "revoke-permission";

const createUpdataBrand = ({ formdata, id }: { formdata: any; id: string }) => {
  return API.post(`revoke-permission/${id}`, formdata, {
    headers: { "Content-Type": "application/json" },
  });
};

const RevokePermission = () => {
  const { state } = useLocation();
  const history = useHistory();
  const id = state ? (state as any).id : null;
  useEffect(() => {
    bsCustomFileInput.init();
  }, []);
  const { data, isLoading: dataLoading } = useGetSingleQuery({
    id,
    key: "get-roles",
  });
  const { data: Permissions, isLoading: isPermissionsLoading } = useQuery<any>([
    "get-all-permission",
  ]);
  const { mutate, isLoading } = useMutation(createUpdataBrand, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries(""), 500);
      history.replace("/permissions");
      showMsgToast("Permission revoked successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const apiData = data as any;

  if (dataLoading) return <IsLoading />;

  return (
    <>
      <BackButton title={"Revoke Permission Role"} />

      <div className="card view-padding p-2 d-flex mt-3">
        <div className="text-primary">
          <div className="d-flex justify-content-between">
            <div
              className="text-black pb-3"
              style={{ cursor: "pointer", fontWeight: 600 }}
            >
              Basic Information
            </div>
          </div>
        </div>

        <hr className="mb-3" />

        <Row className="rounded">
          <Col className="mx-auto">
            <Formik
              initialValues={
                apiData
                  ? {
                      ...apiData,
                      // permission: apiData?.permissions.map((p) => p.id),
                    }
                  : {}
              }
              onSubmit={(values) => {
                console.log({ values });
                mutate({ formdata: values, id });
              }}
            >
              {({ setFieldValue, values }) => (
                <Form>
                  <div className="form-container ">
                    <p className="text-capitalize font-weight-bold">
                      {apiData?.name}
                    </p>
                  </div>
                  <Row>
                    <Col>
                      <p className="text-muted">Permissions</p>

                      <InputField
                        as="select"
                        label="Select Permissoin to Revoke"
                        name="permission"
                        selectData={values.permissions}
                        selectTitleKey="name"
                        selectValueKey="name"
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
      </div>
    </>
  );
};

export default RevokePermission;
