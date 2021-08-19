import { AxiosError } from "axios";
import bsCustomFileInput from "bs-custom-file-input";
import { FieldArray, Form, Formik } from "formik";
import { useEffect } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import { handleApiError } from "../../hooks/handleApiErrors";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import BackButton from "../../shared-components/BackButton";
import { InputField } from "../../shared-components/InputFeild";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import TextEditor from "../../shared-components/TextEditor";
import API from "../../utils/API";
import { isActiveArray } from "../../utils/arrays";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import ImagesContainer from "../../shared-components/ImagesContainer";

const key = "plans";

const createUpdataCoupons = ({
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

const addPlanImages = ({ formdata }: { formdata: FormData }) => {
  return API.post(`${key}/add-images`, formdata, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
const PlanCreateUpdateForm = () => {
  const history = useHistory();
  const { state } = useLocation();
  const id = state ? (state as any).id : null;
  useEffect(() => {
    bsCustomFileInput.init();
  }, []);

  const { data: categories, isLoading: isCategoriesLoading } = useQuery<any>([
    "categories",
  ]);

  const { data: Services, isLoading: isServicesLoading } = useQuery<any>([
    "services",
  ]);
  const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key });
  const { mutate, isLoading, error, status } = useMutation(
    createUpdataCoupons,
    {
      onSuccess: () => {
        setTimeout(() => queryClient.invalidateQueries(key), 500);
        history.replace("/plans");
        if (id) return showMsgToast("Plan updated successfully");
        showMsgToast("Plan created successfully");
      },
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );
  const {
    mutate: mutateImages,
    isLoading: isImagesUploadLoading,
    error: imagesError,
    status: imagesMutationStatus,
  } = useMutation(addPlanImages, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries(key), 500);
      showMsgToast("Plan images added successfully");
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
        <BackButton title="Plans" />
        <Row className="rounded">
          <Col className="mx-auto">
            <Formik
              enableReinitialize
              initialValues={
                apiData
                  ? {
                      ...apiData,
                      services: apiData?.allowed_services.map((s) => s.id),
                    }
                  : { is_active: 1 }
              }
              onSubmit={(values) => {
                const { image, services, images, ...rest } = values;
                const formdata = new FormData();

                for (let k in rest) formdata.append(k, rest[k]);

                for (let k in services)
                  formdata.append("services[]", services[k]);

                if (image && typeof image !== "string")
                  formdata.append("image", image);

                mutate({ formdata, id });
              }}
            >
              {({ setFieldValue, values }) => (
                <Form>
                  <div className="form-container  py-2 ">
                    <InputField
                      name="name"
                      placeholder="Name"
                      label="Name"
                      required
                    />

                    <InputField
                      type="number"
                      name="price"
                      placeholder="Price"
                      label="Price"
                      required
                    />
                    <InputField
                      type="number"
                      name="allowed_usage"
                      placeholder="Allowed Usage"
                      label="Allowed Usage"
                      required
                    />

                    <InputField
                      name="image"
                      placeholder="image"
                      label="Choose Plan Feature Image"
                      isFile
                      setFieldValue={setFieldValue}
                    />

                    <InputField
                      name="category_id"
                      placeholder="Category"
                      label="Choose Category"
                      as="select"
                      selectData={!isCategoriesLoading && categories.data}
                    />

                    <InputField
                      as="select"
                      selectData={isActiveArray}
                      name="is_active"
                      label="Is active?"
                      placeholder="Choose is active"
                    />
                    <InputField
                      as="select"
                      selectData={isActiveArray}
                      name="is_popular"
                      label="Is Popular?"
                      placeholder="Choose is popular"
                    />
                  </div>

                  <Row>
                    <Col xl={12} sm={12}>
                      <p className="text-black font-weight-bold small">
                        Services
                      </p>
                      <FieldArray
                        name="services"
                        render={(arrayHelpers) => (
                          <div className="d-flex flex-wrap">
                            {!isServicesLoading &&
                              Services?.data?.map((p) => (
                                <div className="mr-2">
                                  <label
                                    key={p.id}
                                    className="d-flex align-items-center"
                                  >
                                    <input
                                      name="services"
                                      type="checkbox"
                                      value={p.id}
                                      checked={values?.services?.includes(p.id)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          arrayHelpers.push(p.id);
                                        } else {
                                          const idx = values?.services?.indexOf(
                                            p.id
                                          );
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
                    <Col xl={12} sm={12}>
                      <TextEditor
                        name="description"
                        label="Description"
                        setFieldValue={setFieldValue}
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
        {id && (
          <div className="card view-padding p-2 d-flex mt-3 ">
            <div className="text-primary">
              <div className="d-flex justify-content-between">
                <div
                  className="text-black pb-3"
                  style={{ cursor: "pointer", fontWeight: 600 }}
                >
                  Plans Images
                </div>
              </div>
            </div>
            <div className="text-primary">
              <div className="d-flex justify-content-between">
                <div
                  className="text-black pb-3"
                  style={{ cursor: "pointer", fontWeight: 600 }}
                >
                  <Formik
                    initialValues={{ images: [] }}
                    onSubmit={(values) => {
                      const { images } = values;
                      const formdata = new FormData();
                      for (let k in images)
                        formdata.append("images[]", images[k]);

                      formdata.append("id", id);

                      mutateImages({ formdata });
                    }}
                  >
                    {({ setFieldValue, values }) => (
                      <Form>
                        <div className="w-100 d-flex align-items-start ">
                          <InputField
                            name="images"
                            label="Choose Plans Images"
                            isFile
                            multipleImages
                            setFieldValue={setFieldValue}
                          />
                        </div>
                        <Button type="submit" disabled={isImagesUploadLoading}>
                          {isImagesUploadLoading ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            "Add Imges"
                          )}
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
            <ImagesContainer
              folder="plans"
              images={!isLoading && data?.images}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default PlanCreateUpdateForm;
