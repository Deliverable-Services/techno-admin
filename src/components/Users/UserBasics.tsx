import { AxiosError } from "axios";
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
import * as Yup from "yup";
import Restricted from "../../shared-components/Restricted";

const key = "users";

const ValidationSchema = Yup.object().shape({
  phone: Yup.string()
    .nullable()
    .matches(/^[6-9]\d{9}$/, "Phone number is not valid")
    .required("Phone number required"),
});

const createUpdateUser = ({
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

interface UserBasicsProps {
  toggleModal: () => void;
}

const UserBasics = ({ toggleModal }: UserBasicsProps) => {
  const { state } = useLocation();
  const history = useHistory();
  const id = state ? (state as any).id : null;
  const role = "customer"; // Always set to customer

  const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key });

  const { mutate, isLoading } = useMutation(createUpdateUser, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries(key), 500);
      if (id) return showMsgToast("User updated successfully");
      showMsgToast("User created successfully");
      toggleModal();
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const apiData = data && (data as any);

  if (dataLoading) return <IsLoading />;

  return (
    <>
      <Row className="rounded">
        <Col className="mx-auto">
          <Formik
            enableReinitialize
            initialValues={apiData || { role }}
            onSubmit={(values) => {
              const { profile_pic, ...rest } = values;
              const formdata = new FormData();
              for (let k in rest) formdata.append(k, rest[k]);
              if (profile_pic) formdata.append("profile_pic", profile_pic);
              mutate({ formdata, id });
            }}
            validationSchema={ValidationSchema}
          >
            {({ setFieldValue, errors }) => (
              <Form className="w-100 flyout-form">
                <div className="form-container py-2">
                  <InputField
                    name="name"
                    placeholder="Name"
                    label="Name"
                    required
                  />
                  <InputField
                    name="phone"
                    placeholder="phone"
                    label="Phone"
                    error={errors.phone as string}
                    required
                  />
                  <InputField
                    name="email"
                    placeholder="Email"
                    label="Email"
                    required
                  />

                  {/* Role - Only Customer */}
                  <InputField
                    as="select"
                    selectData={[{ id: "customer", name: "CUSTOMER" }]}
                    name="role"
                    label="Role"
                    defaultValue="customer"
                  />

                  <InputField
                    name="profile_pic"
                    placeholder="Profile Pic"
                    label="Choose Profile Pic"
                    folder="profile_pic"
                    isFile
                    setFieldValue={setFieldValue}
                  />
                </div>
                <Row className="d-flex justify-content-start">
                  <Col md="12">
                    <Restricted to={id ? "update_user" : "create_user"}>
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
    </>
  );
};

export default UserBasics;
