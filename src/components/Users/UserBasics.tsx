import { AxiosError } from "axios";
import bsCustomFileInput from "bs-custom-file-input";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { useMutation } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import { handleApiError } from "../../hooks/handleApiErrors";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import BackButton from "../../shared-components/BackButton";
import { InputField } from "../../shared-components/InputFeild";
import IsLoading from "../../shared-components/isLoading";
import API from "../../utils/API";
import { isActiveArray, userRoles } from "../../utils/arrays";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import * as Yup from "yup";

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

const UserBasics = () => {
  const { state } = useLocation();
  const history = useHistory();
  const id = state ? (state as any).id : null;
  useEffect(() => {
    bsCustomFileInput.init();
  }, []);
  const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key });
  const { mutate, isLoading, error, status } = useMutation(createUpdateUser, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries(key), 500);
      history.replace("/users");
      if (id) return showMsgToast("User updated successfully");
      showMsgToast("User created successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const apiData = data && (data as any);

  if (dataLoading) return <IsLoading />;

  return (
    <>
      <BackButton title="Users" />
      <Row className="rounded">
        <Col className="mx-auto">
          <Formik
            enableReinitialize
            initialValues={apiData || {}}
            onSubmit={(values) => {
              console.log(values);
              const { profile_pic, ...rest } = values;
              const formdata = new FormData();
              for (let k in rest) formdata.append(k, rest[k]);

              if (typeof profile_pic !== "string" && profile_pic)
                formdata.append("profile_pic", profile_pic);

              mutate({ formdata, id });
            }}
            validationSchema={ValidationSchema}
          >
            {({ setFieldValue, errors }) => (
              <Form className="w-100">
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
                  <InputField
                    as="select"
                    selectData={isActiveArray}
                    name="disabled"
                    label="Disabled?"
                    placeholder="Is User Disabled?"
                  />
                  <InputField
                    as="select"
                    selectData={userRoles}
                    name="role"
                    label="Role"
                    placeholder="Role"
                  />
                  <InputField
                    name="profile_pic"
                    placeholder="Profile Pic"
                    label="Choose Profile Pic"
                    isFile
                    setFieldValue={setFieldValue}
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

export default UserBasics;
function phoneRegExp(phoneRegExp: any, arg1: string) {
  throw new Error("Function not implemented.");
}
