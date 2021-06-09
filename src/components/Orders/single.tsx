import { AxiosError } from "axios";
import moment from "moment";
import React, { useState } from "react";
import { Badge, Button, Col, Container, Row } from "react-bootstrap";
import { FaDotCircle, FaRegDotCircle } from "react-icons/fa";
import { useQuery } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import { ProgressBar, Step } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";
import { handleApiError } from "../../hooks/handleApiErrors";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import FilterSelect from "../../shared-components/FilterSelect";
import IsLoading from "../../shared-components/isLoading";

const key = "bookings";

const SingleOrder = () => {
  const { id }: { id: string } = useParams();
  const history = useHistory();
  const { data, isLoading, isFetching } = useGetSingleQuery({ id, key });

  const [form, setForm] = useState({
    agent_id: data?.agent_id
  })

  console.log({ form })

  const _onformChange = (idx: string, value: any) => {
    setForm(prev => ({
      ...prev,
      [idx]: value
    }))
  }

  const { data: Agents, isLoading: isAgentLoading } = useQuery<any>(["users", 1, {
    role: "agent"
  }], {
    onError: (error: AxiosError) => {
      handleApiError(error, history)
    },
  });

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
          <h2 className="text-muted font-weight-bold">Order</h2>
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
        <Container>
          <Row>

            <Col md="auto">
              <FilterSelect
                currentValue={form.agent_id}
                data={!isAgentLoading && Agents}
                label="Agents"
                idx="agent_id"
                onFilterChange={_onformChange}

              />
            </Col>

          </Row>
        </Container>
        {/* <Button
          variant="primary"
          onClick={() => history.push(`assign-agent/${id}`)}
        >
          <div className="text-white">Assign</div>
        </Button> */}
      </Container>
      {data.cancellation_reason && (
        <Container fluid>
          <p className="text-danger">{data.cancellation_reason}</p>
        </Container>
      )}
      <div className="progressbar-css">
        <ProgressBar percent={33}>
          <Step>
            {({ accomplished, index }) => (
              <>
                <div
                  className={`indexedStep ${accomplished ? "accomplished" : null
                    }`}
                ></div>
                {accomplished ? <FaDotCircle /> : <FaDotCircle />}
              </>
            )}
          </Step>
          <Step>
            {({ accomplished, index }) => (
              <>
                <div
                  className={`indexedStep ${accomplished ? "accomplished" : null
                    }`}
                ></div>
                {accomplished ? <FaDotCircle /> : <FaRegDotCircle />}
              </>
            )}
          </Step>
          <Step>
            {({ accomplished, index }) => (
              <>
                <div
                  className={`indexedStep ${accomplished ? "accomplished" : null
                    }`}
                ></div>
                {accomplished ? <FaDotCircle /> : <FaRegDotCircle />}
              </>
            )}
          </Step>
          <Step>
            {({ accomplished, index }) => (
              <>
                <div
                  className={`indexedStep ${accomplished ? "accomplished" : null
                    }`}
                ></div>
                {accomplished ? <FaDotCircle /> : <FaRegDotCircle />}
              </>
            )}
          </Step>
        </ProgressBar>
      </div>

      <div className="dashboard-page w-100">
        <Container fluid className="status-container mt-2">
          <div className="head-row">
            <div
              style={{ margin: "4% 0 -12% 0" }}
              className="card p-2 view-padding right-div d-flex"
            >
              <div className="d-flex flex-column">
                <div className="text-primary">
                  <p className="view-heading view-top-pad">USER</p>
                </div>
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
                          <p className="view-subheading">{data.user.email}</p>
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
              <div className="view-heading  view-top-pad">ORDER SUMMARY</div>
              <div
                className="d-flex flex-column w-100"
                style={{ fontSize: 18 }}
              >
                <table className="w-100">
                  <tbody>
                    <tr>
                      <td className="text-muted">
                        <p className="view-heading">Ref Id</p>
                      </td>
                      <td className="text-right">
                        <p className="view-subheading">{data.ref_id}</p>
                      </td>
                    </tr>
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
                            : "NA"}
                        </p>
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
              <div className="view-heading  view-top-pad">PAYMENT SUMMARY</div>
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
                    {data?.services?.length
                      ? data.services.map((service) => (
                        <tr>
                          <td className="view-heading">{service.name}</td>
                          <td className="text-right">
                            <p className="view-subheading">₹{service.cost}</p>
                          </td>
                        </tr>
                      ))
                      : null}
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
