import moment from "moment";
import React from "react";
import { useState } from "react";
import { Badge, Button, Container } from "react-bootstrap";
import { FaDotCircle, FaRegDotCircle } from "react-icons/fa";
import { useHistory, useParams } from "react-router-dom";
import { ProgressBar, Step } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import IsLoading from "../../shared-components/isLoading";
import ChatBox from "./ChatBox";


const key = "bookings";



const SingleIssue = () => {
    const { id }: { id: string } = useParams();
    const history = useHistory();
    const [isChatBoxOpen, setIsChatBoxOpen] = useState(false)

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
                    <h2 className="text-muted font-weight-bold">Issue</h2>
                    <h2 className="ml-2">#{data.id}</h2>
                    <Badge variant="success" className="mx-3 px-3 py-2 text-uppercase">
                        Open
                    </Badge>
                </div>
                <Button
                    variant="primary"
                // onClick={() => history.push(`assign-agent/${id}`)}
                >
                    <div className="text-white">Mark Closed</div>
                </Button>
            </Container>


            <div className="w-100">
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


                </Container>
                <Container fluid className=" mt-2">
                    <div className="position-relative">
                        <ChatBox
                            isChatBoxOpen={isChatBoxOpen}
                            setIsChatBoxOpen={setIsChatBoxOpen}
                        />
                    </div>
                </Container>
            </div>
        </Container>
    );
};

export default SingleIssue;
