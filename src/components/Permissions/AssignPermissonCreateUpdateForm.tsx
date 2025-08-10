// Permissions/AssignPermissonCreateUpdateForm.tsx

import { AxiosError } from "axios";
// Removed bs-custom-file-input
import { FieldArray, Form, Formik } from "formik";
import { useEffect } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import { handleApiError } from "../../hooks/handleApiErrors";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import BackButton from "../../shared-components/BackButton";
import IsLoading from "../../shared-components/isLoading";
import API from "../../utils/API";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";

const key = "give-permission";

const createUpdataBrand = ({ formdata, id }: { formdata: any; id: string }) => {
  return API.post(`give-permission`, formdata, {
    headers: { "Content-Type": "application/json" },
  });
};

const AssignPermissionForm = () => {
  const { state } = useLocation();
  const history = useHistory();
  const id = state ? (state as any).id : null;
  useEffect(() => {}, []);
  const { data, isLoading: dataLoading } = useGetSingleQuery({
    id,
    key: "get-roles",
  });
  const { data: Permissions, isLoading: isPermissionsLoading } = useQuery<any>([
    "get-all-permission",
  ]);
  const { mutate, isLoading } = useMutation(createUpdataBrand, {
    onSuccess: () => {
      setTimeout(
        () => queryClient.invalidateQueries("roles-with-permission"),
        500
      );
      history.replace("/permissions");
      showMsgToast("Permission assigned successfully");
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
        <BackButton title={"Assign Permission to Role"} />
        {/* <div className="text-primary">
          <div className="d-flex justify-content-between">
            <div
              className="text-black pb-3"
              style={{ cursor: "pointer", fontWeight: 600 }}
            >
              Basic Information
            </div>
          </div>
        </div>

        <hr className="mb-3" /> */}

        <Row className="rounded">
          <Col className="mx-auto">
            <Formik
              enableReinitialize
              initialValues={
                apiData
                  ? {
                      ...apiData,
                      permission: apiData?.permissions.map((p) => p.id),
                    }
                  : {}
              }
              onSubmit={(values) => {
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

                      <FieldArray
                        name="permission"
                        render={(arrayHelpers) => (
                          <div>
                            {Permissions?.map((p) => (
                              <div>
                                <label
                                  key={p.id}
                                  className="d-flex align-items-center"
                                >
                                  <input
                                    name="permission"
                                    type="checkbox"
                                    value={p.id}
                                    checked={values?.permission?.includes(p.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        arrayHelpers.push(p.id);
                                      } else {
                                        const idx = values?.permission?.indexOf(
                                          p.id
                                        );
                                        arrayHelpers.remove(idx);
                                      }
                                    }}
                                  />
                                  <span className=" ml-2 ">
                                    {p.name
                                      .replace(/_/g, " ")
                                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                                  </span>
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
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

export default AssignPermissionForm;
