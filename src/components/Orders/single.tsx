import React, { useEffect } from 'react'
import { Container, Table, Badge } from 'react-bootstrap';
import { AiOutlineArrowUp } from 'react-icons/ai';
import { useHistory, useParams } from 'react-router-dom';
import useGetSingleQuery from '../../hooks/useGetSingleQuery';
import { ChartLine, ChartArea, ChartBar } from '../Dashboard/Chart';

const key = "bookings"

const data = {
    "id": 9,
    "ref_id": "1620658428-2",
    "order_type": "normal",
    "status": "cancelled",
    "inside_cart": 0,
    "total_cost": 150,
    "discount": 0,
    "payable_amount": 150,
    "pickup_at": null,
    "scheduled_at": "2021-05-20 01:01:00",
    "closed_at": null,
    "plan_id": 2,
    "user_id": 2,
    "coupon_id": null,
    "vehicle_id": null,
    "address_id": null,
    "cancelled_by": null,
    "cancellation_reason": "Something went wrong",
    "agent_id": 2,
    "created_at": "2021-05-10T14:53:48.000000Z",
    "updated_at": "2021-05-19T10:29:57.000000Z",
    "agent": {
        "id": 2,
        "name": "Dishant A",
        "email": "dishantagnihotri@gmail.com",
        "phone": "7018064278",
        "device_id": null,
        "disabled": 0,
        "password": null,
        "two_factor_secret": null,
        "two_factor_recovery_codes": null,
        "email_verified_at": null,
        "otp": null,
        "otp_generated_at": null,
        "created_at": "2021-05-10T08:07:05.000000Z",
        "updated_at": "2021-05-19T10:37:18.000000Z"
    },
    "user": {
        "id": 2,
        "name": "Dishant A",
        "email": "dishantagnihotri@gmail.com",
        "phone": "7018064278",
        "device_id": null,
        "disabled": 0,
        "password": null,
        "two_factor_secret": null,
        "two_factor_recovery_codes": null,
        "email_verified_at": null,
        "otp": null,
        "otp_generated_at": null,
        "created_at": "2021-05-10T08:07:05.000000Z",
        "updated_at": "2021-05-19T10:37:18.000000Z"
    },
    "vehicle": null,
    "address": null,
    "plan": {
        "id": 2,
        "name": "All Washing",
        "description": "Each time a friend signs up through your referral link we’ll reward you both ₹5",
        "price": "1400",
        "is_active": 1,
        "is_popular": 0,
        "allowed_usage": 1,
        "category_id": null,
        "created_at": "2021-05-10T08:22:06.000000Z",
        "updated_at": "2021-05-10T08:22:06.000000Z"
    },
    "coupon": null
}

const SingleOrder = () => {
    // const { id }: { id: string } = useParams()
    // const history = useHistory()

    // const { data } = useGetSingleQuery({ id, key })

    // console.log(data);
    return (
        <Container fluid className="component-wrapper px-0 py-2">

            <Container fluid className="d-flex justify-content-between py-2">
                <div className="d-flex align-items-center">

                    <h2 className="text-primary text-muted font-weight-bold">Order</h2>
                    <h2 className="text-primary ml-2">#{data.id}</h2>
                    <Badge variant="primary" className="mx-3 px-3 py-2 text-uppercase">{data.order_type}</Badge>
                    <Badge variant="danger" className="px-3 py-2 text-uppercase">{data.status}</Badge>
                </div>
            </Container>
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
                                        <span className="text-primary ml-2"><b>{data.user.name}</b></span>
                                    </div>
                                    <div>
                                        <span className="text-muted">Email :</span>
                                        <span className="text-primary ml-2"><b>{data.user.email}</b></span>
                                    </div>
                                    <div>
                                        <span className="text-muted">Phone :</span>
                                        <span className="text-primary ml-2"><b>{data.user.phone}</b></span>
                                    </div>

                                </div>


                            </div>


                        </div>
                        <div className="card p-2 d-flex">
                            <div className="d-flex flex-column">
                                <div className="text-primary">
                                    <h3>Agent</h3>
                                </div>
                                <div className="d-flex flex-column" style={{ fontSize: 18 }}>
                                    <div>
                                        <span className="text-muted">Name :</span>
                                        <span className="text-primary ml-2"><b>{data.agent.name}</b></span>
                                    </div>
                                    <div>
                                        <span className="text-muted">Email :</span>
                                        <span className="text-primary ml-2"><b>{data.agent.email}</b></span>
                                    </div>
                                    <div>
                                        <span className="text-muted">Phone :</span>
                                        <span className="text-primary ml-2"><b>{data.agent.phone}</b></span>
                                    </div>

                                </div>


                            </div>


                        </div>
                    </div>
                </Container>
                <Container fluid className="charts-container mt-2">
                    <div className="card p-2 d-flex">
                        <div className="d-flex flex-column">
                            <div className="text-primary">
                                <h5>Plan</h5>
                            </div>
                            <div className="d-flex flex-column w-100" style={{ fontSize: 18 }}>
                                <table className="w-100">
                                    <tbody>
                                        <tr>
                                            <td className="text-muted">Name</td>
                                            <td className="text-primary font-weight-bold text-right">{data.plan.name}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-muted py-2">Description</td>
                                            <td className="py-2 text-right text-lowercase">₹{data.plan.description}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-muted pt-3">Price</td>
                                            <td className="text-primary pt-2 font-weight-bold text-right" style={{ fontSize: "24px" }}>₹{data.plan.price}</td>
                                        </tr>
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>
                    <div className="card p-2 d-flex mt-3">
                        <div className="d-flex flex-column">
                            <div className="text-primary">
                                <h5>Payment Summary</h5>
                            </div>
                            <div className="d-flex flex-column w-100" style={{ fontSize: 18 }}>
                                <table className="w-100">
                                    <tbody>
                                        <tr>
                                            <td className="text-muted">Total Cost</td>
                                            <td className="text-primary font-weight-bold text-right">₹{data.total_cost}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-muted py-2">Discount</td>
                                            <td className="text-success py-2 font-weight-bold text-right">₹{data.discount}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-muted pt-3">Total Payable Amount</td>
                                            <td className="text-primary pt-2 font-weight-bold text-right" style={{ fontSize: "24px" }}>₹{data.payable_amount}</td>
                                        </tr>
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>
                    {/* <Table size='sm' className="w-100">
                        <tbody>
                            <tr>
                                <td className="text-muted">Ref Id</td>
                                <td className="text-right"><b>{data.ref_id}</b></td>
                            </tr>
                            <tr>
                                <td className="text-muted">Order Type</td>
                                <td className="text-right"><b>{data.order_type}</b></td>
                            </tr>
                            <tr>
                                <td className="text-muted">Status</td>
                                <td className="text-right"><b>{data.status}</b></td>
                            </tr>
                            <tr>
                                <td className="text-muted">Scheduled At</td>
                                <td className="text-right"><b>{data.scheduled_at}</b></td>
                            </tr>
                            <tr>
                                <td className="text-muted">Total cost</td>
                                <td className="text-right"><b>{data.total_cost}</b></td>
                            </tr>
                            <tr>
                                <td className="text-muted">Discount</td>
                                <td className="text-right"><b>{data.discount}</b></td>
                            </tr>
                            <tr>
                                <td className="text-muted">Payable Amount</td>
                                <td className="text-right"><b>{data.payable_amount}</b></td>
                            </tr>

                        </tbody>
                    </Table> */}

                </Container>
            </div>
        </Container>
    )
}

export default SingleOrder;
