import React from "react";
import { Container } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import IsLoading from "../../shared-components/isLoading";

const key = "user-subscriptions";


const SingleOrder = () => {
  const { id }: { id: string } = useParams();
  const history = useHistory();

  const { data, isLoading, isFetching } = useGetSingleQuery({ id, key });

  // const statusBadgeVairant = (status: string) => {
  //   const _status = status.toLowerCase();

  //   if (_status === "cancelled") return "danger";

  //   if (_status === "pending" || _status === "pending_payment")
  //     return "warning";

  //   return "success";
  // };

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
          {/* <Badge variant="primary" className="mx-3 px-3 py-2 text-uppercase">
            {data.order_type}
          </Badge>
          <Badge
            variant={statusBadgeVairant(data.status)}
            className="px-3 py-2 text-uppercase"
          >
            {data.status}
          </Badge> */}
        </div>
        {/* <Button
          variant="primary"
          onClick={() => history.push(`assign-agent/${id}`)}
        >
          <div className="text-white">Assign</div>
        </Button> */}
      </Container>
      {/* {data.cancellation_reason && (
        <Container fluid>
          <p className="text-danger">{data.cancellation_reason}</p>
        </Container>
      )} */}
      <div className="dashboard-page w-100">
        <Container fluid className="status-container mt-2">
          <div className="head-row">
            <div className="card p-2 d-flex">
              <div className="d-flex flex-column">
                <div className="text-primary">
                  <h3>User</h3>
                </div>
                <div className="d-flex flex-column" style={{ fontSize: 18 }}>
                  <div>
                    <span className="text-muted">Name :</span>
                    <span className="text-primary ml-2">
                      <b>{data.user.name}</b>
                    </span>
                  </div>
                  <div>
                    <span className="text-muted">Email :</span>
                    <span className="text-primary ml-2">
                      <b>{data.user.email}</b>
                    </span>
                  </div>
                  <div>
                    <span className="text-muted">Phone :</span>
                    <span className="text-primary ml-2">
                      <b>{data.user.phone}</b>
                    </span>
                  </div>
                  <div>
                    <span className="text-muted">Role :</span>
                    <span className="text-primary ml-2">
                      <b>{data.user.role}</b>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* {data.agent && (
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
            )} */}
          </div>
        </Container>
        <Container fluid className="charts-container mt-2">
          {/* <div className="card p-2 d-flex mt-3">
            <div className="d-flex flex-column">
              <div className="text-primary">
                <h5>Plan Summary</h5>
              </div>
              <div
                className="d-flex flex-column w-100"
                style={{ fontSize: 18 }}
              >
                <table className="w-100">
                  <tbody>
                    <tr>
                      <td className="text-muted">Plan Id</td>
                      <td className="text-primary font-weight-bold text-right">
                        {data.plan_id}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted py-2">Scheduled At</td>
                      <td className="text-primary py-2 font-weight-bold text-right">
                        {data.created_at
                          ? moment(data.created_at).format("DD/MM/YY(hh:mm)")
                          : "NA"}
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
          </div> */}

          <div className="card p-2 d-flex mt-3">
            <div className="d-flex flex-column">
              <div className="text-primary">
                <h5>Plan Summary</h5>
              </div>
              <div
                className="d-flex flex-column w-100"
                style={{ fontSize: 18 }}
              >
                <table className="w-100">
                  <tbody>
                    <tr>
                      <td className="text-muted"> Plan Name</td>
                      <td className="text-primary font-weight-bold text-right">
                        {data.plan.name}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted"> Plan Description</td>
                      <td className="text-primary ">
                        {data.plan.description}
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
                  <h5>Plan Price</h5>
                </div>
                <div
                  className="d-flex flex-column w-100"
                  style={{ fontSize: 18 }}
                >
                  <table className="w-100">
                    <tbody>
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
