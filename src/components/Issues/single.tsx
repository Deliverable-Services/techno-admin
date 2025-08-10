import moment from "moment";
import React, { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { useMutation } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import BackButton from "../../shared-components/BackButton";
import IsLoading from "../../shared-components/isLoading";
import Restricted from "../../shared-components/Restricted";
import API from "../../utils/API";
import { IssueStatus } from "../../utils/arrays";
import { primaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import ChatBox from "./ChatBox";
import { Hammer } from "../ui/icon";

const key = "tickets";
const dateFormat = "DD MMMM YY (hh:mm a)";

const changeStatus = ({
  formdata,
  id,
}: {
  formdata: { status: string };
  id: any;
}) => {
  return API.post(`${key}/${id}/update-status`, formdata, {
    headers: { "Content-Type": "application/json" },
  });
};

const SingleIssue = () => {
  const { id }: { id: string } = useParams();
  const history = useHistory();
  const { data, isLoading, isFetching } = useGetSingleQuery({ id, key });

  const { mutate, isLoading: isChangeStatusLoading } = useMutation(
    changeStatus,
    {
      onSuccess: (data) => {
        showMsgToast("Status changed successfully");
        setTimeout(() => {
          queryClient.invalidateQueries(key);
          queryClient.invalidateQueries(`${key}/${id}`);
        }, 500);
      },
    }
  );
  const [form, setForm] = useState({
    status: data?.status,
  });

  const _onformChange = (idx: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [idx]: value,
    }));
  };

  const _onUserClick = (id: string) => {
    if (!id) return;
    history.push("/users/create-edit", { id });
  };
  const _onOrderClick = (id: string) => {
    if (!id) return;
    history.push(`/orders/${id}`);
  };

  const statusBadgeVairant = (status: string) => {
    const _status = status.toLowerCase();

    if (_status.includes("error") || _status.includes("cancelled"))
      return "danger";

    if (
      _status.includes("pending") ||
      _status.includes("delay") ||
      _status.includes("hold")
    )
      return "warning";

    return "success";
  };

  if (isLoading || isFetching) {
    return <IsLoading />;
  }

  if (!data && (!isLoading || !isFetching)) {
    return (
      <Container fluid className="d-flex justify-content-center display-3">
        <div className="d-flex flex-column align-items-center">
          <Hammer color={primaryColor} />
          <span className="text-primary display-3">Something went wrong</span>
        </div>
      </Container>
    );
  }
  return (
    <Container fluid className="component-wrapper ">
      <BackButton title={`Issue #${data?.id}`} />
      {/* <Container fluid className="d-flex justify-content-between py-2">
        <div className="d-flex align-items-center">
          <h2 className="font-weight-bold">Issue</h2>
          <h2 className="ml-2">#{data?.id}</h2>
        </div>
        <div>
          <Button className="ml-2" onClick={() => history.goBack()}>
            <div className="text-white">
              <BiArrowFromRight size={25} /> <b>Back</b>
            </div>
          </Button>
        </div>
      </Container> */}

      <div className="dashboard-page w-100 ">
        <Container fluid className="status-container mt-2 px-0">
          <Restricted to="update_ticket">
            <div className="d-flex flex-column">
              <div className="text-primary">
                <div
                  className="text-black pb-3"
                  style={{ cursor: "pointer", fontWeight: 600 }}
                  onClick={() => _onUserClick(data?.user_id)}
                >
                  Update Issue status
                </div>
              </div>

              <hr className="mb-3" />

              <div className="d-flex flex-column" style={{ fontSize: 18 }}>
                <Row>
                  <Col md="auto">
                    <Form.Group>
                      <Form.Control
                        as="select"
                        value={data?.status}
                        onChange={(e) => {
                          _onformChange("status", e.target.value);
                          mutate({ formdata: { status: e.target.value }, id });
                        }}
                        style={{
                          width: "200px",
                          fontSize: 14,
                        }}
                      >
                        {IssueStatus.map((item) => {
                          if (item.id !== "")
                            return (
                              <option value={item["id"]}>{item["name"]}</option>
                            );
                        })}
                      </Form.Control>
                    </Form.Group>

                    <p
                      style={{ fontSize: 13, lineHeight: 1.3, marginBottom: 5 }}
                      className="text-muted"
                    >
                      {/* Do note: */}
                    </p>
                  </Col>
                </Row>
              </div>
            </div>
          </Restricted>
          <div className="card  view-padding right-div d-flex mb-3"></div>
          <div className="card p-2 view-padding right-div d-flex mb-3">
            <div className="d-flex flex-column">
              <div className="text-primary">
                <div
                  className="text-black pb-3"
                  style={{ cursor: "pointer", fontWeight: 600 }}
                  onClick={() => _onUserClick(data?.user_id)}
                >
                  Issue Info
                </div>
              </div>

              <hr className="mb-3" />

              <div className="d-flex flex-column" style={{ fontSize: 18 }}>
                <Row>
                  <Col md="auto" className="w-100">
                    <p className="font-weight-bold mb-1">{data?.title}</p>
                    <p
                      style={{ fontSize: 13, lineHeight: 1.3, marginBottom: 5 }}
                      className="text-muted"
                    >
                      {data?.description}
                    </p>
                    <table className="w-100 ">
                      <tbody>
                        <tr>
                          <td className="text-muted">
                            <p className="view-heading">Order</p>
                          </td>
                          <td className="text-right">
                            <p
                              className="view-subheading text-primary"
                              style={{ cursor: "pointer" }}
                              onClick={() => _onOrderClick(data?.order_id)}
                            >
                              {data.order_id || "NA"}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted">
                            <p className="view-heading">Related To</p>
                          </td>
                          <td className="text-right">
                            <p className="view-subheading">
                              {data?.related_to}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted">
                            <p className="view-heading">Updated At</p>
                          </td>
                          <td className="text-right">
                            <p className="view-subheading">
                              {moment(data?.updated_at).format(dateFormat)}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted">
                            <p className="view-heading">Created At</p>
                          </td>
                          <td className="text-right">
                            <p className="view-subheading">
                              {moment(data?.created_at).format(dateFormat)}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Col>
                </Row>
              </div>
            </div>
          </div>

          <div className="card p-2 view-padding right-div d-flex">
            <div className="d-flex flex-column">
              <div className="text-primary">
                <div className="d-flex justify-content-between">
                  <div className="text-black pb-3">Customer</div>
                </div>
              </div>

              <hr className="mb-3" />

              <div className="d-flex flex-column" style={{ fontSize: 18 }}>
                <table className="w-100">
                  <tbody>
                    <tr>
                      <td className="text-muted">
                        <p className="view-heading">Name</p>
                      </td>
                      <td className="text-right">
                        <p className="view-subheading">{data?.user.name}</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted ">
                        <p className="view-heading">Email</p>
                      </td>
                      <td className="text-primary  font-weight-bold text-right">
                        <a href={`mailto:${data?.user.email}`}>
                          <p className="view-subheading text-primary">
                            {data?.user?.email}
                          </p>
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted ">
                        <p className="view-heading phone-padd">Phone</p>
                      </td>
                      <td className="text-primary  font-weight-bold text-right">
                        <p className="view-subheading">{data?.user?.phone}</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <Restricted to="read_user">
                  <span
                    className="small text-primary font-weight-bold"
                    style={{ cursor: "pointer" }}
                    onClick={() => _onUserClick(data?.user_id)}
                  >
                    View Profile
                  </span>
                </Restricted>
              </div>

              <hr className="mb-3 mt-3" />
            </div>
          </div>
        </Container>
        <Restricted to="update_ticket">
          <Container fluid className="charts-container">
            <ChatBox initialMessages={data?.messages} id={id} />
          </Container>
        </Restricted>
      </div>
    </Container>
  );
};

export default SingleIssue;
