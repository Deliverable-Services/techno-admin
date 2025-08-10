import { Formik, Form } from "formik";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import * as Yup from "yup";
import { AxiosError } from "axios";
import API from "../../utils/API";
import { handleApiError } from "../../hooks/handleApiErrors";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import { useMutation } from "react-query";
import { useHistory } from "react-router-dom";
import { InputField } from "../../shared-components/InputFeild";
import dayjs from "dayjs";

const MeetingSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  timezone: Yup.string().required("Timezone is required"),
  date: Yup.string().required("Date is required"),
  time_from: Yup.string().required("Start time is required"),
  time_to: Yup.string().required("End time is required"),
  location: Yup.string().required("Location is required"),
  meet_link: Yup.string()
    .url("Invalid URL. e.g. https://letsmeetandchat.com")
    .required("Meeting link is required"),
  description: Yup.string().required("Description is required"),
  color: Yup.string().required("Color is required"),
  reminder_before_minutes: Yup.number()
    .min(0, "Must be positive")
    .required("Reminder time is required"),
});

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const key = "meetings";

const scheduleMeeting = ({ formdata, id }: { formdata: any; id: any }) => {
  if (id) {
    return API.put(`${key}/${id}`, formdata);
  }
  return API.post(`${key}`, formdata);
};

const CreateUpdateMeeting = ({ _toggleModal, prefillData }) => {
  const history = useHistory();
  const { mutate, isLoading } = useMutation(scheduleMeeting, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries(key), 500);
      _toggleModal();
      showMsgToast("Slot has been  disabled successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const isEditMode = !!prefillData?.id;

  const initialValues = {
    title: prefillData?.title || "",
    date: isEditMode
      ? dayjs(prefillData?.date).format("YYYY-MM-DD")
      : prefillData?.date || dayjs().format("YYYY-MM-DD"),
    time_from: isEditMode
      ? dayjs(prefillData?.time_from).format("HH:mm")
      : prefillData?.time_from || dayjs().format("HH:mm"),
    time_to: isEditMode
      ? dayjs(prefillData?.time_to).format("HH:mm")
      : prefillData?.time_to || dayjs().add(1, "hour").format("HH:mm"),
    // date: prefillData?.date || dayjs().format("YYYY-MM-DD"),
    // time_from: prefillData?.time_from || dayjs().format("HH:mm"),
    // time_to: prefillData?.time_to || dayjs().add(1, "hour").format("HH:mm"),
    timezone: prefillData?.timezone || "Asia/Calcutta",
    location: prefillData?.location || "",
    meet_link: prefillData?.meet_link || "",
    description: prefillData?.description || "",
    color: prefillData?.color || getRandomColor(),
    reminder_before_minutes: prefillData?.reminder_before_minutes || 10,
    created_by_id: prefillData?.created_by_id || 1,
    created_by_type: prefillData?.created_by_type || "admin",
  };

  return (
    <Row className="rounded">
      <Col className="mx-auto">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={MeetingSchema}
          onSubmit={(values) => {
            if (isEditMode) {
              mutate({ formdata: values, id: prefillData.id });
            } else {
              mutate({ formdata: values, id: null });
            }
          }}
        >
          {({ values, handleChange, setFieldValue, errors }) => {
            const today = dayjs().format("YYYY-MM-DD");
            const now = dayjs();

            const isToday = values.date === today;
            const currentTime = now.format("HH:mm");
            const minStartTime = isToday ? currentTime : "00:00";
            const minEndTime = values.time_from || minStartTime;

            return (
              <Form className="space-y-4 max-w-lg">
                <div className="form-container  py-2 ">
                  <InputField
                    name="title"
                    placeholder="Title"
                    label="Title"
                    required
                  />
                  <InputField
                    name="date"
                    placeholder="Date"
                    label="Date"
                    type="date"
                    error={errors.date as string}
                    value={values.date}
                    onChange={handleChange}
                    required
                  />

                  <InputField
                    name="time_from"
                    placeholder="Start"
                    label="Start From"
                    value={values.time_from}
                    min={minStartTime}
                    onChange={handleChange}
                    error={errors.time_from as string}
                    type="time"
                    required
                  />
                  <InputField
                    name="time_to"
                    placeholder="End"
                    label="To"
                    type="time"
                    value={values.time_to}
                    min={minEndTime}
                    onChange={handleChange}
                    error={errors.time_to as string}
                    required
                  />

                  <InputField
                    name="location"
                    placeholder="Location"
                    label="Location"
                    required
                  />
                  <InputField
                    name="meet_link"
                    placeholder="Meeting Link"
                    label="Meeting Link"
                    error={errors.meet_link as string}
                    required
                  />
                  <Row>
                    <Col md={12} xl={12}>
                      <InputField
                        name="description"
                        placeholder="Description"
                        label="Description"
                        as="textarea"
                        required
                      />
                    </Col>
                  </Row>

                  <InputField
                    name="color"
                    placeholder="Color"
                    label="Color"
                    type="color"
                    error={errors.color as string}
                    required
                  />
                  <InputField
                    name="reminder_before_minutes"
                    placeholder="Reminder Before"
                    label="Reminder before"
                    type="number"
                    required
                  />
                </div>

                <Row className="d-flex justify-content-start mt-2">
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
            );
          }}
        </Formik>
      </Col>
    </Row>
  );
};

export default CreateUpdateMeeting;
