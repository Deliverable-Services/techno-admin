import { AxiosError } from "axios";
import moment from "moment";
import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { AiFillPlusSquare } from "react-icons/ai";
import { BiArrowFromRight, BiDownload, BiSad } from "react-icons/bi";
import { GoArrowLeft } from "react-icons/go";
import { useMutation, useQuery } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import "react-step-progress-bar/styles.css";
import Map from "../../components/Map";
import { handleApiError } from "../../hooks/handleApiErrors";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import CustomBadge from "../../shared-components/CustomBadge";
import IsLoading from "../../shared-components/isLoading";
import Restricted from "../../shared-components/Restricted";
import API from "../../utils/API";
import { OrderStatus } from "../../utils/arrays";
import { primaryColor } from "../../utils/constants";
import { queryClient } from "../../utils/queryClient";
import renderHTML from "../../utils/renderHTML";
import { showErrorToast } from "../../utils/showErrorToast";
import { showMsgToast } from "../../utils/showMsgToast";
import ProgressBar from "./ProgressBar";
import { config } from "../../utils/constants";

const key = "bookings";
const dateFormat = "DD MMMM YY (hh:mm a)";


function saveAsFile(blog, filename = "jobcard.pdf") {
  const url = window.URL.createObjectURL(new Blob([blog],{type: "octet/stream"}));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
}


const assignAgent = ({
  formdata,
  id,
}: {
  formdata: { agent_id: string; date: string; time: string };
  id: string;
}) => {
  return API.post(`bookings/${id}/assign-agent`, formdata, {
    headers: { "Content-Type": "application/json" },
  });
};

const updateOrderStatus = ({ formdata, id }: { formdata: any; id: string }) => {
  return API.post(`${key}/${id}/update-status`, formdata, {
    headers: { "Content-Type": "application/json" },
  });
};

const SingleOrder = () => {
  const { id }: { id: string } = useParams();
  const history = useHistory();
  const [showAssignAgent, setShowAssignAgent] = useState(false);
  const { data, isLoading, isFetching } = useGetSingleQuery({ id, key });
  const [isDownloadingInvoice, setIsDownloadingInvoice] = useState(false);
  const [isDownloadingJobCard, setIsDownloadingJobCard] = useState(false);

  // const { data: Invoice, isLoading: isInvoiceLoading } = useQuery<any>(
  //   [`${key}/${15}/download-invoice`],
  //   {
  //     // enabled: !!data?.transaction?.id,
  //   }
  const _onDownloadInvoice = async (id) => {
    setIsDownloadingInvoice(true);
    try {
      const res = await API.get("/bookings/" + id + "/download-invoice", {
        headers: {
          "Content-Type": "application/pdf",
        },
      });
      if (res) console.log({ res });
    } catch (error) {
      handleApiError(error, history);
    } finally {
      setIsDownloadingInvoice(false);
    }
  };

  const _onDownloadJobCard = async (id) => {
    setIsDownloadingJobCard(true);
    try {
      const res = await API.get("/job-card-pdf/" + id, {
        headers: {
          "Content-Type": "application/pdf",
        },
      });
      if (res) saveAsFile(res);
    } catch (error) {
      handleApiError(error, history);
    } finally {
      setIsDownloadingJobCard(false);
    }
  };

  // );

  const { mutate, isLoading: isAsigningLoading } = useMutation(assignAgent, {
    onSuccess: (data) => {
      if (!data.data.data) {
        showErrorToast(data.data.message);
        return;
      }
      _onformChange("agent_id", data?.data?.data?.agent_id);
      showMsgToast(data.data.message);
      setTimeout(() => {
        queryClient.invalidateQueries(key);
        queryClient.invalidateQueries(`${key}/${id}`);
      }, 500);
    },
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });
  const { mutate: mutateOrderStatus, isLoading: isOrderStatusMutateLoading } =
    useMutation(updateOrderStatus, {
      onSuccess: (data) => {
        showMsgToast("Order Status  updated successfully");
        setTimeout(() => {
          queryClient.invalidateQueries(key);
          queryClient.invalidateQueries(`${key}/${id}`);
        }, 500);
      },
      onError: (error: AxiosError) => {
        handleApiError(error, history);
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
    setShowAssignAgent(false);
  };

  const { data: Agents, isLoading: isAgentLoading } = useQuery<any>(
    [
      "users",
      ,
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

  const _onCreateIssueClick = () => {
    history.push("/issues/create-edit", {
      id: data?.user_id,
      order_id: id,
      ref_id: data?.ref_id,
    });
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
          <BiSad color={primaryColor} />
          <span className="text-primary display-3">Something went wrong</span>
        </div>
      </Container>
    );
  }
  // console.log(data);
  return (
    <Container fluid className="component-wrapper px-0 py-2">
       <Button className="ml-2 back-btn" onClick={() => history.goBack()} size="sm">
            <div className="d-flex align-items-center">
              <GoArrowLeft/> <p className="ml-1 mb-0">Back</p>
            </div>
          </Button>
      <Container
        fluid
        className="d-flex justify-content-between py-2 flex-column flex-md-row"
      >
        
        <div className="d-flex align-md-items-center flex-column flex-md-row">
          <div className="d-flex align-items-center mb-1 mb-md-0">
            <p className=" mb-0">Order</p>
            <p className="lead mx-2 mb-0 font-weight-bold">#{data.ref_id}</p>
          </div>
          <div className="d-flex">
            <CustomBadge title={data.order_type} variant="primary" />
            <span className="mx-2 my-1 my-md-0"></span>
            <CustomBadge
              title={data.status}
              variant={statusBadgeVairant(data.status)}
            />
          </div>
        </div>
        <div className="mt-1 mt-md-0">
          <Button
            size="sm"
            className="btn-border"
            // onClick={() => _onDownloadJobCard(id)}
            disabled={isDownloadingJobCard}
          >
            {isDownloadingJobCard ? (
              <p className="text-white m-0">Downloading...</p>
            ) : (
              <div className=" d-flex align-items-center text-white gap-3">
                <BiDownload size={18} />

                <a target="_blank" href={ config.adminApiBaseUrl + "job-card-pdf/" + id }>Job Card</a>
              </div>
            )}
          </Button>
          {!isLoading && data.transaction && data.transaction.length > 0 && (
            <Button
              size="sm"
              variant="success"
              onClick={() => _onDownloadInvoice(data?.transaction[0]?.id)}
              disabled={isDownloadingInvoice}
            >
              {isDownloadingInvoice ? (
                <p className="text-white m-0">Downloading...</p>
              ) : (
                <div className=" d-flex align-items-center text-white gap-3">
                  <BiDownload size={18} />

                  <p className="mb-0 ml-1">Invoice</p>
                </div>
              )}
            </Button>
          )}
          <Restricted to="create_ticket">
            <Button
              size="sm"
              className="ml-2"
              onClick={() => _onCreateIssueClick()}
            >
              <div className="d-flex text-white align-items-center">
                <AiFillPlusSquare size={18} />{" "}
                <p className="mb-0 ml-1">Issue</p>
              </div>
            </Button>
          </Restricted>

         
        </div>
      </Container>

      {data.cancellation_reason && (
        <Container fluid>
          <p className="text-danger">{data.cancellation_reason}</p>
        </Container>
      )}

      <div className="w-75 mx-auto">
        <ProgressBar orderStatus={data?.status} />
      </div>

      <div className="dashboard-page w-100">
        <Container fluid className="status-container mt-2">
          <Restricted to="update_order">
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
                          value={data?.status}
                          onChange={(e) => {
                            _onformChange("status", e.target.value);
                            mutateOrderStatus({
                              formdata: { status: e.target.value },
                              id,
                            });
                          }}
                          style={{
                            width: "200px",
                            fontSize: 14,
                          }}
                        >
                          {OrderStatus.map((item) => {
                            if (item.id !== "")
                              return (
                                <option value={item["id"]}>
                                  {item["name"]}
                                </option>
                              );
                          })}
                        </Form.Control>
                      </Form.Group>

                      <p
                        style={{
                          fontSize: 13,
                          lineHeight: 1.3,
                          marginBottom: 5,
                        }}
                        className="text-muted"
                      >
                        Do note: Status should be changed by the agent from the
                        app, as it should be to avoid complection in the
                        database. Please try to avoid changing from here if
                        possible.
                      </p>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Restricted>

          <Restricted to="assign_agent">
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

                  <div
                    className="text-primary small"
                    onClick={() => setShowAssignAgent(!showAssignAgent)}
                  >
                    {showAssignAgent && data?.agent_id
                      ? "Close"
                      : "Assign agent"}
                  </div>
                </div>

                <hr className="mb-3" />

                <div className="d-flex flex-column" style={{ fontSize: 18 }}>
                  {!isLoading && (!data?.agent_id || showAssignAgent) && (
                    <Col md="auto">
                      <Form.Group>
                        <Form.Control
                          as="select"
                          value={form.agent_id || ""}
                          onChange={(e) => {
                            const date = moment(data.scheduled_at).format(
                              "YYYY-MM-DD"
                            );
                            const time = moment(data.scheduled_at).format(
                              "hh:mm:ss"
                            );
                            mutate({
                              formdata: {
                                agent_id: e.target.value,
                                date,
                                time,
                              },
                              id,
                            });
                          }}
                          style={{
                            width: "200px",
                            fontSize: 14,
                          }}
                        >
                          <option value="">Select Agent</option>
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
                              <p className="view-subheading">
                                {data.agent.name}
                              </p>
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
                      <Restricted to="read_user">
                        <span
                          className="small text-primary font-weight-bold"
                          onClick={() => _onUserClick(data.agent_id)}
                          style={{ cursor: "pointer" }}
                        >
                          View Profile
                        </span>
                      </Restricted>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Restricted>

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

                  <div
                    className="text-primary small"
                    onClick={() => _onUserClick(data.user_id)}
                  >
                    Edit Info
                  </div>
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
                <Restricted to="read_user">
                  <span
                    className="small text-primary font-weight-bold"
                    onClick={() => _onUserClick(data.user_id)}
                    style={{ cursor: "pointer" }}
                  >
                    View Profile
                  </span>
                </Restricted>
              </div>

              <hr className="mb-3 mt-3" />
              {data?.address ? (
                <div className="d-flex flex-column" style={{ fontSize: 18 }}>
                  <p className="view-heading font-weight-bold">
                    Billing Address
                  </p>
                  <p className="view-subheading">
                    {data.address.address}
                    {", "}
                    {data.address.city}
                    {", "}
                    {data.address.pincode}{" "}
                  </p>
                </div>
              ) : (
                <p className="view-subheading">Billing Address not available</p>
              )}

              <hr className="mb-3 mt-2" />
              {data?.address && (
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
              )}
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

          {data?.tickets?.length > 0 && (
            <div className="card p-2 view-padding right-div d-flex mb-3">
              <div className="d-flex flex-column">
                <div className="text-primary">
                  <div
                    className="text-black pb-3"
                    style={{ cursor: "pointer", fontWeight: 600 }}
                  >
                    Order Issues
                  </div>
                </div>

                <hr className="mb-3" />

                <div className="d-flex flex-column" style={{ fontSize: 18 }}>
                  {data?.tickets.map((ticket) => (
                    <>
                      <Row>
                        <Col md="auto">
                          <Container
                            fluid
                            className=" m-0 p-0 d-flex align-items-center justify-content-between w-100"
                          >
                            <p className="m-0 mr-2 w-100">
                              <b>{ticket.title}</b>
                            </p>
                            <CustomBadge
                              title={ticket.status}
                              variant={
                                ticket.status === "active"
                                  ? "danger"
                                  : "success"
                              }
                            />
                          </Container>
                          <p
                            style={{
                              fontSize: 13,
                              lineHeight: 1.3,
                              marginBottom: 5,
                            }}
                            className="text-muted"
                          >
                            {ticket.description}
                          </p>
                          <span
                            className="small text-primary font-weight-bold ml-auto"
                            style={{ cursor: "pointer" }}
                            onClick={() => history.push(`/issues/${ticket.id}`)}
                          >
                            View Issue
                          </span>
                        </Col>
                      </Row>
                      <hr className="my-2" />
                    </>
                  ))}
                </div>
              </div>
            </div>
          )}

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
                      </>
                    )}

                    <tr>
                      <td className="text-muted ">
                        <p className="view-heading">Scheduled At</p>
                      </td>

                      <td className="text-primary  font-weight-bold text-right">
                        <p className="view-subheading">
                          {data.scheduled_at
                            ? moment(data.scheduled_at).format(dateFormat)
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
                          {data.pickup_at
                            ? moment(data.pickup_at).format(dateFormat)
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
                            ? moment(data.closed_at).format(dateFormat)
                            : "-"}
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
                <div className="text-primary">
                  <div className="d-flex justify-content-between">
                    <div
                      className="text-black pb-3"
                      style={{ cursor: "pointer", fontWeight: 600 }}
                    >
                      Services
                    </div>
                  </div>
                </div>

                <hr className="mb-3" />
                <div className="d-flex flex-column">
                  <div
                    className="d-flex flex-column w-100"
                    style={{ fontSize: 18 }}
                  >
                    <table className="w-100">
                      <tbody>
                        {data.services.map((service) => (
                          <tr>
                            <td
                              className="view-heading text-primary"
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                history.push("/services/create-edit", {
                                  id: service.id,
                                })
                              }
                            >
                              {service?.name}
                            </td>
                            <td className="text-right">
                              <p className="view-subheading">
                                ₹{service?.price}
                              </p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="card view-padding p-2 d-flex mt-3">
            <div className="d-flex flex-column">
              <div className="text-primary">
                <div className="d-flex justify-content-between">
                  <div
                    className="text-black pb-3"
                    style={{ cursor: "pointer", fontWeight: 600 }}
                  >
                    Payment Summary
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
                    <tr>
                      <td className="view-heading">Payment Method</td>
                      <td className="text-right">
                        <p className="view-subheading">{data.payment_method}</p>
                      </td>
                    </tr>
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
                      <td className="view-heading">GST(18%)</td>
                      <td className="text-success font-weight-bold text-right">
                        <p className="view-subheading">₹{data?.tax_amount}</p>
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

          {data.plan && (
            <div className="card view-padding p-2 d-flex mt-3">
              <div className="d-flex flex-column">
                <div className="text-primary">
                  <div className="d-flex justify-content-between">
                    <div
                      className="text-black pb-3"
                      style={{ cursor: "pointer", fontWeight: 600 }}
                    >
                      Plan
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
                      <tr>
                        <td className="view-heading">Name</td>
                        <td className="text-right">
                          <p className="view-subheading">{data?.plan?.name}</p>
                        </td>
                      </tr>
                      <tr>
                        <td className="view-heading">Description</td>
                        <td className="text-right">
                          <p className="view-subheading">
                            {renderHTML(data?.plan?.description || "-")}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td className="view-heading">Price</td>
                        <td className="text-success font-weight-bold text-right">
                          <p className="view-subheading">
                            ₹{data?.plan?.price}
                          </p>
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
