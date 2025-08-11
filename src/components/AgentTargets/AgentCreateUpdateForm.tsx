import { AxiosError } from "axios";
// Removed bs-custom-file-input
import { Form, Formik } from "formik";
import moment from "moment";
import { useEffect } from "react";
import { Button, Col, Row, Spinner } from "../ui/bootstrap-compat";
import { useMutation, useQuery } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import { handleApiError } from "../../hooks/handleApiErrors";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import { InputField } from "../../shared-components/InputFeild";
import IsLoading from "../../shared-components/isLoading";
import Restricted from "../../shared-components/Restricted";
import API from "../../utils/API";

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
  useEffect(() => {}, []);
  const { data, isLoading: dataLoading } = useGetSingleQuery({ id, key });
  const { mutate, isLoading } = useMutation(createUpdataTarget, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries(key), 500);
      queryClient.invalidateQueries("users");
      if (id) return showMsgToast("Target updated successfully");
      if (agentId) {
        history.goBack();
      } else {
        history.replace("/agent-targets");
      }
      showMsgToast("Target created successfully");
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const { data: Agents, isLoading: isAgentLoading } = useQuery<any>([
    "users",
    {
      role: "agent",
    },
  ]);

  const title = id ? "Update Target" : "Add Target";

  if (dataLoading) return <IsLoading />;

  return (
    <>
      <div className="card view-padding p-2 d-flex mt-3">
        {/* <BackButton title={title} /> */}
        <Row className="rounded">
          <Col className="mx-auto">
            <Formik
              enableReinitialize
              initialValues={
                data
                  ? {
                      ...data?.agent,
                      month: moment(data?.agent?.month).format("YYYY-MM"),
                      targetAchieved: data?.target_achieved,
                    }
                  : { agent_id: agentId }
              }
              onSubmit={(values) => {
                mutate({ formdata: values, id });
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
                    {id && (
                      <InputField
                        name="targetAchieved"
                        label="Achieved Target"
                        isDisabled={true}
                      />
                    )}
                  </div>

                  <Row className="d-flex justify-content-start">
                    <Col md="12">
                      <Restricted
                        to={id ? "update_agenttarget" : "create_agenttarget"}
                      >
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
      </div>
    </>
  );
};

export default TargetCreateUpdateForm;
