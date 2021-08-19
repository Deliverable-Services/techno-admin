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
import API from "../../utils/API";
import { isActiveArray } from "../../utils/arrays";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import { types } from "./AdvertisementTypes";

const key = "banners";

const createUpdataAdvertisement = ({
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

const AdvertisementCreateUpdateForm = () => {
  const history = useHistory();
  const { state } = useLocation();
  const id = state ? (state as any).id : null;
  useEffect(() => {
    bsCustomFileInput.init();
  }, []);

  const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key });
  const { mutate, isLoading, error, status } = useMutation(
    createUpdataAdvertisement,
    {
      onSuccess: () => {
        setTimeout(() => queryClient.invalidateQueries("banners/list"), 500);
        history.replace("/advertisements");
        if (id) return showMsgToast("Banner updated successfully");
        showMsgToast("Bannner created successfully");
      },
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  const apiData = data && (data as any);

  if (dataLoading) return <IsLoading />;

  return (
    <>
      <div className="card view-padding p-2 d-flex mt-3">
        <BackButton title="Banners" />
        <Row className="rounded">
          <Col className="mx-auto">
            <Formik
              enableReinitialize
              initialValues={
                apiData || {
                  valid_to: moment().format("YYYY-MM-DD hh:mm:ss"),
                  valid_from: moment().format("YYYY-MM-DD hh:mm:ss"),
                }
              }
              onSubmit={(values) => {
                const { image, ...rest } = values;
                console.log({ values });
                const formdata = new FormData();
                for (let k in rest) formdata.append(k, rest[k]);
                if (image) formdata.append("image", values.image);

                mutate({ formdata, id });
              }}
            >
              {({ setFieldValue }) => (
                <Form>
                  {status === "success" && (
                    <Alert variant="success">
                      {id
                        ? "Advertisement  updated successfully"
                        : "Advertisement created successfully"}
                    </Alert>
                  )}
                  {error && (
                    <Alert variant="danger">{(error as Error).message}</Alert>
                  )}
                  <div className={`form-container  py-2 `}>
                    <InputField name="name" placeholder="Name" label="Name" />
                    <InputField
                      name="title"
                      placeholder="Title"
                      label="Title"
                    />

                    <InputField
                      name="deeplink"
                      placeholder="Deep Link"
                      label="Deep Link"
                    />
                    <InputField
                      type="number"
                      name="order"
                      placeholder="Order"
                      label="Order"
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
                      name="image"
                      placeholder="image"
                      label="Image"
                      isFile
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
                      name="type"
                      placeholder="Advertisement type"
                      label="Choose Type"
                      as="select"
                      selectData={types}
                    />

                    {/* <InputField
                    as="textarea"
                    name="description"
                    placeholder="Description"
                    label="Description"
                  />
                  <InputField
                    as="textarea"
                    name="terms"
                    placeholder="Terms"
                    label="Terms"
                  /> */}
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

export default AdvertisementCreateUpdateForm;
