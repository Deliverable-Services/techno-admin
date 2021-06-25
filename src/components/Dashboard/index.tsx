import moment, { Moment } from "moment";
import React, { useState } from "react";
import { Container, Form } from "react-bootstrap";
import { DateRangePicker, FocusedInputShape } from "react-dates";
import "react-dates/initialize";
import { AiOutlineArrowUp } from "react-icons/ai";
import { BiSad } from "react-icons/bi";
import { BsCalendar } from "react-icons/bs";
import { useQuery } from "react-query";
import IsLoading from "../../shared-components/isLoading";
import API from "../../utils/API";
import { primaryColor } from "../../utils/constants";
import { ChartArea, ChartBar, ChartLine } from "./Chart";

const getAnalytics = async () => {
  const r = await API.get("analytics");

  return r.data;
};

interface IDates {
  start_date: Moment | null;
  end_date: Moment | null;
  focusedInput: FocusedInputShape | null;
}

const Dashboard = () => {
  const [chartOneSelect, setChartOneSelect] = useState<string>("1");
  const [chartTwoSelect, setChartTwoSelect] = useState<string>("");
  const [dates, setDates] = useState<IDates>({
    start_date: null,
    end_date: null,
    focusedInput: null,
  });
  const [start_date, setStartDate] = useState<Moment | null>(moment());
  const [end_date, setEndDate] = useState<Moment | null>(null);
  const [focusedInput, setFocusInput] = useState<FocusedInputShape | null>(
    null
  );
  const { data, isLoading, isFetching } = useQuery<any>(
    "analytics",
    getAnalytics
  );
  const handleChartOneChange = (e: any) => setChartOneSelect(e.target.value);
  const handleChartTwoChange = (e: any) => setChartTwoSelect(e.target.value);

  if (isLoading || isFetching) return <IsLoading />;

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

  return (
    <>
      <Container fluid className="component-wrapper px-0 py-2">
        <div className="card">
          <div className="card-content">
            <Container
              fluid
              className="d-flex align-items-center justify-content-start"
            >
              <div>
                <BsCalendar color={primaryColor} size={24} className="mr-3" />
              </div>
              <DateRangePicker
                startDate={start_date}
                startDateId={"start_date"}
                endDate={end_date}
                endDateId={"end_date"}
                onDatesChange={({ startDate, endDate }) => {
                  if (startDate) setStartDate(startDate);
                  if (endDate) setEndDate(endDate);
                }}
                focusedInput={focusedInput}
                onFocusChange={(focusedInput) => setFocusInput(focusedInput)}
              />
            </Container>
          </div>
        </div>

        <Container fluid className="px-0">
          <div className="d-flex justify-content-between my-3">
            <div className="card hoverable stats-card d-flex w-100 mr-3">
              <div className="card-content">
                <div className="lead">Customers</div>

                <div className="d-flex align-items-center justify-content-between mt-2">
                  <h1 className="text-black font-weight-bold">
                    {data?.overall_status?.customers}
                  </h1>
                  <span>graph</span>
                </div>

                <div className="d-flex align-items-center justify-content-start">
                  <span className="tag tag-success d-flex align-items-center">
                    <AiOutlineArrowUp size={13} />
                    <strong>10%</strong>
                  </span>

                  <span className="text-muted ml-2">from 3</span>
                </div>
              </div>
            </div>

            <div className="card hoverable stats-card d-flex w-100 mr-3 ml-3">
              <div className="card-content">
                <div className="lead">Orders</div>

                <div className="d-flex align-items-center justify-content-between mt-2">
                  <h1 className="text-black font-weight-bold">
                    {data?.overall_status?.orders}
                  </h1>
                  <span>graph</span>
                </div>

                <div className="d-flex align-items-center justify-content-start">
                  <span className="tag tag-success d-flex align-items-center">
                    <AiOutlineArrowUp size={13} />
                    <strong>10%</strong>
                  </span>

                  <span className="text-muted ml-2">from 3</span>
                </div>
              </div>
            </div>

            <div className="card hoverable stats-card d-flex w-100 mr-3 ml-3">
              <div className="card-content">
                <div className="lead">Active Subscriptions</div>

                <div className="d-flex align-items-center justify-content-between mt-2">
                  <h1 className="text-black font-weight-bold">
                    {data?.overall_status?.active_subscriptions}
                  </h1>
                  <span>graph</span>
                </div>

                <div className="d-flex align-items-center justify-content-start">
                  <span className="tag tag-success d-flex align-items-center">
                    <AiOutlineArrowUp size={13} />
                    <strong>10%</strong>
                  </span>

                  <span className="text-muted ml-2">from 3</span>
                </div>
              </div>
            </div>

            <div className="card hoverable stats-card d-flex w-100 ml-3">
              <div className="card-content">
                <div className="lead">Agents</div>

                <div className="d-flex align-items-center justify-content-between mt-2">
                  <h1 className="text-black font-weight-bold">
                    {data?.overall_status?.merchants}
                  </h1>
                  <span>graph</span>
                </div>

                <div className="d-flex align-items-center justify-content-start">
                  <span className="tag tag-success d-flex align-items-center">
                    <AiOutlineArrowUp size={13} />
                    <strong>10%</strong>
                  </span>

                  <span className="text-muted ml-2">from 3</span>
                </div>
              </div>
            </div>
          </div>
        </Container>

        <div className="dashboard-page w-100 mt-4">
          <Container fluid className="status-container mt-0 pl-2 pr-0">
            <div className="card hoverable stats-card d-flex w-100">
              <div className="card-header">
                <p className="text-black">Reports overview</p>
              </div>

              <div className="card-content">
                <div className="d-flex align-items-center justify-content-between w-100">
                  <span className="text-grey">Bookings</span>

                  <span className="text-grey">100</span>

                  <span className="tag tag-success d-flex align-items-center">
                    <AiOutlineArrowUp size={13} />
                    <strong>10%</strong>
                  </span>
                </div>
                <hr />

                <div className="d-flex align-items-center justify-content-between w-100">
                  <span className="text-grey">Subscriptions</span>

                  <span className="text-grey">100</span>

                  <span className="tag tag-success d-flex align-items-center">
                    <AiOutlineArrowUp size={13} />
                    <strong>10%</strong>
                  </span>
                </div>
                <hr />

                <div className="d-flex align-items-center justify-content-between w-100">
                  <span className="text-grey">Other</span>

                  <span className="text-grey">100</span>

                  <span className="tag tag-success d-flex align-items-center">
                    <AiOutlineArrowUp size={13} />
                    <strong>10%</strong>
                  </span>
                </div>
              </div>
            </div>
          </Container>

          <Container fluid className="charts-container mt-0 pl-0 pr-2">
            <div className="charts-row">
              <div className="card">
                <div className="card-header pb-3 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <strong>Bookings</strong>
                  </h5>
                  <div>
                    <Form.Control
                      as="select"
                      custom
                      onChange={handleChartOneChange}
                      className="bg-transparent"
                    >
                      <option value="1">Option 1</option>
                      <option value="2">Option 2</option>
                      <option value="3">Option 3</option>
                    </Form.Control>
                  </div>
                </div>

                <div className="card-content chart-container">
                  <ChartLine />
                </div>
              </div>

              <div className="card ">
                <div className="card-header pb-3 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <strong>Bookings</strong>
                  </h5>
                  <div>
                    <Form.Control
                      as="select"
                      custom
                      onChange={handleChartOneChange}
                      className="bg-transparent"
                    >
                      <option value="1">Option 1</option>
                      <option value="2">Option 2</option>
                      <option value="3">Option 3</option>
                    </Form.Control>
                  </div>
                </div>

                <div className="card-content chart-container">
                  <ChartArea />
                </div>
              </div>

              <div className="card ">
                <div className="card-header pb-3 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <strong>Bookings</strong>
                  </h5>
                  <div>
                    <Form.Control
                      as="select"
                      custom
                      onChange={handleChartOneChange}
                      className="bg-transparent"
                    >
                      <option value="1">Option 1</option>
                      <option value="2">Option 2</option>
                      <option value="3">Option 3</option>
                    </Form.Control>
                  </div>
                </div>

                <div className="card-content chart-container">
                  <ChartBar />
                </div>
              </div>
            </div>
          </Container>
        </div>
      </Container>
    </>
  );
};

export default Dashboard;
