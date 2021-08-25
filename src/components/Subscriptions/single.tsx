import { AxiosError } from "axios";
import moment from "moment";
import React, { useState } from "react";
import { Badge, Button, Col, Container, Form, Row } from "react-bootstrap";
import { BiArrowFromRight, BiDownload } from "react-icons/bi";
import { useMutation, useQuery } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import "react-step-progress-bar/styles.css";
import Map from "../../components/Map";
import { handleApiError } from "../../hooks/handleApiErrors";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import IsLoading from "../../shared-components/isLoading";
import API from "../../utils/API";
import { OrderStatus } from "../../utils/arrays";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import { AiFillPlusSquare } from "react-icons/ai";
import IsActiveBadge from "../../shared-components/IsActiveBadge";
import CustomBadge from "../../shared-components/CustomBadge";

const dateFormat = "DD MMMM YY (hh:mm a)";
const key = "user-subscriptions";

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

const SingleSubscription = () => {
  const { id }: { id: string } = useParams();
  const history = useHistory();
  const { data, isLoading, isFetching } = useGetSingleQuery({ id, key });

  const _onUserClick = (id: string) => {
    if (!id) return;
    history.push("/users/create-edit", { id });
  };
  const _onPlanClick = (id: string) => {
    if (!id) return;
    history.push("/plans/create-edit", { id });
  };

  const statusBadgeVairant = (status: string) => {
    const _status = status.toLowerCase();

    if (_status === "active") return "success";

    return "danger";
  };

  if (isLoading || isFetching) {
    return <IsLoading />;
  }
  return (
    <Container fluid className="component-wrapper px-0 py-2">
      <Container fluid className="d-flex justify-content-between py-2">
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center mr-2">
            <p className="mb-0">Subscription</p>
            <p className="mb-0 lead font-weight-bold">#{data?.id}</p>
          </div>
          <CustomBadge
            title={data?.status}
            variant={statusBadgeVairant(data?.status)}
          />
        </div>
        <div>
          <Button className="ml-2" size="sm" onClick={() => history.goBack()}>
            <div className="text-white d-flex align-items-center">
              <BiArrowFromRight size={18} /> <p className="mb-0 mr-1">Back</p>
            </div>
          </Button>
        </div>
      </Container>

      <div className="dashboard-page w-100">
        <Container fluid className="status-container mt-2">
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
                <span
                  className="small text-primary font-weight-bold"
                  onClick={() => _onUserClick(data.user_id)}
                  style={{ cursor: "pointer" }}
                >
                  View Profile
                </span>
              </div>
            </div>
          </div>
        </Container>

        <Container fluid className="charts-container">
          <div className="card view-padding p-2 d-flex mt-3">
            <div className="d-flex flex-column">
              <div className="text-primary">
                <div className="d-flex justify-content-between">
                  <div
                    className="text-black pb-3"
                    style={{ cursor: "pointer", fontWeight: 600 }}
                    onClick={() => _onUserClick(data.user_id)}
                  >
                    Basic Information
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
                      <td className="text-muted ">
                        <p className="view-heading">Last User At</p>
                      </td>

                      <td className="text-primary  font-weight-bold text-right">
                        <p className="view-subheading">
                          {data.last_used_at
                            ? moment(data.last_used_at).format(dateFormat)
                            : "-"}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted ">
                        <p className="view-heading">Valid Till</p>
                      </td>

                      <td className="text-primary  font-weight-bold text-right">
                        <p className="view-subheading">
                          {data.last_used_at
                            ? moment(data?.valid_till).format(dateFormat)
                            : "-"}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted ">
                        <p className="view-heading">Created At</p>
                      </td>

                      <td className="text-primary  font-weight-bold text-right">
                        <p className="view-subheading">
                          {data.last_used_at
                            ? moment(data?.created_at).format(dateFormat)
                            : "-"}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted ">
                        <p className="view-heading">Transaction Id</p>
                      </td>

                      <td className="text-primary  font-weight-bold text-right">
                        <p className="view-subheading">
                          {data?.transaction_id}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted ">
                        <p className="view-heading">Used</p>
                      </td>

                      <td className="text-primary  font-weight-bold text-right">
                        <p className="view-subheading">{data?.used}</p>
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
            </div>
          ) : null}

          {data.plan && (
            <div className="card view-padding p-2 d-flex mt-3">
              <div className="d-flex flex-column">
                <div className="text-primary">
                  <div className="d-flex justify-content-between">
                    <div
                      className="text-primary pb-3"
                      style={{ cursor: "pointer", fontWeight: 600 }}
                      onClick={() => _onPlanClick(data.plan_id)}
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
                        <td className="text-muted ">
                          <p className="view-heading">Name</p>
                        </td>

                        <td className="text-primary  font-weight-bold text-right">
                          <p className="view-subheading">{data.plan.name}</p>
                        </td>
                      </tr>
                      <tr>
                        <td className="text-muted ">
                          <p className="view-heading">Price</p>
                        </td>

                        <td className="text-primary  font-weight-bold text-right">
                          <p className="view-subheading">₹{data.plan.price}</p>
                        </td>
                      </tr>
                      <tr>
                        <td className="text-muted ">
                          <p className="view-heading">Allowed Usage</p>
                        </td>

                        <td className="text-primary  font-weight-bold text-right">
                          <p className="view-subheading">
                            {data.plan.allowed_usage}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td className="text-muted ">
                          <p className="view-heading">Is Popular?</p>
                        </td>

                        <td className="text-primary  font-weight-bold text-right">
                          <p className="view-subheading">
                            <IsActiveBadge value={data.plan.is_active} />
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td className="text-muted ">
                          <p className="view-heading">Is Active?</p>
                        </td>

                        <td className="text-primary  font-weight-bold text-right">
                          <p className="view-subheading">
                            <IsActiveBadge value={data.plan.is_popular} />
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

export default SingleSubscription;
