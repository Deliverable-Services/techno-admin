import { AxiosError } from "axios";
import bsCustomFileInput from "bs-custom-file-input";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import { handleApiError } from "../../hooks/handleApiErrors";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import useUserProfileStore from "../../hooks/useUserProfileStore";
import BackButton from "../../shared-components/BackButton";
import { InputField } from "../../shared-components/InputFeild";
import IsLoading from "../../shared-components/isLoading";
import Restricted from "../../shared-components/Restricted";
import API from "../../utils/API";
import { isActiveArray } from "../../utils/arrays";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";

const key = "brand-models";

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

const BrandModlesCreateUpdateForm = () => {
  const { state } = useLocation();
  const history = useHistory();
  const id = state ? (state as any).id : null;
  useEffect(() => {
    bsCustomFileInput.init();
  }, []);

  const { data: brands, isLoading: isBrandLoading } = useQuery<any>(["brands"]);
  const { data: CarType, isLoading: isCarTypeLoading } = useQuery<any>([
    "brand-model-type",
  ]);
  const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key });
  const { mutate, isLoading } = useMutation(createUpdataBrand, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries(key), 500);
      if (id) return showMsgToast("Brand Model updated successfully");
      showMsgToast("Brand Model created successfully");
      history.replace("/brand-models");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const apiData = data && (data as any);

  if (dataLoading) return <IsLoading />;

  return (
    <>
      <div className="card view-padding p-2 d-flex mt-3">
        <BackButton title="Brands Model" />
        <Row className="rounded">
          <Col className="mx-auto">
            <Formik
              enableReinitialize
              initialValues={apiData || { is_active: "1" }}
              onSubmit={(values) => {
                const formdata = new FormData();
                const { image, ...rest } = values;
                for (let k in rest) formdata.append(k, rest[k]);
                if (values.image) formdata.append("image", values.image);

                mutate({ formdata, id });
              }}
            >
              {({ setFieldValue }) => (
                <Form>
                  <div className={`form-container  py-2 `}>
                    <InputField
                      name="name"
                      placeholder="Name"
                      label="Name"
                      required
                    />

                    <InputField
                      name="url"
                      placeholder="Url"
                      label="Url"
                      required
                    />
                    <InputField
                      name="image"
                      folder="brand-models"
                      placeholder="image"
                      label="Choose Brand Model Image"
                      isFile
                      setFieldValue={setFieldValue}
                    />
                    <InputField
                      name="brand_id"
                      placeholder="Brand"
                      label="Choose Brand"
                      as="select"
                      selectData={!isBrandLoading && brands?.data}
                    />
                    <InputField
                      name="brand_model_type"
                      placeholder="Car Type"
                      label="Choose Car Type"
                      as="select"
                      selectData={!isCarTypeLoading && CarType?.data}
                    />

                    <InputField
                      as="select"
                      selectData={isActiveArray}
                      name="is_active"
                      label="Is active?"
                      placeholder="Choose is active"
                    />
                  </div>
                  <Row className="d-flex justify-content-start">
                    <Col md="2">
                      <Restricted
                        to={id ? "update_brandmodel" : "create_brandmodel"}
                      >
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

export default BrandModlesCreateUpdateForm;
