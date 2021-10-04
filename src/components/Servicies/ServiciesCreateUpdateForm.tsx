import { AxiosError } from "axios";
import bsCustomFileInput from "bs-custom-file-input";
import { Field, FieldArray, Form, Formik } from "formik";
import { useEffect } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Row,
  Spinner,
  Form as BForm,
} from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import { handleApiError } from "../../hooks/handleApiErrors";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import BackButton from "../../shared-components/BackButton";
import ImagesContainer from "../../shared-components/ImagesContainer";
import { InputField } from "../../shared-components/InputFeild";
import IsLoading from "../../shared-components/isLoading";
import PageHeading from "../../shared-components/PageHeading";
import Restricted from "../../shared-components/Restricted";
import TextEditor from "../../shared-components/TextEditor";
import API from "../../utils/API";
import { isActiveArray } from "../../utils/arrays";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";

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
  useEffect(() => {
    bsCustomFileInput.init();
  }, []);
  const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key });
  const { data: categories, isLoading: isCategoriesLoading } =
    useQuery("categories");
  const { mutate, isLoading, error, status } = useMutation(
    createUpdataServices,
    {
      onSuccess: () => {
        setTimeout(() => queryClient.invalidateQueries(key), 500);
        history.replace("/services");
        if (id) return showMsgToast("Service updated successfully");
        showMsgToast("Service created successfully");
      },
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  const { data: CarType, isLoading: isCarTypeLoading } = useQuery<any>([
    "brand-model-type",
  ]);
  const {
    mutate: mutateImages,
    isLoading: isServicesImageLoading,
    error: imagesError,
    status: imagesMutationStatus,
  } = useMutation(addServicesImages, {
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
    let values = { ...apiData };
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
        <BackButton title="Services" />
        <Row className="rounded">
          <Col className="mx-auto">
            <Formik
              enableReinitialize
              initialValues={apiData ? formIntialValues() : {}}
              onSubmit={(values) => {
                const formdata = new FormData();
                const { image, images, ...rest } = values;
                for (let k in rest) formdata.append(k, rest[k]);

                for (let k in images) formdata.append("images[]", images[k]);
                if (values.image) formdata.append("image", values.image);

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
                  <div className="form-container  py-2 ">
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
                    {/* <InputField
                      name="price"
                      placeholder="Price"
                      label="Price"
                      type="number"
                    /> */}
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
                      label="Choose Service  Featured Image"
                      isFile
                      setFieldValue={setFieldValue}
                    />
                  </div>
                  <Container fluid className="p-0">
                    <PageHeading title="Prices" />

                    <FieldArray
                      name="pricearray"
                      render={(arrayHelpers) => (
                        <div className="form-container py-2">
                          {!isCarTypeLoading
                            ? CarType?.data?.map((p) => (
                                <BForm.Group key={`${p.id}`}>
                                  <BForm.Label htmlFor={p.name}>
                                    {p.name.toUpperCase()}
                                  </BForm.Label>
                                  <Field
                                    name={`${p.id}`}
                                    as={BForm.Control}
                                    placeholder={`Enter ${p.name} price`}
                                    required
                                    type="number"
                                  />
                                </BForm.Group>
                              ))
                            : null}
                        </div>
                      )}
                    />

                    {/* {!isCarTypeLoading && (
                      <div className="form-container py-2">
                        {CarType.data.map((type) => (
                          <InputField
                            type="number"
                            name={type.name}
                            label={type.name.toUpperCase()}
                            placeholder={`Enter ${type.name} price`}
                          />
                        ))}
                      </div>
                    )} */}
                  </Container>
                  <TextEditor
                    name="details"
                    label="Details"
                    setFieldValue={setFieldValue}
                  />
                  <Row className="d-flex justify-content-start">
                    <Col md="2">
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
                        <Restricted to="update_service">
                          <Button
                            type="submit"
                            disabled={isServicesImageLoading}
                          >
                            {isServicesImageLoading ? (
                              <Spinner animation="border" size="sm" />
                            ) : (
                              "Add Imges"
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
