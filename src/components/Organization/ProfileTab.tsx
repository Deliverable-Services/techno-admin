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
    <div>
      {/* Section Header */}
      <div className="section-header">
        <h4>Personal Information</h4>
        <p>Update your photo and personal details here.</p>
      </div>

      {/* Form Content */}
      <Formik
        enableReinitialize
        initialValues={loggedInUser}
        onSubmit={(values) => {
          const formdata = {
            name: values.name,
            email: values.email,
          };
          mutate({ formdata });
        }}
        validationSchema={ValidationSchema}
      >
        {({ errors }) => (
          <Form>
            {/* Form Grid */}
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <InputField
                    name="name"
                    placeholder="Enter your full name"
                    error={errors.name}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <InputField
                    name="email"
                    placeholder="Enter your email address"
                    error={errors.email}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <InputField
                    name="phone"
                    placeholder="Enter your phone number"
                    isDisabled
                    error={errors.phone}
                  />
                  <small className="text-muted">
                    Phone number cannot be changed
                  </small>
                </div>
              </div>
            </div>

            {/* Profile Photo Section */}
            <div className="form-group">
              <label>Profile Photo</label>
              <div className="d-flex align-items-start gap-4">
                <img
                  src={loggedInUser.profile_pic || profile}
                  alt="Profile"
                  style={{
                    borderRadius: "12px",
                    objectFit: "cover",
                    width: 80,
                    height: 80,
                    border: "3px solid #f0f0f0",
                  }}
                />
                <div className="flex-grow-1">
                  <div
                    className="upload-container"
                    style={{ maxWidth: "300px" }}
                  >
                    <input
                      accept="image/*"
                      className={"d-none"}
                      id="contained-button-file"
                      type="file"
                      onChange={(e) => _updateProfilePicutre(e)}
                    />
                    <label
                      htmlFor="contained-button-file"
                      className="w-100 h-100 d-flex align-items-center justify-content-center"
                    >
                      <div className="text-center">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          className="mb-2"
                        >
                          <path
                            d="M6.66667 13.3333L9.16667 10.8333L10.8333 12.5L13.3333 9.16667L16.6667 13.3333H3.33333L6.66667 13.3333Z"
                            stroke="#667085"
                            strokeWidth="1.67"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M13.3333 6.66667H13.3417"
                            stroke="#667085"
                            strokeWidth="1.67"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p
                          className="mb-1"
                          style={{ fontSize: "14px", color: "#667085" }}
                        >
                          <span style={{ color: "#0b64fe", fontWeight: "600" }}>
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </p>
                        <p
                          className="mb-0"
                          style={{ fontSize: "12px", color: "#98A2B3" }}
                        >
                          SVG, PNG, JPG or GIF (max. 800x400px)
                        </p>
                      </div>
                    </label>
                  </div>
                  {isImageLoading && (
                    <div className="mt-2">
                      <small className="text-muted">
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Uploading image...
                      </small>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex justify-content-end gap-3 mt-4 pt-4 border-top">
              <Button
                variant="outline-primary"
                type="button"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isLoading}
                className="px-4"
              >
                {isLoading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProfileTab;
