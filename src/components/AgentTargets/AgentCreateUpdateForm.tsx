import { AxiosError } from "axios";
import bsCustomFileInput from "bs-custom-file-input";
import { Form, Formik } from "formik";
import moment from "moment";
import { useEffect } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import { handleApiError } from "../../hooks/handleApiErrors";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import BackButton from "../../shared-components/BackButton";
import { InputField } from "../../shared-components/InputFeild";
import IsLoading from "../../shared-components/isLoading";
import API from "../../utils/API";
import { isActiveArray } from "../../utils/arrays";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";

const key = "create-target";

const createUpdataTarget = ({
  formdata,
  id,
}: {
  formdata: any;
  id: string;
}) => {
  if (!id) {
    return API.post(`${key}`, formdata);
  }

  return API.post(`update-target/${id}`, formdata);
};

const TargetCreateUpdateForm = () => {
  const { state } = useLocation();
  const history = useHistory();
  const id = state ? (state as any).id : null;
  const agentId = state ? (state as any).agent_id : null;
  useEffect(() => {
    bsCustomFileInput.init();
  }, []);
  const {
    data,
    isLoading: dataLoading,
    isFetching,
  } = useGetSingleQuery({ id, key });
  const { mutate, isLoading } = useMutation(createUpdataTarget, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries(key), 500);
      if (agentId) {
        history.goBack();
      } else {
        history.replace("/agent-targets");
      }
      if (id) return showMsgToast("Target updated successfully");
      showMsgToast("Target created successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const { data: Agents, isLoading: isAgentLoading } = useQuery<any>([
    "users",
    ,
    {
      role: "agent",
    },
  ]);

  const title = id ? "Update Target" : "Add Target";

  if (dataLoading) return <IsLoading />;

  return (
    <>
      <div className="card view-padding p-2 d-flex mt-3">
        <BackButton title={title} />
        <Row className="rounded">
          <Col className="mx-auto">
            <Formik
              enableReinitialize
              initialValues={
                data
                  ? {
                      ...data,
                      month: moment(data.month).format("YYYY-MM"),
                    }
                  : { agent_id: agentId }
              }
              onSubmit={(values) => {
                const m = moment(values.month).format("MMMM YYYY");
                console.log({ values, m });
                mutate({ formdata: { ...values, month: m }, id });
              }}
            >
              {({ setFieldValue }) => (
                <Form>
                  <div className="form-container ">
                    <InputField
                      name="target"
                      placeholder="Target"
                      label="Target"
                      required
                    />
                    <InputField
                      name="agent_id"
                      placeholder="Select Agent"
                      label="Agent"
                      as="select"
                      selectData={!isAgentLoading && Agents.data}
                      required
                      isDisabled={!!id}
                    />
                    <InputField
                      name="month"
                      label="Month"
                      type="month"
                      required
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
      </div>
    </>
  );
};

export default TargetCreateUpdateForm;
