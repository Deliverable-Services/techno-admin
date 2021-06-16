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
import Map from "../../components/Map";
import { handleApiError } from "../../hooks/handleApiErrors";
import useGetSingleQuery from "../../hooks/useGetSingleQuery";
import IsLoading from "../../shared-components/isLoading";
import API from "../../utils/API";
import { IssueStatus, OrderStatus } from "../../utils/arrays";
import { queryClient } from "../../utils/queryClient";
import { showMsgToast } from "../../utils/showMsgToast";
import ChatBox from "./ChatBox";

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

const SingleIssue = () => {
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
                    <h2 className="font-weight-bold">Issue</h2>
                    <h2 className="ml-2">#{data.ref_id}</h2>
                </div>
                <div>
                    <Button className="ml-2" onClick={() => history.goBack()}>
                        <div className="text-white">
                            <BiArrowFromRight size={25} /> <b>Back</b>
                        </div>
                    </Button>
                </div>
            </Container>



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
                                                value={"open"}
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
                    </div>
                    <div className="card p-2 view-padding right-div d-flex mb-3">
                        <div className="d-flex flex-column">
                            <div className="text-primary">
                                <div
                                    className="text-black pb-3"
                                    style={{ cursor: "pointer", fontWeight: 600 }}
                                    onClick={() => _onUserClick(data.user_id)}
                                >
                                    Issue Info
                                </div>
                            </div>

                            <hr className="mb-3" />

                            <div className="d-flex flex-column" style={{ fontSize: 18 }}>
                                <Row>
                                    <Col md="auto">

                                        <p
                                            style={{ fontSize: 13, lineHeight: 1.3, marginBottom: 5 }}
                                            className="text-muted"
                                        >
                                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Modi, voluptatum.
                                        </p>
                                        <table className="w-100">
                                            <tbody>
                                                <tr>
                                                    <td className="text-muted">
                                                        <p className="view-heading">Created At</p>
                                                    </td>
                                                    <td className="text-right">
                                                        <p className="view-subheading">{moment().format("YYYY-MM-DD")}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">
                                                        <p className="view-heading">Closed At</p>
                                                    </td>
                                                    <td className="text-right">
                                                        <p className="view-subheading">{moment().format("YYYY-MM-DD")}</p>
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
                                    <div
                                        className="text-black pb-3"
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
                                <span className="small text-primary font-weight-bold"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => _onUserClick(data.user_id)}
                                >
                                    View Profile
                                </span>
                            </div>

                            <hr className="mb-3 mt-3" />
                        </div>
                    </div>
                </Container>

                <Container fluid className="charts-container">
                    <ChatBox />
                </Container>
            </div>
        </Container>
    );
};

export default SingleIssue;
