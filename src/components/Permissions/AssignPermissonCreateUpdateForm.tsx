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
import { isActiveArray, PermissionsData, userRoles } from "../../utils/arrays";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";

const key = "give-permission";

const createUpdataBrand = ({ formdata, id }: { formdata: any; id: string }) => {
  if (!id) {
    return API.post(`give-permission`, formdata, {
      headers: { "Content-Type": "application/json" },
    });
  }

  return API.post(`${key}/${id}`, formdata, {
    headers: { "Content-Type": "application/json" },
  });
};

const AssignPermissionForm = () => {
  const { state } = useLocation();
  const history = useHistory();
  const id = state ? (state as any).id : null;
  useEffect(() => {
    bsCustomFileInput.init();
  }, []);
  const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key });
  const { data: Roles, isLoading: isRolesLoading } = useQuery<any>([
    "get-all-roles/d",
  ]);
  const { data: Permissions, isLoading: isPermissionsLoading } = useQuery<any>([
    "get-all-permission/d",
  ]);
  const { mutate, isLoading } = useMutation(createUpdataBrand, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries(key), 500);
      history.replace("/permissions");
      if (id) return showMsgToast("Role updated successfully");
      showMsgToast("Role created successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const apiData = data as any;

  if (dataLoading) return <IsLoading />;

  return (
    <>
      <BackButton title={"Assign Permission Role"} />

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
              initialValues={apiData || {}}
              onSubmit={(values) => {
                console.log({ values });
                // const { logo, ...rest } = values;
                // const formdata = new FormData();
                // for (let k in rest) formdata.append(k, rest[k]);

                // if (logo && typeof logo !== "string")
                //   formdata.append("logo", logo);

                mutate({ formdata: values, id });
              }}
            >
              {({ setFieldValue, values }) => (
                <Form>
                  <div className="form-container ">
                    <InputField
                      as="select"
                      selectData={!isRolesLoading && Roles}
                      name="id"
                      label="Role"
                      placeholder="Role"
                    />
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
                                    name="permissions"
                                    type="checkbox"
                                    value={p.id}
                                    checked={values?.permissions?.includes(
                                      p.id
                                    )}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        arrayHelpers.push(p.id);
                                      } else {
                                        const idx =
                                          values?.permissions?.indexOf(p.id);
                                        arrayHelpers.remove(idx);
                                      }
                                    }}
                                  />
                                  <span className=" ml-2 ">{p.name}</span>
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
