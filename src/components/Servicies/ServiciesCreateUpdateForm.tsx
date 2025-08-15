import { AxiosError } from "axios";
// Removed bs-custom-file-input
import { Form, Formik } from "formik";
import { useEffect } from "react";
import {
  Button,
  Col,
  Row,
  Spinner,
  Form as BForm,
} from "../ui/bootstrap-compat";
import { useMutation, useQuery } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import { handleApiError } from "../../hooks/handleApiErrors";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import ImagesContainer from "../../shared-components/ImagesContainer";
import { InputField } from "../../shared-components/InputFeild";
import IsLoading from "../../shared-components/isLoading";
import Restricted from "../../shared-components/Restricted";
import API from "../../utils/API";
import { isActiveArray } from "../../utils/arrays";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import { Hammer } from "../ui/icon";
import EditorJsEditor from "../../shared-components/WYSIWIG/Editor";
import { Label } from "../ui/label";

const key = "services";

const createUpdataServices = ({
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

const addServicesImages = ({ formdata }: { formdata: FormData }) => {
  return API.post(`${key}/add-images`, formdata, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const ServicesCreateUpdateForm = () => {
  const { state } = useLocation();
  const id = state ? (state as any).id : null;
  const history = useHistory();
  useEffect(() => {}, []);

  const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key });
  const { data: categories, isLoading: isCategoriesLoading } =
    useQuery("categories");
  const { mutate, isLoading } = useMutation(createUpdataServices, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries(key), 500);
      if (id) return showMsgToast("Service updated successfully");
      showMsgToast("Service created successfully");
      history.replace("/services");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const { data: CarType, isLoading: isCarTypeLoading } = useQuery<any>([
    "brand-model-type",
  ]);
  const { mutate: mutateImages, isLoading: isServicesImageLoading } =
    useMutation(addServicesImages, {
      onSuccess: () => {
        setTimeout(() => queryClient.invalidateQueries(key), 500);
        showMsgToast("Services images added successfully");
      },
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    });

  const apiData = data && (data as any);

  const formIntialValues = () => {
    let values = {
      ...apiData,
      enablePayment: apiData?.enablePayment || false,
      paymentAmount: apiData?.paymentAmount || "",
      is_active: apiData?.is_active ?? "1", // default to Yes if null/undefined
    };
    CarType?.data?.map((car) => {
      const obj = apiData.brand_type_services.find(
        (i) => i.brand_model_type === car.id
      );
      if (obj) values[car.id] = obj.price;
    });
    return values;
  };

  if (dataLoading) return <IsLoading />;

  return (
    <>
      <div className="card view-padding p-2 d-flex mt-3">
        <Row className="rounded">
          <Col className="mx-auto w-full">
            <Formik
              enableReinitialize
              initialValues={
                apiData
                  ? formIntialValues()
                  : {
                      enablePayment: false,
                      paymentAmount: "",
                      is_active: "1", // Yes by default when creating
                      details: {
                        blocks: [{ type: "paragraph", data: { text: "" } }],
                      },
                    }
              }
              onSubmit={(values) => {
                const formdata = new FormData();
                const {
                  image,
                  images,
                  enablePayment,
                  paymentAmount,
                  details,
                  ...rest
                } = values;

                formdata.append("details", JSON.stringify(details || {}));

                for (let k in rest) formdata.append(k, rest[k]);

                for (let k in images) formdata.append("images[]", images[k]);
                if (image) formdata.append("image", image);

                if (enablePayment) {
                  formdata.append("enablePayment", "1");
                  formdata.append("paymentAmount", paymentAmount);
                } else {
                  formdata.append("enablePayment", "0");
                }

                CarType &&
                  CarType?.data?.map((car) => {
                    formdata.append("pricearray[]", values[car.id]);
                    formdata.append("brandtype[]", car.id);
                  });
                mutate({ formdata, id });
              }}
            >
              {({ setFieldValue, values }) => (
                <Form>
                  <div className="form-container py-2">
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
                      name="category_id"
                      placeholder="Category"
                      label="Choose Category"
                      as="select"
                      selectData={
                        !isCategoriesLoading && (categories as any).data
                      }
                    />
                    <InputField
                      as="select"
                      selectData={isActiveArray}
                      name="is_active"
                      label="Is active?"
                      placeholder="Choose is active"
                    />
                    <InputField
                      name="image"
                      placeholder="image"
                      label="Choose Service Featured Image"
                      isFile
                      folder="services"
                      setFieldValue={setFieldValue}
                    />

                    <BForm.Group style={{ marginBottom: "0px" }}>
                      <div
                        className="d-flex align-items-center"
                        style={{ gap: "5px", marginBottom: "4px" }}
                      >
                        <input
                          type="checkbox"
                          style={{ width: "15px", height: "15px" }}
                          id="enablePayment"
                          checked={values.enablePayment || false}
                          onChange={(e) => {
                            setFieldValue("enablePayment", e.target.checked);
                            if (!e.target.checked) {
                              setFieldValue("paymentAmount", "");
                            }
                          }}
                        />
                        <BForm.Label htmlFor="enablePayment" className="mb-0">
                          Payment
                        </BForm.Label>
                      </div>
                      {values.enablePayment && (
                        <InputField
                          name="paymentAmount"
                          placeholder="Enter payment amount"
                          type="number"
                          required
                        />
                      )}
                    </BForm.Group>
                  </div>

                  <Label htmlFor="termsEditor">Description</Label>
                  <EditorJsEditor
                    holderId="serviceEditor"
                    data={values.details}
                    onChange={(data) => setFieldValue("details", data)}
                  />

                  <Row className="d-flex justify-content-start">
                    <Col md="12">
                      <Restricted to={id ? "update_service" : "create_service"}>
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

        {id && (
          <div className="card view-padding p-2 d-flex mt-3 ">
            <div className="text-primary">
              <div className="d-flex justify-content-between">
                <div
                  className="text-black pb-3"
                  style={{ cursor: "pointer", fontWeight: 600 }}
                >
                  Service Images
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
                    initialValues={{ images: null }}
                    onSubmit={(values, { resetForm }) => {
                      const { images } = values;
                      const formdata = new FormData();
                      if (!images) return;
                      images.forEach((e: any) => {
                        formdata.append("images[]", e);
                      });
                      formdata.append("id", id);
                      mutateImages({ formdata });
                      resetForm({ values: { images: null } });
                    }}
                  >
                    {({ setFieldValue, values }) => (
                      <Form>
                        <div
                          className="w-100 d-flex align-items-start"
                          style={{ minWidth: "250px" }}
                        >
                          <label className="d-block w-100">
                            <input
                              className="d-none"
                              type="file"
                              name="images"
                              multiple={true}
                              onChange={(e) => {
                                setFieldValue(
                                  "images",
                                  Object.values(e.target.files)
                                );
                              }}
                            />
                            <div
                              className="border rounded p-2 w-100 mb-2"
                              style={{ width: "250px", cursor: "pointer" }}
                            >
                              <p className="mb-0 text-center">
                                Choose service images
                              </p>
                            </div>
                          </label>
                        </div>

                        <Row className="mb-2">
                          {values.images &&
                            values.images.map((e: any, i: number) => (
                              <Col md={6} className="mb-2" key={i}>
                                <div className="d-flex align-items-center">
                                  <div className="mr-2">
                                    <img
                                      src={URL.createObjectURL(e)}
                                      alt="image"
                                      style={{
                                        width: "80px",
                                        height: "80px",
                                      }}
                                    />
                                  </div>
                                  <div className="d-flex align-items-center">
                                    <div
                                      className="text-danger"
                                      onClick={() => {
                                        const idx = values.images.indexOf(e);
                                        values.images.splice(idx, 1);
                                        setFieldValue("images", values.images);
                                      }}
                                    >
                                      <Hammer />
                                    </div>
                                  </div>
                                </div>
                              </Col>
                            ))}
                        </Row>

                        <Restricted to="update_service">
                          <Button
                            type="submit"
                            disabled={
                              isServicesImageLoading ||
                              values?.images === null ||
                              values?.images?.length === 0
                            }
                          >
                            {isServicesImageLoading ? (
                              <Spinner animation="border" size="sm" />
                            ) : (
                              "Upload Images"
                            )}
                          </Button>
                        </Restricted>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
            <ImagesContainer
              folder="services"
              images={!isLoading && data?.images}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ServicesCreateUpdateForm;
