import { Form, Formik } from "formik";
import React from "react";
import { Alert, Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import { InputField } from "../../shared-components/InputFeild";
import IsLoading from "../../shared-components/isLoading";
import API from "../../utils/API";
import { queryClient } from "../../utils/queryClient";
import { Hammer } from "../ui/icon";

const key = "bookings";

const getAgents = async () => {
  const r = await API.get("/users", {
    params: {
      role: "agent",
    },
  });
  return r.data;
};

const assignAgent = ({
  formdata,
  id,
}: {
  formdata: { agent_id: string };
  id: string;
}) => {
  return API.post(`bookings/${id}/assign-agent`, formdata, {
    headers: { "Content-Type": "application/json" },
  });
};

const AssignAgent = () => {
  const { id }: { id: string } = useParams();

  const history = useHistory();
  const { data: agents, isLoading: isAgentLoading } = useQuery("agent", () =>
    getAgents()
  );
  const { data, mutate, isLoading, error, status } = useMutation(assignAgent, {
    onSuccess: (data) => {
      setTimeout(() => {
        queryClient.invalidateQueries(key);
        queryClient.invalidateQueries(`${key}/${id}`);
        history.goBack();
      }, 500);
    },
  });

  if (isAgentLoading) return <IsLoading />;

  return (
    <Container>
      <Container fluid className="d-flex justify-content-between py-2">
        <h2 className="font-weight-bold">Assign Aggent</h2>
        <Button variant="primary" onClick={() => history.goBack()}>
          <div className="text-white">
            <Hammer size={25} /> <b>Back</b>
          </div>
        </Button>
      </Container>

      <Row className="rounded">
        <Col className="mx-auto">
          <Formik
            initialValues={{ agent_id: "" }}
            onSubmit={(values) => {
              mutate({ formdata: values, id });
            }}
          >
            {({ setFieldValue }) => (
              <Form>
                {status === "success" && (
                  <Alert variant="success">Agent Successfully Assigned</Alert>
                )}
                {/* {error &&
                                <Alert variant="danger">{(error as Error).message}</Alert>
                            } */}

                <Row className="align-items-center justify-content-center">
                  <Col sm md={6}>
                    <InputField
                      name="agent_id"
                      placeholder="Select Agent"
                      label="Select Agent"
                      as="select"
                      selectData={agents.data}
                    />
                  </Col>
                </Row>

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
    </Container>
  );
};

export default AssignAgent;
