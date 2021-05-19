import React, { useState } from 'react'
import { Container, Form, Tooltip } from 'react-bootstrap'
import { AiFillCar, AiOutlineArrowUp } from 'react-icons/ai'
import { useQuery } from 'react-query'
import { ResponsiveContainer, LineChart, XAxis, YAxis, Legend, Line } from 'recharts'
import IsLoading from '../../shared-components/isLoading'
import API from '../../utils/API'
import { primaryColor } from '../../utils/constants'
import { ChartLine, ChartArea, ChartBar } from "./Chart"

const getAnalytics = async () => {
    const r = await API.get('analytics');

    return r.data
}


const Dashboard = () => {
    const [chartOneSelect, setChartOneSelect] = useState<string>("1")
    const [chartTwoSelect, setChartTwoSelect] = useState<string>("")

    const { data, isLoading, isFetching } = useQuery<any>("analytics", getAnalytics)
    console.log("data -ana", data);
    const handleChartOneChange = (e: any) => setChartOneSelect(e.target.value)
    const handleChartTwoChange = (e: any) => setChartTwoSelect(e.target.value)

    if (isLoading || isFetching) return <IsLoading />

    if ((!isLoading || !isFetching) && !data) return <h1 className="text-primary">No data found</h1>

    return (
        <>
            <Container fluid className="component-wrapper px-0 py-2">


                <div className="dashboard-page w-100">

                    <Container fluid className="status-container mt-2">
                        <h2 className="text-primary font-weight-bold ">Stats</h2>
                        <div className="head-row">

                            <div className="card p-2 d-flex" >
                                <div className="d-flex flex-column">
                                    <div className="lead">
                                        Customers
                                    </div>
                                    <div className="d-flex align-items-end">

                                        <p className=" display-4 text-primary m-0">{data.overall_status.customers}</p>
                                        <span className="text-success d-flex  align-items-center mb-3 ml-auto">
                                            <AiOutlineArrowUp size={24} />
                                            <strong>

                                                10%</strong>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="card p-2 d-flex" >
                                <div className="d-flex flex-column">
                                    <div className="lead">
                                        Orders
                                    </div>
                                    <div className="d-flex align-items-end">

                                        <p className=" display-4 text-primary m-0">{data.overall_status.orders}</p>
                                        <span className="text-success d-flex  align-items-center mb-3 ml-auto">
                                            <AiOutlineArrowUp size={24} />
                                            <strong>

                                                10%</strong>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="card p-2 d-flex" >
                                <div className="d-flex flex-column">
                                    <div className="lead">
                                        Active Subscriptions
                                    </div>
                                    <div className="d-flex align-items-end">

                                        <p className=" display-4 text-primary m-0">{data.overall_status.active_subscriptions}</p>
                                        <span className="text-success d-flex  align-items-center mb-3 ml-auto">
                                            <AiOutlineArrowUp size={24} />
                                            <strong>

                                                10%</strong>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="card p-2 d-flex" >
                                <div className="d-flex flex-column">
                                    <div className="lead">
                                        Merchants
                                    </div>
                                    <div className="d-flex align-items-end">

                                        <p className=" display-4 text-primary m-0">{data.overall_status.merchants}</p>
                                        <span className="text-success d-flex  align-items-center mb-3 ml-auto">
                                            <AiOutlineArrowUp size={24} />
                                            <strong>

                                                10%</strong>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Container>
                    <Container fluid className="charts-container mt-2">

                        <h2 className="text-primary font-weight-bold">Analytics</h2>
                        <div className="charts-row">

                            <div className="card ">
                                <div className="chart-setting px-1 py-2 d-flex justify-content-between align-items-center">
                                    <h4 className="text-primary">
                                        <strong>
                                            Bookings
                                        </strong>
                                    </h4>
                                    <div>
                                        <Form.Control as="select" custom onChange={handleChartOneChange} className="bg-transparent">
                                            <option value="1">Option 1</option>
                                            <option value="2">Option 2</option>
                                            <option value="3">Option 3</option>

                                        </Form.Control>
                                    </div>

                                </div>
                                <div className=" chart-container">
                                    <ChartLine />
                                </div>
                            </div>
                            <div className="card ">
                                <div className="chart-setting p-1 d-flex justify-content-between">
                                    <h4 className="text-primary">
                                        <strong>
                                            Chart Title
                                        </strong></h4>
                                    <div>
                                        <Form.Control as="select" custom onChange={handleChartTwoChange} className="bg-transparent">
                                            <option value="1">Option 1</option>
                                            <option value="2">Option 2</option>
                                            <option value="3">Option 3</option>

                                        </Form.Control>
                                    </div>
                                </div>
                                <div className=" chart-container">
                                    <ChartArea />
                                </div>
                            </div>
                            <div className="card ">
                                <div className="chart-setting p-1 d-flex justify-content-between">
                                    <h4 className="text-primary">
                                        <strong>
                                            Chart Title
                                        </strong></h4>
                                    <div>
                                        <Form.Control as="select" custom onChange={handleChartTwoChange} className="bg-transparent">
                                            <option value="1">Option 1</option>
                                            <option value="2">Option 2</option>
                                            <option value="3">Option 3</option>

                                        </Form.Control>
                                    </div>
                                </div>
                                <div className=" chart-container">
                                    <ChartBar />
                                </div>
                            </div>
                            <div className="card ">
                                <div className="chart-setting p-1 d-flex justify-content-between">
                                    <h4 className="text-primary">
                                        <strong>
                                            Chart Title
                                        </strong></h4>
                                    <div>
                                        <Form.Control as="select" custom onChange={handleChartTwoChange} className="bg-transparent">
                                            <option value="1">Option 1</option>
                                            <option value="2">Option 2</option>
                                            <option value="3">Option 3</option>

                                        </Form.Control>
                                    </div>
                                </div>
                                <div className=" chart-container">

                                    <ChartArea />
                                </div>
                            </div>

                        </div>
                    </Container>
                </div>
            </Container>
        </>

    )
}

export default Dashboard
