import { AxiosError } from "axios";
import bsCustomFileInput from "bs-custom-file-input";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { useMutation } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import { handleApiError } from "../../hooks/handleApiErrors";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import { InputField } from "../../shared-components/InputFeild";
import IsLoading from "../../shared-components/isLoading";
import Restricted from "../../shared-components/Restricted";
import API from "../../utils/API";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";

const key = "cities";

const createUpdataBrand = ({
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

const CitiesCreateUpdateForm = () => {
  const { state } = useLocation();
  const history = useHistory();
  const id = state ? (state as any).id : null;
  useEffect(() => {
    bsCustomFileInput.init();
  }, []);
  const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key });
  const { mutate, isLoading } = useMutation(createUpdataBrand, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries(key), 500);
      if (id) return showMsgToast("City updated successfully");
      showMsgToast("City created successfully");
      history.replace("/cities");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const title = id ? "Update City" : "Add City";

  const apiData = data as any;

  if (dataLoading) return <IsLoading />;

  return (
    <>
      <div className="card view-padding p-2 d-flex mt-3">
        {/* <BackButton title={title} /> */}

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
              initialValues={apiData || {}}
              onSubmit={(values) => {
                const { logo, ...rest } = values;
                const formdata = new FormData();
                for (let k in rest) formdata.append(k, rest[k]);

                if (logo && typeof logo !== "string")
                  formdata.append("logo", logo);

                mutate({ formdata, id });
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

                    <InputField
                      name="state"
                      placeholder="State"
                      label="State"
                      required
                    />
                    <InputField
                      name="lat"
                      placeholder="Latitude"
                      label="Latitude"
                      required
                    />
                    <InputField
                      name="lng"
                      placeholder="Longitude"
                      label="Longitude"
                      required
                    />
                  </div>

                  <Row className="d-flex justify-content-start">
                    <Col md="12">
                      <Restricted to={id ? "update_city" : "create_city"}>
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

export default CitiesCreateUpdateForm;
