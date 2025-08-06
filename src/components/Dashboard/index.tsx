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
import { isDesktop, primaryColor } from "../../utils/constants";
import {
  BookingLineChart,
  ChartArea,
  ChartBar,
  ChartLine,
  RevenueLineChart,
  WebsiteAnalyticsChart,
  BrandGMBChart,
} from "./Chart";
import useUserProfileStore from "../../hooks/useUserProfileStore";
import "./dashboard.css";

interface IDates {
  start_date: Moment;
  end_date: Moment;
  focusedInput: FocusedInputShape | null;
}

const returnPercentage = (newData: number, lastTotal: number) => {
  const p = newData / (lastTotal || 1);
  return (p * 100).toFixed(1);
};

const bookingFilter = {
  datefrom: moment().startOf("month").format("YYYY-MM-DD"),
  dateto: moment().endOf("month").format("YYYY-MM-DD"),
  duration: "month",
};

const defaultData = [
  { date: "2025-07-29", active: 120, new: 30, alltime: 500 },
  { date: "2025-07-30", active: 150, new: 40, alltime: 540 },
  { date: "2025-07-31", active: 200, new: 60, alltime: 600 },
  { date: "2025-08-01", active: 180, new: 50, alltime: 650 },
  { date: "2025-08-02", active: 220, new: 70, alltime: 720 },
  { date: "2025-08-03", active: 250, new: 90, alltime: 800 },
  { date: "2025-08-04", active: 300, new: 100, alltime: 900 },
];

const defaultDataSingle = [
  { date: "2025-07-29", total_amount: 1200, discount_amount: 150 },
  { date: "2025-07-30", total_amount: 1500, discount_amount: 200 },
  { date: "2025-07-31", total_amount: 1700, discount_amount: 180 },
  { date: "2025-08-01", total_amount: 1600, discount_amount: 220 },
  { date: "2025-08-02", total_amount: 1800, discount_amount: 250 },
  { date: "2025-08-03", total_amount: 2000, discount_amount: 300 },
  { date: "2025-08-04", total_amount: 2100, discount_amount: 320 },
];

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
  const { data: RevenueAnalytics, isLoading: isRevenueAnalyticsLoading } =
    useQuery<any>(["revenueAnalytic", , filter], {
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    });
  const loggedInUser = useUserProfileStore((state) => state.user);

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
        <div className="">
          <div className="card-content d-flex flex-row-reverse align-items-center justify-content-between">
            <div className="d-flex align-items-center justify-content-start">
              <DateRangePicker
                customInputIcon={<BsCalendar color={primaryColor} size={19} />}
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
            </div>
          </div>
        </div>

        <Container fluid className="px-0">
          <div
            className="my-4"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat( auto-fit, minmax(200px, 1fr) )",
              gap: "20px",
            }}
          >
            <div className="card hoverable d-flex w-100">
              <div className="card-content">
                <div className="card-data-box d-flex">
                  <div className="w-100">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <strong style={{ fontSize: "16px" }}>Leads</strong>
                      <div className="icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-people-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                        </svg>
                      </div>
                    </div>

                    <div
                      className="d-flex align-items-center justify-content-between"
                      style={{ width: "80%" }}
                    >
                      <div>
                        <h3
                          className="text-grey"
                          style={{
                            fontSize: "16px",
                            fontWeight: "400",
                            marginBottom: "0",
                          }}
                        >
                          Active
                        </h3>
                        <p
                          className="text-black font-weight-bold"
                          style={{ fontSize: "28px" }}
                        >
                          {data?.customer + data?.customerprev}
                        </p>
                      </div>
                      <div
                        style={{
                          borderLeft: "1px solid black",
                          height: "60px",
                        }}
                      />

                      <div>
                        <h3
                          className="text-grey"
                          style={{
                            fontSize: "16px",
                            fontWeight: "400",
                            marginBottom: "0",
                          }}
                        >
                          New
                        </h3>
                        <p
                          className="text-black font-weight-bold"
                          style={{ fontSize: "28px" }}
                        >
                          {data?.customer + data?.customerprev}
                        </p>
                      </div>
                      <div style={{ borderLeft: '1px solid black', height: '60px', }} />

                      <div>
                        <h3 className="text-grey" style={{ fontSize: '16px', fontWeight: '400', marginBottom: '0' }}>
                          S
                        </h3>
                        <p className="text-black font-weight-bold" style={{ fontSize: '28px' }}>
                          {data?.customer + data?.customerprev}
                        </p>
                      </div>
                    </div>
                    {/* <div className="d-flex align-items-center justify-content-start">
                      <span className="tag  per-tag d-flex align-items-center">
                        <AiOutlineArrowUp size={13} />
                        <strong>
                          {returnPercentage(data.customer, data.customerprev)}%
                        </strong>
                      </span>

                      <span className="text-muted ml-2 tag-text">
                        from {data?.customerprev}
                      </span>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>

            <div className="card hoverable d-flex w-100">
              <div className="card-content">
                <div className="card-data-box d-flex">
                  <div className="w-100">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <strong style={{ fontSize: "14px" }}>Customers</strong>
                      <div className="icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-box2-heart"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 7.982C9.664 6.309 13.825 9.236 8 13 2.175 9.236 6.336 6.31 8 7.982" />
                          <path d="M3.75 0a1 1 0 0 0-.8.4L.1 4.2a.5.5 0 0 0-.1.3V15a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V4.5a.5.5 0 0 0-.1-.3L13.05.4a1 1 0 0 0-.8-.4zm0 1H7.5v3h-6zM8.5 4V1h3.75l2.25 3zM15 5v10H1V5z" />
                        </svg>
                      </div>
                    </div>

                    <div
                      className="d-flex align-items-center justify-content-between"
                      style={{ width: "80%" }}
                    >
                      <div>
                        <h3
                          className="text-grey"
                          style={{
                            fontSize: "16px",
                            fontWeight: "400",
                            marginBottom: "0",
                          }}
                        >
                          Active
                        </h3>
                        <p
                          className="text-black font-weight-bold"
                          style={{ fontSize: "28px" }}
                        >
                          {data?.customer + data?.customerprev}
                        </p>
                      </div>
                      <div
                        style={{
                          borderLeft: "1px solid black",
                          height: "60px",
                        }}
                      />

                      <div>
                        <h3
                          className="text-grey"
                          style={{
                            fontSize: "16px",
                            fontWeight: "400",
                            marginBottom: "0",
                          }}
                        >
                          New
                        </h3>
                        <p
                          className="text-black font-weight-bold"
                          style={{ fontSize: "28px" }}
                        >
                          {data?.customer + data?.customerprev}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card hoverable d-flex w-100">
              <div className="card-content">
                <div className="card-data-box d-flex">
                  <div className="w-100">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <strong style={{ fontSize: "14px" }}>Invoices</strong>
                      <div className="icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-eye"
                          viewBox="0 0 16 16"
                        >
                          <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                          <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                        </svg>
                      </div>
                    </div>
                    <div
                      className="d-flex align-items-center justify-content-between"
                      style={{ width: "80%" }}
                    >
                      <div>
                        <h3
                          className="text-grey"
                          style={{
                            fontSize: "16px",
                            fontWeight: "400",
                            marginBottom: "0",
                          }}
                        >
                          Total
                        </h3>
                        <p
                          className="text-black font-weight-bold"
                          style={{ fontSize: "28px" }}
                        >
                          $ {data?.customer + data?.customerprev}
                        </p>
                      </div>
                      <div
                        style={{
                          borderLeft: "1px solid black",
                          height: "60px",
                        }}
                      />

                      <div>
                        <h3
                          className="text-grey"
                          style={{
                            fontSize: "16px",
                            fontWeight: "400",
                            marginBottom: "0",
                          }}
                        >
                          New
                        </h3>
                        <p
                          className="text-black font-weight-bold"
                          style={{ fontSize: "28px" }}
                        >
                          $ {data?.customer + data?.customerprev}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card hoverable d-flex w-100">
              <div className="card-content">
                <div className="card-data-box d-flex">
                  <div className="w-100">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <strong style={{ fontSize: "14px" }}>Issues</strong>
                      <div className="icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-person-check-fill"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"
                          />
                          <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                        </svg>
                      </div>
                    </div>

                    <div
                      className="d-flex align-items-center justify-content-between"
                      style={{ width: "80%" }}
                    >
                      <div>
                        <h3
                          className="text-grey"
                          style={{
                            fontSize: "16px",
                            fontWeight: "400",
                            marginBottom: "0",
                          }}
                        >
                          Open
                        </h3>
                        <p
                          className="text-black font-weight-bold"
                          style={{ fontSize: "28px" }}
                        >
                          {data?.customer + data?.customerprev}
                        </p>
                      </div>
                      <div
                        style={{
                          borderLeft: "1px solid black",
                          height: "60px",
                        }}
                      />

                      <div>
                        <h3
                          className="text-grey"
                          style={{
                            fontSize: "16px",
                            fontWeight: "400",
                            marginBottom: "0",
                          }}
                        >
                          Completed
                        </h3>
                        <p
                          className="text-black font-weight-bold"
                          style={{ fontSize: "28px" }}
                        >
                          {data?.customer + data?.customerprev}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>

        <div className="dashboard-page w-100 mt-4">
          <Container fluid className=" mt-0 pl-2 pr-0">
            <div className="analytics-dashboard">
              {/* Website Analytics Section */}
              <div className="analytics-section">
                <div className="analytics-header">
                  <h3 className="analytics-title">Website Analytics</h3>
                </div>

                <div className="metrics-row">
                  <div className="metric-card">
                    <div className="metric-label">Active Users</div>
                    <div className="metric-value">24</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-label">New users</div>
                    <div className="metric-value">500</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-label">Alltime users</div>
                    <div className="metric-value">5.4K</div>
                  </div>
                </div>

                <div className="chart-container">
                  <div className="chart-wrapper">
                    {isBookingAnalyticsLoading ? (
                      <IsLoading />
                    ) : (
                      <WebsiteAnalyticsChart
                        data={defaultData}
                        xAxisDataKey="date"
                        dataKey="order"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Brand & GMB Section */}
              <div className="analytics-section">
                <div className="analytics-header">
                  <h3 className="analytics-title">Brand & GMB</h3>
                </div>

                <div className="metrics-row">
                  <div className="metric-card">
                    <div className="metric-label">Reviews</div>
                    <div className="metric-value">5</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-label">Comments</div>
                    <div className="metric-value">20</div>
                  </div>
                </div>

                <div className="chart-container">
                  <div className="chart-wrapper">
                    {isRevenueAnalyticsLoading ? (
                      <IsLoading />
                    ) : (
                      <BrandGMBChart
                        data={defaultDataSingle}
                        xAxisDataKey="date"
                        dataKey1="total_amount"
                        dataKey2="discount_amount"
                      />
                    )}
                  </div>
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
