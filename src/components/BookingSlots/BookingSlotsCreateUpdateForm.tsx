import { AxiosError } from "axios";
import bsCustomFileInput from "bs-custom-file-input";
import { Form, Formik } from "formik";
import moment from "moment";
import { useEffect } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { useMutation } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import { handleApiError } from "../../hooks/handleApiErrors";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import BackButton from "../../shared-components/BackButton";
import DatePicker from "../../shared-components/DatePicker";
import { InputField } from "../../shared-components/InputFeild";
import IsLoading from "../../shared-components/isLoading";
import API from "../../utils/API";

import { primaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";

import { showMsgToast } from "../../utils/showMsgToast";

const key = "disabled-slots";

const AvailableSlots = [
  {
    title: "10:00 - 11:00",
    value: "10",
  },
  {
    title: "11:00 - 12:00",
    value: "11",
  },
  {
    title: "12:00 - 1:00",
    value: "12",
  },
  {
    title: "1:00 - 2:00",
    value: "13",
  },
  {
    title: "2:00 - 3:00",
    value: "14",
  },
  {
    title: "3:00 - 4:00",
    value: "15",
  },
];

const createSlot = ({ formdata }: { formdata: any }) => {
  return API.post(`${key}`, formdata);
};

const SlotCreateUpdateForm = () => {
  const { state } = useLocation();
  const history = useHistory();
  const id = state ? (state as any).id : null;
  useEffect(() => {
    bsCustomFileInput.init();
  }, []);
  const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key });
  const { mutate, isLoading } = useMutation(createSlot, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries(key), 500);
      history.replace("/booking-slots");
      showMsgToast("Slot has been  disabled successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  if (dataLoading) return <IsLoading />;

  return (
    <>
      <BackButton title="Booking Slots" />
      <Row className="rounded">
        <Col className="mx-auto">
          <Formik
            enableReinitialize
            initialValues={{
              datetime: moment().format("YYYY-MM-DD"),
              reason: "",
              time_slot: "",
            }}
            onSubmit={(values) => {
              const formdata = {
                reason: values.reason,
                datetime: moment(values.datetime)
                  .set("hour", Number(values.time_slot))
                  .format("YYYY-MM-DD HH:mm:ss"),
              };

              // console.log({ formdata });

              mutate({ formdata });
            }}
          >
            {({ setFieldValue, values }) => (
              <Form>
                <div className="form-container ">
                  <InputField
                    name="reason"
                    placeholder="Reason"
                    label="Reason"
                    required
                  />
                  <DatePicker
                    name="datetime"
                    setFieldValue={setFieldValue}
                    label="Date"
                    pickerType="date"
                  />
                </div>
                <Container fluid className="px-0 ">
                  <div
                    className="card mx-auto w-50 view-padding"
                    style={{ width: "" }}
                  >
                    <p className="text-center text-muted">
                      Pick a slot to disable
                    </p>
                    <Row>
                      {AvailableSlots.map((slot) => (
                        <Col sm={6}>
                          <div
                            className="d-flex mx-auto p-2 align-items-center justify-content-center mt-2 w-100"
                            style={{
                              background:
                                values.time_slot === slot.value
                                  ? primaryColor
                                  : "#fff",
                              color:
                                values.time_slot === slot.value
                                  ? "#fff"
                                  : "#000",
                              border: `1px solid ${primaryColor}`,
                              borderRadius: 10,
                              // width: 200,
                            }}
                            onClick={() =>
                              setFieldValue("time_slot", slot.value)
                            }
                          >
                            <p className="text-center m-0">{slot.title}</p>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </Container>
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
            )}
          </Formik>
        </Col>
      </Row>
    </>
  );
};

export default SlotCreateUpdateForm;
