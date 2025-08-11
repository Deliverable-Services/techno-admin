import { Formik, Form } from "formik";
import { Button, Col, Container, Row, Spinner } from "../ui/bootstrap-compat";
import useUserProfileStore from "../../hooks/useUserProfileStore";
import { InputField } from "../../shared-components/InputFeild";
import { config } from "../../utils/constants";
import * as Yup from "yup";
import API from "../../utils/API";
import { useMutation } from "react-query";
import { showMsgToast } from "../../utils/showMsgToast";
import { AxiosError } from "axios";
import { handleApiError } from "../../hooks/handleApiErrors";
import { queryClient } from "../../utils/queryClient";
import { useHistory } from "react-router-dom";
import BackButton from "../../shared-components/BackButton";
import { Hammer } from "../ui/icon";

const ValidationSchema = Yup.object().shape({
  phone: Yup.string()
    .nullable()
    .matches(/^\+91[6-9]\d{9}$/, "Phone number is not valid")
    .required("Phone number required"),
  email: Yup.string().email().required(),
  name: Yup.string().required("Name is required"),
});

const key = "profile";

const updateUser = ({ formdata }: { formdata: any }) => {
  return API.post(`${key}`, formdata, {
    headers: { "Content-Type": "application/json" },
  });
};
const updateProfileImage = ({ formdata }: { formdata: FormData }) => {
  return API.post(`${key}/picture`, formdata, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
const ProfilePage = () => {
  const history = useHistory();
  const loggedInUser = useUserProfileStore((state) => state.user);
  const { mutate, isLoading, error, status } = useMutation(updateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(key);
      showMsgToast("Profile updated successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });
  const { mutate: mutateImage, isLoading: isImageLoading } = useMutation(
    updateProfileImage,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(key);
        showMsgToast("Profile Image updated successfully");
      },
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  const _updateProfilePicutre = (e) => {
    const image = e.target.files[0];
    const formdata = new FormData();
    formdata.append("image", image);
    mutateImage({ formdata });
  };

  return (
    <Container fluid className="card component-wrapper view-padding">
      <BackButton title="Edit Profile" />
      <Container
        fluid
        className="profile-card d-flex flex-column align-items-center"
      >
        <div
          className="mx-auto"
          style={{
            height: 100,
            width: 100,
          }}
        >
          {loggedInUser?.profile_pic ? (
            <img
              src={
                config.baseUploadUrl + "profile_pic/" + loggedInUser.profile_pic
              }
              style={{ borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            <div
              className="d-flex align-items-center justify-content-center bg-primary"
              style={{
                height: 100,
                width: 100,
                borderRadius: "50%",
              }}
            >
              <p className="mb-0 text-white display-4">
                {loggedInUser?.name?.charAt(0).toUpperCase() || "A"}
              </p>
            </div>
          )}
        </div>
        <div className="update-profile-pic mt-3">
          <input
            accept="image/*"
            className={"d-none"}
            id="contained-button-file"
            type="file"
            onChange={(e) => _updateProfilePicutre(e)}
          />
          <label htmlFor="contained-button-file">
            <div className="d-flex bg-primary text-white align-items-center px-2 py-1 rounded">
              <Hammer size={18} color="#fff" />
              {isImageLoading ? (
                "Uploading..."
              ) : (
                <p className="mb-0  ml-2">Change Profile Picture</p>
              )}
            </div>
          </label>
        </div>
        <Formik
          enableReinitialize
          initialValues={loggedInUser}
          onSubmit={(values) => {
            console.log({ values });
            const formdata = {
              name: values.name,
              email: values.email,
            };
            mutate({ formdata });
          }}
          validationSchema={ValidationSchema}
        >
          {({ errors }) => (
            <Form className="w-100 mt-2">
              <div className="form-container">
                <InputField
                  name="name"
                  placeholder="Name"
                  label="Name"
                  error={errors.name}
                />
                <InputField
                  name="phone"
                  placeholder="Phone"
                  label="Phone"
                  isDisabled
                  error={errors.phone}
                />
                <InputField
                  name="email"
                  placeholder="email"
                  label="Email"
                  error={errors.email}
                />
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
      </Container>
    </Container>
  );
};

export default ProfilePage;
