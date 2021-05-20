import moment, { Moment } from 'moment'
import React, { useState } from 'react'
import { Container, Form } from 'react-bootstrap'
import { DateRangePicker, FocusedInputShape } from 'react-dates'
import "react-dates/initialize"
import { AiOutlineArrowUp } from 'react-icons/ai'
import { BiSad } from 'react-icons/bi'
import { BsCalendar } from 'react-icons/bs'
import { useQuery } from 'react-query'
import IsLoading from '../../shared-components/isLoading'
import API from '../../utils/API'
import { primaryColor } from '../../utils/constants'
import { ChartArea, ChartBar, ChartLine } from "./Chart"

const getAnalytics = async () => {
    const r = await API.get('analytics');

    return r.data
}

interface IDates {
    start_date: Moment | null;
    end_date: Moment | null,
    focusedInput: FocusedInputShape | null
}


const Dashboard = () => {
    const [chartOneSelect, setChartOneSelect] = useState<string>("1")
    const [chartTwoSelect, setChartTwoSelect] = useState<string>("")
    const [dates, setDates] = useState<IDates>({
        start_date: null,
        end_date: null,
        focusedInput: null
    })
    const [start_date, setStartDate] = useState<Moment | null>(moment())
    const [end_date, setEndDate] = useState<Moment | null>(null)
    const [focusedInput, setFocusInput] = useState<FocusedInputShape | null>(null)
    const { data, isLoading, isFetching } = useQuery<any>("analytics", getAnalytics)
    const handleChartOneChange = (e: any) => setChartOneSelect(e.target.value)
    const handleChartTwoChange = (e: any) => setChartTwoSelect(e.target.value)

    if (isLoading || isFetching) return <IsLoading />


    if (!data && (!isLoading || !isFetching)) {
        return (
            <Container fluid className="d-flex justify-content-center display-3">
                <div className="d-flex flex-column align-items-center">

                    <BiSad color={primaryColor} />
                    <span className="text-primary display-3">Something went wrong</span>
                </div>
            </Container>
        )
    }


    return (
        <>
            <Container fluid className="component-wrapper px-0 py-2">
                <Container fluid className="d-flex align-items-center justify-content-end">
                    <div>
                        <BsCalendar color={primaryColor} size={24} className="mr-3" />
                    </div>
                    <DateRangePicker
                        startDate={start_date}
                        startDateId={"start_date"}
                        endDate={end_date}
                        endDateId={"end_date"}
                        onDatesChange={({ startDate, endDate }) => {
                            if (startDate) setStartDate(startDate)
                            if (endDate) setEndDate(endDate)
                        }
                        }
                        focusedInput={focusedInput}
                        onFocusChange={focusedInput => setFocusInput(focusedInput)}
                    />
                </Container>

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
