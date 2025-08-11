// Permissions/PermissoinsCreateUpdateForm.tsx

import { AxiosError } from "axios";
// Removed bs-custom-file-input
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { Button, Col, Row, Spinner } from "../ui/bootstrap-compat";
import { useMutation } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import { handleApiError } from "../../hooks/handleApiErrors";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import { InputField } from "../../shared-components/InputFeild";
import IsLoading from "../../shared-components/isLoading";
import API from "../../utils/API";
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

interface PermissionsCreateUpdateForm {
  setShowModal: () => void;
}

const PermissionsCreateUpdateForm = ({
  setShowModal,
}: PermissionsCreateUpdateForm) => {
  const { state } = useLocation();
  const history = useHistory();
  const id = state ? (state as any).id : null;
  useEffect(() => {}, []);
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
      // history.replace("/permissions");
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
      <Row className="rounded">
        <Col className="mx-auto">
          <Formik
            enableReinitialize
            initialValues={apiData || {}}
            onSubmit={(values) => {
              mutate({ formdata: values, id });
              setShowModal();
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
    </>
  );
};

export default PermissionsCreateUpdateForm;
