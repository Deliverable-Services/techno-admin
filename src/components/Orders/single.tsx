import { AxiosError } from "axios";
import moment from "moment";
import React, { useState } from "react";
import { Badge, Button, Col, Container, Form, Row } from "react-bootstrap";
import { BiArrowFromRight, BiDownload } from "react-icons/bi";
import { CgSandClock } from "react-icons/cg";
import { useMutation, useQuery } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import { ProgressBar, Step } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";
import { handleApiError } from "../../hooks/handleApiErrors";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import IsLoading from "../../shared-components/isLoading";
import API from "../../utils/API";
import { OrderStatus } from "../../utils/arrays";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import Map from "../../components/Map";

const key = "bookings";

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

const SingleOrder = () => {
  const { id }: { id: string } = useParams();
  const history = useHistory();
  const { data, isLoading, isFetching } = useGetSingleQuery({ id, key });

  const { mutate, isLoading: isAsigningLoading } = useMutation(assignAgent, {
    onSuccess: (data) => {
      showMsgToast("Agent assigned successfully");
      setTimeout(() => {
        queryClient.invalidateQueries(key);
        queryClient.invalidateQueries(`${key}/${id}`);
      }, 500);
    },
  });
  const [form, setForm] = useState({
    agent_id: data?.agent_id,
    status: data?.status,
  });

  const _onformChange = (idx: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [idx]: value,
    }));
  };

  const { data: Agents, isLoading: isAgentLoading } = useQuery<any>(
    [
      "users",
      1,
      {
        role: "agent",
      },
    ],
    {
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  const _onUserClick = (id: string) => {
    if (!id) return;
    history.push("/users/create-edit", { id });
  };

  const statusBadgeVairant = (status: string) => {
    const _status = status.toLowerCase();

    if (_status === "success") return "success";

    if (_status === "pending" || _status === "pending_payment")
      return "warning";

    return "danger";
  };

  if (isLoading || isFetching) {
    return <IsLoading />;
  }
  // console.log(data);
  return (
    <Container fluid className="component-wrapper px-0 py-2">
      <Container fluid className="d-flex justify-content-between py-2">
        <div className="d-flex align-items-center">
          <h2 className="font-weight-bold">Order</h2>
          <h2 className="ml-2">#{data.ref_id}</h2>
          <Badge variant="primary" className="mx-3 px-3 py-2 text-uppercase">
            {data.order_type}
          </Badge>
          <Badge
            variant={statusBadgeVairant(data.status)}
            className="px-3 py-2 text-uppercase"
          >
            {data.status}
          </Badge>
        </div>
        <div>
          <Button variant="success">
            <div className="text-white">
              <BiDownload size={24} /> <b>Invoice</b>
            </div>
          </Button>
          <Button className="ml-2" onClick={() => history.goBack()}>
            <div className="text-white">
              <BiArrowFromRight size={25} /> <b>Back</b>
            </div>
          </Button>
        </div>
      </Container>

      {data.cancellation_reason && (
        <Container fluid>
          <p className="text-danger">{data.cancellation_reason}</p>
        </Container>
      )}

      <div className="w-75 mx-auto">
        <ProgressBar
          filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
          percent={80}
        >
          <Step transition="scale">
            {({ accomplished, index }) => (
              <div
                className={`transitionStep ${accomplished ? "accomplished" : null
                  }`}
              >
                <CgSandClock />
              </div>
            )}
          </Step>

          <Step transition="scale">
            {({ accomplished, index }) => (
              <div
                className={`transitionStep ${accomplished ? "accomplished" : null
                  }`}
              >
                🌒
              </div>
            )}
          </Step>

          <Step transition="scale">
            {({ accomplished, index }) => (
              <div
                className={`transitionStep ${accomplished ? "accomplished" : null
                  }`}
              >
                🌓
              </div>
            )}
          </Step>

          <Step transition="scale">
            {({ accomplished, index }) => (
              <div
                className={`transitionStep ${accomplished ? "accomplished" : null
                  }`}
              >
                🌔
              </div>
            )}
          </Step>

          <Step transition="scale">
            {({ accomplished, index }) => (
              <div
                className={`transitionStep ${accomplished ? "accomplished" : null
                  }`}
              >
                🌕
              </div>
            )}
          </Step>
        </ProgressBar>
      </div>

      <div className="dashboard-page w-100">
        <Container fluid className="status-container mt-2">
          <div className="card p-2 view-padding right-div d-flex mb-3">
            <div className="d-flex flex-column">
              <div className="text-primary">
                <div
                  className="text-black pb-3"
                  style={{ cursor: "pointer", fontWeight: 600 }}
                  onClick={() => _onUserClick(data.user_id)}
                >
                  Update order status
                </div>
              </div>

              <hr className="mb-3" />

              <div className="d-flex flex-column" style={{ fontSize: 18 }}>
                <Row>
                  <Col md="auto">
                    <Form.Group>
                      <Form.Control
                        as="select"
                        value={form.status}
                        onChange={(e) => {
                          _onformChange("status", e.target.value);
                          // mutate({ formdata: { agent_id: e.target.value }, id })
                        }}
                        style={{
                          width: "200px",
                          fontSize: 14,
                        }}
                      >
                        <option value="" disabled>
                          Select Status
                        </option>
                        {OrderStatus.map((item) => {
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
                      Do note: Status should be changed by the agent from the
                      app, as it should be to avoid complection in the database.
                      Please try to avoid changing from here if possible.
                    </p>
                  </Col>
                </Row>
              </div>
            </div>
          </div>

          <div className="card p-2  view-padding right-div d-flex mb-3">
            <div className="d-flex flex-column">
              <div className="d-flex justify-content-between">
                <div
                  className="text-black pb-3"
                  style={{ cursor: "pointer", fontWeight: 600 }}
                  onClick={() => _onUserClick(data.user_id)}
                >
                  {!isLoading && !data?.agent_id
                    ? "Assign Agent"
                    : "Assigned Agent"}
                </div>

                <div className="text-primary small">Change Agent</div>
              </div>

              <hr className="mb-3" />

              <div className="d-flex flex-column" style={{ fontSize: 18 }}>
                {!isLoading && !data?.agent_id && (
                  <Col md="auto">
                    <Form.Group>
                      <Form.Control
                        as="select"
                        value={form.agent_id || ""}
                        onChange={(e) => {
                          _onformChange("agent_id", e.target.value);
                          mutate({
                            formdata: { agent_id: e.target.value },
                            id,
                          });
                        }}
                        style={{
                          width: "200px",
                          fontSize: 14,
                        }}
                      >
                        <option value="">Select Agent</option>
                        <option value="2"> agent</option>
                        {!isAgentLoading &&
                          Agents?.data.map((item) => (
                            <option value={item["id"]}>{item["name"]}</option>
                          ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                )}

                {data.agent && (
                  <>
                    <table className="w-100">
                      <tbody>
                        <tr>
                          <td className="text-muted">
                            <p className="view-heading">Name</p>
                          </td>
                          <td className="text-right">
                            <p className="view-subheading">{data.agent.name}</p>
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted ">
                            <p className="view-heading">Email</p>
                          </td>
                          <td className="text-primary  font-weight-bold text-right">
                            <p className="view-subheading">
                              {data.agent.email}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted ">
                            <p className="view-heading phone-padd">Phone</p>
                          </td>
                          <td className="text-primary  font-weight-bold text-right">
                            <p className="view-subheading">
                              {data.agent.phone}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <span className="small text-primary font-weight-bold">
                      View Profile
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="card p-2 view-padding right-div d-flex">
            <div className="d-flex flex-column">
              <div className="text-primary">
                <div className="d-flex justify-content-between">
                  <div
                    className="text-black pb-3"
                    style={{ cursor: "pointer", fontWeight: 600 }}
                    onClick={() => _onUserClick(data.user_id)}
                  >
                    Customer
                  </div>

                  <div className="text-primary small">Edit Info</div>
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
                        <p className="view-subheading">{data.user.name}</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted ">
                        <p className="view-heading">Email</p>
                      </td>
                      <td className="text-primary  font-weight-bold text-right">
                        <a href={`mailto:${data.user.email}`}>
                          <p className="view-subheading text-primary">
                            {data.user.email}
                          </p>
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted ">
                        <p className="view-heading phone-padd">Phone</p>
                      </td>
                      <td className="text-primary  font-weight-bold text-right">
                        <p className="view-subheading">{data.user.phone}</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <span className="small text-primary font-weight-bold">
                  View Profile
                </span>
              </div>

              <hr className="mb-3 mt-3" />
              {
                data?.address ?
                  <div className="d-flex flex-column" style={{ fontSize: 18 }}>
                    <p className="view-heading font-weight-bold">Billing Address</p>
                    <p className="view-subheading">
                      {data.address.address}
                      {", "}
                      {data.address.city}
                      {", "}
                      {data.address.pincode}{" "}
                    </p>
                  </div> :
                  <p className="view-subheading">Billing Address not available</p>
              }

              <hr className="mb-3 mt-2" />
              {
                data?.address &&
                <div className="d-flex flex-column" style={{ fontSize: 18 }}>
                  <p className="view-heading font-weight-bold">
                    Shipping Address
                  </p>
                  <p className="view-subheading">
                    {data.address.address}
                    {", "}
                    {data.address.city}
                    {", "}
                    {data.address.pincode}{" "}
                  </p>
                </div>
              }
            </div>
          </div>
        </Container>

        <Container fluid className="charts-container">
          <div className="card view-padding p-2 d-flex mt-3">
            <div className="d-flex flex-column">
              <div
                style={{ width: "100%", height: "350px", position: "relative" }}
              >
                <Map order={data} />
              </div>
            </div>
          </div>

          <div className="card view-padding p-2 d-flex mt-3">
            <div className="d-flex flex-column">
              <div className="text-primary">
                <div className="d-flex justify-content-between">
                  <div
                    className="text-black pb-3"
                    style={{ cursor: "pointer", fontWeight: 600 }}
                    onClick={() => _onUserClick(data.user_id)}
                  >
                    Summary
                  </div>
                </div>
              </div>
              <hr className="mb-3" />
              <div
                className="d-flex flex-column w-100"
                style={{ fontSize: 18 }}
              >
                <table className="w-100">
                  <tbody>
                    {data.vehicle && (
                      <>
                        <tr>
                          <td className="view-heading py-2">Pick-up Vehicle</td>
                          <td className="view-subheading py-2 text-right">
                            {data.vehicle.name}
                          </td>
                        </tr>
                        <tr>
                          <td className="view-heading py-2">Vehicle Number</td>
                          <td className="view-subheading py-2 text-right">
                            {data.vehicle.name}
                          </td>
                        </tr>
                      </>
                    )}

                    <tr>
                      <td className="text-muted ">
                        <p className="view-heading">Scheduled At</p>
                      </td>

                      <td className="text-primary  font-weight-bold text-right">
                        <p className="view-subheading">
                          {data.scheduled_at
                            ? moment(data.scheduled_at).format(
                              "DD/MM/YY(hh:mm)"
                            )
                            : "-"}
                        </p>
                      </td>
                    </tr>

                    <tr>
                      <td className="text-muted ">
                        <p className="view-heading">Picked At</p>
                      </td>

                      <td className="text-primary  font-weight-bold text-right">
                        <p className="view-subheading">
                          {data.picked_at
                            ? moment(data.picked_at).format("DD/MM/YY(hh:mm)")
                            : "-"}
                        </p>
                      </td>
                    </tr>

                    <tr>
                      <td className="text-muted ">
                        <p className="view-heading">Closed At</p>
                      </td>

                      <td className="text-primary  font-weight-bold text-right">
                        <p className="view-subheading">
                          {data.closed_at
                            ? moment(data.closed_at).format("DD/MM/YY(hh:mm)")
                            : "-"}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="card view-padding p-2 d-flex mt-3">
            <div className="d-flex flex-column">
              <div className="text-primary">
                <div className="d-flex justify-content-between">
                  <div
                    className="text-black pb-3"
                    style={{ cursor: "pointer", fontWeight: 600 }}
                    onClick={() => _onUserClick(data.user_id)}
                  >
                    Services Details
                  </div>
                </div>
              </div>

              <hr className="mb-3" />

              <div
                className="d-flex flex-column w-100"
                style={{ fontSize: 18 }}
              >
                {/* #TODO: Add list of services. */}
                <table className="w-100">
                  <tbody>
                    <tr>
                      <td className="view-heading">Total Cost</td>
                      <td className="text-right">
                        <p className="view-subheading">₹{data.total_cost}</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="view-heading">Discount</td>
                      <td className="text-success font-weight-bold text-right">
                        <p className="view-subheading">₹{data.discount}</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="view-heading pt-3">
                        Total Payable Amount
                      </td>
                      <td
                        className="text-primary pt-2 font-weight-bold text-right"
                        style={{ fontSize: "24px" }}
                      >
                        <p className="view-subheading">
                          ₹{data.payable_amount}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {data?.services?.length ? (
            <div className="card view-padding p-2 d-flex mt-3">
              <div className="d-flex flex-column">
                <div className="view-heading  view-top-pad">
                  Requested Services
                </div>
                <div
                  className="d-flex flex-column w-100"
                  style={{ fontSize: 18 }}
                >
                  <table className="w-100">
                    <tbody>
                      {data.services.map((service) => (
                        <tr>
                          <td className="view-heading">{service.name}</td>
                          <td className="text-right">
                            <p className="view-subheading">₹{service.cost}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : null}

          {data.plan && (
            <div className="card p-2 d-flex mt-3">
              <div className="d-flex flex-column">
                <div className="text-primary">
                  <h5>Plan</h5>
                </div>
                <div
                  className="d-flex flex-column w-100"
                  style={{ fontSize: 18 }}
                >
                  <table className="w-100">
                    <tbody>
                      <tr>
                        <td className="view-heading">Name</td>
                        <td className="view-subheading font-weight-bold text-right">
                          {data.plan.name}
                        </td>
                      </tr>
                      <tr>
                        <td className="view-heading py-2">Description</td>
                        <td className="view-subheading font-weight-light text-capitalize">
                          {data.plan.description}
                        </td>
                      </tr>
                      <tr>
                        <td className="view-heading pt-3">Price</td>
                        <td
                          className="view-subheading pt-2 font-weight-bold text-right"
                          style={{ fontSize: "24px" }}
                        >
                          ₹{data.plan.price}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </Container>
      </div>
    </Container>
  );
};

export default SingleOrder;
