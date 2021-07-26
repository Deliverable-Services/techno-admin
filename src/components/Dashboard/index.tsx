import { AxiosError } from "axios";
import moment, { Moment } from "moment";
import React, { useEffect, useState } from "react";
import { Container, Form } from "react-bootstrap";
import { DateRangePicker, FocusedInputShape } from "react-dates";
import "react-dates/initialize";
import { AiOutlineArrowUp } from "react-icons/ai";
import { BiSad } from "react-icons/bi";
import { BsCalendar } from "react-icons/bs";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { handleApiError } from "../../hooks/handleApiErrors";
import IsLoading from "../../shared-components/isLoading";
import API from "../../utils/API";
import { primaryColor } from "../../utils/constants";
import { BookingLineChart, ChartArea, ChartBar, ChartLine } from "./Chart";

interface IDates {
  start_date: Moment;
  end_date: Moment;
  focusedInput: FocusedInputShape | null;
}

const returnPercentage = (newData: number, lastTotal: number) => {
  if (newData === 0 && lastTotal === 0) return 0;
  const p = newData / (lastTotal + newData);
  return (p * 100).toFixed(1);
};

const bookingFilter = {
  datefrom: moment().startOf("month").format("YYYY-MM-DD"),
  dateto: moment().endOf("month").format("YYYY-MM-DD"),
  duration: "month",
};

const Dashboard = () => {
  const history = useHistory();
  const [filter, setFilter] = useState(bookingFilter);
  const [focusedInput, setFocusInput] = useState<FocusedInputShape | null>(
    null
  );
  const [currentTime, setCurrentTime] = useState(moment().format("hh:mm a"));
  const { data, isLoading, isFetching } = useQuery<any>(
    ["analytics", , filter],
    {
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );
  const { data: BookingAnalytics, isLoading: isBookingAnalyticsLoading } =
    useQuery<any>(["bookingAnalytics", , filter], {
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    });

  const _onFilterChange = (idx: any, value: any) => {
    setFilter((prev) => ({
      ...prev,
      [idx]: value,
    }));
  };

  const _changeCurrentTime = () => {
    setCurrentTime(moment().format("hh:mm a"));
  };

  useEffect(() => {
    setInterval(() => _changeCurrentTime(), 1000);
  }, []);

  if (isLoading) return <IsLoading />;

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
          <div className="card-content d-flex align-items-center justify-content-between">
            <Container
              fluid
              className="d-flex align-items-center justify-content-start"
            >
              <div>
                <BsCalendar color={primaryColor} size={24} className="mr-3" />
              </div>
              <DateRangePicker
                startDate={moment(filter.datefrom)}
                startDateId={"start_date"}
                endDate={moment(filter.dateto)}
                endDateId={"end_date"}
                isOutsideRange={() => false}
                keepOpenOnDateSelect={true}
                onDatesChange={({ startDate, endDate }) => {
                  if (startDate)
                    _onFilterChange("datefrom", startDate.format("YYYY-MM-DD"));
                  if (endDate)
                    _onFilterChange("dateto", endDate.format("YYYY-MM-DD"));
                }}
                focusedInput={focusedInput}
                onFocusChange={(focusedInput) => setFocusInput(focusedInput)}
              />
              <Form.Control
                as="select"
                custom
                onChange={(e) => {
                  _onFilterChange("duration", e.target.value);
                }}
                className="bg-transparent m-0 ml-4"
                style={{ width: "100px", height: "44px" }}
                value={filter.duration}
              >
                {/* <option value="year">Year</option> */}
                <option value="month">Month</option>
                <option value="week">Week</option>
                <option value="day">Daily</option>
              </Form.Control>
            </Container>
            <div>
              <p className="m-0 text-right lead">
                {moment().format("DD-MMMM")}
              </p>
              <p
                style={{ whiteSpace: "nowrap", fontSize: "20px" }}
                className="font-weight-bold  text-right"
              >
                {currentTime}
              </p>
            </div>
          </div>
        </div>

        <Container>
          <h1>
            {isFetching ? (
              <h3 className="text-muted text-center">Fetching data....</h3>
            ) : null}
          </h1>
        </Container>

        <Container fluid className="px-0">
          <div className="d-flex justify-content-between my-3">
            <div className="card hoverable stats-card d-flex w-100 mr-3">
              <div className="card-content">
                <div className="lead">Customers</div>

                <div className="d-flex align-items-center justify-content-between mt-2">
                  <h1 className="text-black font-weight-bold">
                    {data?.customer + data?.customerprev}
                  </h1>
                </div>

                <div className="d-flex align-items-center justify-content-start">
                  <span className="tag tag-success d-flex align-items-center">
                    <AiOutlineArrowUp size={13} />
                    <strong>
                      {returnPercentage(data.customer, data.customerprev)}%
                    </strong>
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
                    {data?.order + data?.orderprev}
                  </h1>
                </div>

                <div className="d-flex align-items-center justify-content-start">
                  <span className="tag tag-success d-flex align-items-center">
                    <AiOutlineArrowUp size={13} />
                    <strong>
                      {returnPercentage(data?.order, data?.orderprev)}%
                    </strong>
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
                    {data?.subscription + data?.subscriptionprev}
                  </h1>
                </div>

                <div className="d-flex align-items-center justify-content-start">
                  <span className="tag tag-success d-flex align-items-center">
                    <AiOutlineArrowUp size={13} />
                    <strong>
                      {returnPercentage(
                        data?.subscription,
                        data?.subscriptionprev
                      )}
                      %
                    </strong>
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
                    {data?.agent + data?.agentprev}
                  </h1>
                </div>

                <div className="d-flex align-items-center justify-content-start">
                  <span className="tag tag-success d-flex align-items-center">
                    <AiOutlineArrowUp size={13} />
                    <strong>
                      {returnPercentage(data?.agent, data?.agentprev)}%
                    </strong>
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
                <table className="w-100">
                  <tbody>
                    {data?.data_total &&
                      Object.entries(data?.data_total).map((item) => (
                        <tr>
                          <td className="text-grey ">
                            <p>{item[0].replace("_", " ")}</p>
                          </td>
                          <td
                            className="text-left text-grey"
                            style={{ width: "30px" }}
                          >
                            <p>
                              <b>{item[1]}</b>
                            </p>
                          </td>
                          {/* <td className="text-right" style={{ width: "24px" }}>
                            <span className="tag tag-success d-flex align-items-center w-100">
                              <AiOutlineArrowUp size={13} />
                              <strong>10%</strong>
                            </span>
                          </td> */}
                        </tr>
                      ))}
                  </tbody>
                </table>
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
                </div>

                <div className="card-content chart-container">
                  {isBookingAnalyticsLoading ? (
                    <IsLoading />
                  ) : (
                    <BookingLineChart
                      data={BookingAnalytics?.booking}
                      xAxisDataKey="date"
                      dataKey="order"
                    />
                  )}
                </div>
              </div>

              {/* <div className="card ">
                <div className="card-header pb-3 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <strong>Bookings</strong>
                  </h5>
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
                </div>

                <div className="card-content chart-container">
                  <ChartBar />
                </div>
              </div> */}
            </div>
          </Container>
        </div>
      </Container>
    </>
  );
};

export default Dashboard;
