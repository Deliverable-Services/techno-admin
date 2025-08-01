import { Formik, Form } from "formik";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import API from "../../utils/API";
import { showMsgToast } from "../../utils/showMsgToast";
import { handleApiError } from "../../hooks/handleApiErrors";
import { queryClient } from "../../utils/queryClient";
import { InputField } from "../../shared-components/InputFeild";
import profile from "../../assets/profile.svg";
import useUserProfileStore from "../../hooks/useUserProfileStore";

const key = "profile";

const ValidationSchema = Yup.object().shape({
  phone: Yup.string()
    .nullable()
    .matches(/^\+91[6-9]\d{9}$/, "Phone number is not valid")
    .required("Phone number required"),
  email: Yup.string().email().required(),
  name: Yup.string().required("Name is required"),
});

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

const ProfileTab = () => {
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
    <div className="mt-5">
      <div>
        <div className="tab-header">
          <h4>Personal Info</h4>
          <p>Update your photo and personal details here.</p>
        </div>
        <div className="right-content">
          <div className="profile-card d-flex flex-column align-items-center">
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
                  <div className="border-div form-group w-100 mt-4 d-flex align-items-center">
                    <label htmlFor="fname">Name</label>
                    <div className="input-div w-100 d-flex align-items-center gap-3">
                      <InputField
                        name="name"
                        placeholder="Name"
                        error={errors.name}
                      />
                    </div>
                  </div>
                  <div className="border-div form-group w-100 mt-3 d-flex align-items-center">
                    <label htmlFor="email">Email</label>
                    <InputField
                      name="email"
                      placeholder="email"
                      label="Email"
                      error={errors.email}
                    />
                  </div>
                  <div className="border-div form-group w-100 mt-3 d-flex align-items-center">
                    <label htmlFor="phone">Phone</label>
                    <InputField
                      name="phone"
                      placeholder="Phone"
                      label="Phone"
                      isDisabled
                      error={errors.phone}
                    />
                  </div>

                  <div className="update-profile-pic mt-3 form-group w-100 mt-3 d-flex align-items-start">
                    <label>Your photo</label>
                    <div className="d-flex gap-3">
                      <img
                        src={loggedInUser.profile_pic || profile}
                        alt="Profile"
                        style={{
                          borderRadius: "50%",
                          objectFit: "cover",
                          width: 64,
                          height: 64,
                        }}
                      />

                      <div className="position-relative upload-container">
                        <input
                          accept="image/*"
                          className={"d-none"}
                          id="contained-button-file"
                          type="file"
                          onChange={(e) => _updateProfilePicutre(e)}
                        />
                        <label htmlFor="contained-button-file">
                          <div
                            className="text-center px-2 py-1"
                            style={{ cursor: "pointer" }}
                          >
                            <p className="mb-0">
                              Click to upload or drag and drop
                              <br />
                              SVG, PNG, JPG or GIF (max. 800x400px)
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
