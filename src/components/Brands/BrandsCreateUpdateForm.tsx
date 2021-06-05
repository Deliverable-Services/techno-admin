import bsCustomFileInput from "bs-custom-file-input";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { useMutation } from "react-query";
import { useLocation } from "react-router-dom";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import BackButton from "../../shared-components/BackButton";
import { InputField } from "../../shared-components/InputFeild";
import IsLoading from "../../shared-components/isLoading";
import API from "../../utils/API";
import { isActiveArray } from "../../utils/arrays";
import { queryClient } from "../../utils/queryClient";
import { showErrorToast } from "../../utils/showErrorToast";
import { showMsgToast } from "../../utils/showMsgToast";

const key = "brands";

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

const BrandsCreateUpdateForm = () => {
  const { state } = useLocation()
  const id = state ? (state as any).id : null;
  useEffect(() => {
    bsCustomFileInput.init();
  }, []);
  const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key });
  const { mutate, isLoading, error, status } = useMutation(createUpdataBrand, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries(key), 500);
      showMsgToast("Message of success")
    },
    onError: () => {
      showErrorToast("Failed!")
    }
  });


  const apiData = data as any;

  if (dataLoading) return <IsLoading />;

  return (
    <>
      <BackButton title="Brands" />
      <Row className="rounded">
        <Col className="mx-auto">
          <Formik
            initialValues={apiData || {}}

            onSubmit={(values) => {
              const formdata = new FormData();
              formdata.append("name", values.name);
              formdata.append("url", values.url);
              formdata.append("is_active", values.is_active);
              if (values.logo)
                formdata.append("logo", values.logo);

              mutate({ formdata, id });
            }}
          >
            {({ setFieldValue }) => (
              <Form>
                {status === "success" && (
                  <Alert variant="success">
                    {id
                      ? "Brand updated successfully"
                      : "Brand created successfully"}
                  </Alert>
                )}
                {error && (
                  <Alert variant="danger">{(error as Error).message}</Alert>
                )}
                <div className="form-container ">
                  <InputField
                    name="name"
                    placeholder="Name"
                    label="Name"
                    required
                  />

                  <InputField name="url" placeholder="Url" label="Url" required />
                  <InputField
                    name="logo"
                    placeholder="logo"
                    label="Choose Brand Logo"
                    isFile
                    setFieldValue={setFieldValue}
                  />

                  <InputField as="select" selectData={isActiveArray} name="is_active" label="Is active?" placeholder="Choose is active" />
                </div>

                <Row className="d-flex justify-content-start">
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
    </>
  );
};

export default BrandsCreateUpdateForm;
