import { AxiosError } from "axios";
// Removed bs-custom-file-input
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { Button, Col, Row, Spinner } from "../ui/bootstrap-compat";
import { useMutation } from "react-query";
import { useHistory } from "react-router-dom";
import { handleApiError } from "../../hooks/handleApiErrors";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import { InputField } from "../../shared-components/InputFeild";
import IsLoading from "../../shared-components/isLoading";
import Restricted from "../../shared-components/Restricted";
import API from "../../utils/API";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import PageHeading from "../../shared-components/PageHeading";

const key = "configuration";

const createUpdateConfig = ({
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

const ConfigCreateUpdateForm = ({ id, onHideModal }) => {
  const history = useHistory();
  useEffect(() => {}, []);
  const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key });
  const { mutate, isLoading } = useMutation(createUpdateConfig, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries(key), 500);
      onHideModal();
      if (id) showMsgToast("Config updated successfully");
      else showMsgToast("Config created successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const title = id ? "Update Config" : "Add Config";

  const apiData = data as any;

  if (dataLoading) return <IsLoading />;

  return (
    <>
      <div className="card view-padding p-2 d-flex ">
        <PageHeading title={title} />
        <hr className="my-2 mb-3" />

        <Row className="rounded">
          <Col className="mx-auto">
            <Formik
              enableReinitialize
              initialValues={data || {}}
              onSubmit={(values) => {
                const formdata = new FormData();
                for (let k in values) formdata.append(k, values[k]);

                mutate({ formdata, id });
              }}
            >
              {({ setFieldValue }) => (
                <Form>
                  <div className="form-container ">
                    <InputField
                      name="key"
                      placeholder="key"
                      label="Key"
                      isDisabled={id}
                      required
                    />

                    <InputField
                      name="title"
                      placeholder="Title"
                      label="Title"
                      required
                    />
                    <InputField
                      name="value"
                      placeholder="value"
                      label="Value"
                      required
                    />
                  </div>

                  <Row className="d-flex justify-content-start">
                    <Col md="2">
                      <Restricted to={id ? "update_config" : "create_config"}>
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
                      </Restricted>
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

export default ConfigCreateUpdateForm;
