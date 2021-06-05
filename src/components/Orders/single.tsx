import React from "react";
import { Badge, Button, Container, OverlayTrigger } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import IsLoading from "../../shared-components/isLoading";
import moment from "moment";

import { FaRegDotCircle, FaDotCircle } from "react-icons/fa";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";

const key = "bookings";

const data = {
  id: 9,
  ref_id: "1620658428-2",
  order_type: "normal",
  status: "cancelled",
  inside_cart: 0,
  total_cost: 150,
  discount: 0,
  payable_amount: 150,
  pickup_at: null,
  scheduled_at: "2021-05-20 01:01:00",
  closed_at: null,
  plan_id: 2,
  user_id: 2,
  coupon_id: null,
  vehicle_id: null,
  address_id: null,
  cancelled_by: null,
  cancellation_reason: "Something went wrong",
  agent_id: 2,
  created_at: "2021-05-10T14:53:48.000000Z",
  updated_at: "2021-05-19T10:29:57.000000Z",
  agent: {
    id: 2,
    name: "Dishant A",
    email: "dishantagnihotri@gmail.com",
    phone: "7018064278",
    device_id: null,
    disabled: 0,
    password: null,
    two_factor_secret: null,
    two_factor_recovery_codes: null,
    email_verified_at: null,
    otp: null,
    otp_generated_at: null,
    created_at: "2021-05-10T08:07:05.000000Z",
    updated_at: "2021-05-19T10:37:18.000000Z",
  },
  user: {
    id: 2,
    name: "Dishant A",
    email: "dishantagnihotri@gmail.com",
    phone: "7018064278",
    device_id: null,
    disabled: 0,
    password: null,
    two_factor_secret: null,
    two_factor_recovery_codes: null,
    email_verified_at: null,
    otp: null,
    otp_generated_at: null,
    created_at: "2021-05-10T08:07:05.000000Z",
    updated_at: "2021-05-19T10:37:18.000000Z",
  },
  vehicle: null,
  address: null,
  plan: {
    id: 2,
    name: "All Washing",
    description:
      "Each time a friend signs up through your referral link we’ll reward you both ₹5",
    price: "1400",
    is_active: 1,
    is_popular: 0,
    allowed_usage: 1,
    category_id: null,
    created_at: "2021-05-10T08:22:06.000000Z",
    updated_at: "2021-05-10T08:22:06.000000Z",
  },
  coupon: null,
};

const SingleOrder = () => {
  const { id }: { id: string } = useParams();
  const history = useHistory();

  const { data, isLoading, isFetching } = useGetSingleQuery({ id, key });

  const statusBadgeVairant = (status: string) => {
    const _status = status.toLowerCase();

    if (_status === "cancelled") return "danger";

    if (_status === "pending" || _status === "pending_payment")
      return "warning";

    return "success";
  };

  if (isLoading || isFetching) {
    return <IsLoading />;
  }
  // console.log(data);
  return (
    <Container fluid className="component-wrapper px-0 py-2">
      <Container fluid className="d-flex justify-content-between py-2">
        <div className="d-flex align-items-center">
          <h2 className="text-muted font-weight-bold">Order</h2>
          <h2 className="ml-2">#{data.id}</h2>
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
        <Button
          variant="primary"
          onClick={() => history.push(`assign-agent/${id}`)}
        >
          <div className="text-white">Assign</div>
        </Button>
      </Container>
      {data.cancellation_reason && (
        <Container fluid>
          <p className="text-danger">{data.cancellation_reason}</p>
        </Container>
      )}
      <div className="progressbar-css">
        <ProgressBar
          percent={33}
        >
          <Step>
            {({ accomplished, index }) => (
              <>
                <div
                  className={`indexedStep ${accomplished ? "accomplished" : null}`}
                >
                </div>
                {accomplished ? <FaDotCircle /> : <FaDotCircle />}

              </>
            )}
          </Step>
          <Step>
            {({ accomplished, index }) => (
              <>
                <div
                  className={`indexedStep ${accomplished ? "accomplished" : null}`}
                >
                </div>
                {accomplished ? <FaDotCircle /> : <FaRegDotCircle />}

              </>

            )}
          </Step>
          <Step>
            {({ accomplished, index }) => (
              <>
                <div
                  className={`indexedStep ${accomplished ? "accomplished" : null}`}
                >
                </div>
                {accomplished ? <FaDotCircle /> : <FaRegDotCircle />}

              </>
            )}
          </Step>
          <Step>
            {({ accomplished, index }) => (
              <>
                <div
                  className={`indexedStep ${accomplished ? "accomplished" : null}`}
                >
                </div>
                {accomplished ? <FaDotCircle /> : <FaRegDotCircle />}

              </>
            )}
          </Step>
        </ProgressBar>
      </div>

      <div className="dashboard-page w-100">
        <Container fluid className="status-container mt-2">
          <div className="head-row">
            <div style={{ margin: "4% 0 -12% 0" }} className="card p-2 view-padding right-div d-flex">
              <div className="d-flex flex-column">
                <div className="text-primary">
                  <p className="view-heading view-top-pad">USER</p>
                </div>
                <div className="d-flex flex-column" style={{ fontSize: 18 }}>
                  <table className="w-100">
                    <tbody>
                      <tr>
                        <td className="text-muted"><p className="view-heading">Name</p></td>
                        <td className="text-right">
                          <p className="view-subheading">{data.user.name}</p>
                        </td>
                      </tr>
                      <tr>
                        <td className="text-muted "><p className="view-heading">Email</p></td>
                        <td className="text-primary  font-weight-bold text-right">
                          <p className="view-subheading">
                            {data.user.email}</p>
                        </td>
                      </tr>
                      <tr>
                        <td className="text-muted "><p className="view-heading phone-padd">Phone</p></td>
                        <td className="text-primary  font-weight-bold text-right">
                          <p className="view-subheading">
                            {data.user.phone}</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {data.agent && (
              <div className="card p-2 d-flex">
                <div className="d-flex flex-column">
                  <div className="text-primary">
                    <h3>Agent</h3>
                  </div>
                  <div className="d-flex flex-column" style={{ fontSize: 18 }}>
                    <div>
                      <span className="text-muted">Name :</span>
                      <span className="text-primary ml-2">
                        <b>{data.agent.name}</b>
                      </span>
                    </div>
                    <div>
                      <span className="text-muted">Email :</span>
                      <span className="text-primary ml-2">
                        <b>{data.agent.email}</b>
                      </span>
                    </div>
                    <div>
                      <span className="text-muted">Phone :</span>
                      <span className="text-primary ml-2">
                        <b>{data.agent.phone}</b>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Container>
        <Container fluid className="charts-container mt-2">
          <div className="card view-padding p-2 d-flex mt-3">
            <div className="d-flex flex-column">
              <div className="view-heading  view-top-pad">
                ORDER SUMMARY
              </div>
              <div
                className="d-flex flex-column w-100"
                style={{ fontSize: 18 }}
              >
                <table className="w-100">
                  <tbody>
                    <tr>
                      <td className="text-muted"><p className="view-heading">Ref Id</p></td>
                      <td className="text-right">
                        <p className="view-subheading">{data.ref_id}</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted "><p className="view-heading">Scheduled At</p></td>
                      <td className="text-primary  font-weight-bold text-right">
                        <p className="view-subheading">
                          {data.scheduled_at
                            ? moment(data.scheduled_at).format("DD/MM/YY(hh:mm)")
                            : "NA"}</p>
                      </td>
                    </tr>
                    {data.address && (
                      <tr>
                        <td className="text-muted py-2">Address</td>
                        <td className="text-primary py-2 text-right">
                          <address className="font-italic font-weight-light text-capitalize">
                            {data.address.address}
                            {", "}
                            <br />
                            {data.address.city}
                            {", "}
                            {data.address.pincode}{" "}
                          </address>
                        </td>
                      </tr>
                    )}
                    {data.vehicle && (
                      <tr>
                        <td className="text-muted py-2">Vehicle Name</td>
                        <td className="text-primary py-2 text-right">
                          {data.vehicle.name}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="card view-padding p-2 d-flex mt-3">
            <div className="d-flex flex-column">
              <div className="view-heading  view-top-pad">
                PAYMENT SUMMARY
              </div>
              <div
                className="d-flex flex-column w-100"
                style={{ fontSize: 18 }}
              >
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
                      <td className="view-heading pt-3">Total Payable Amount</td>
                      <td
                        className="text-primary pt-2 font-weight-bold text-right"
                        style={{ fontSize: "24px" }}
                      >
                        <p className="view-subheading">₹{data.payable_amount}</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

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
                        <td className="text-muted">Name</td>
                        <td className="text-primary font-weight-bold text-right">
                          {data.plan.name}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-muted py-2">Description</td>
                        <td className="text-right font-weight-light text-capitalize">
                          {data.plan.description}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-muted pt-3">Price</td>
                        <td
                          className="text-primary pt-2 font-weight-bold text-right"
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
