import { AxiosError } from "axios";
import moment from "moment";
import React, { useState } from "react";
import { Container } from "react-bootstrap";
type FocusedInputShape = "startDate" | "endDate" | null;

import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { handleApiError } from "../../hooks/handleApiErrors";
import IsLoading from "../../shared-components/isLoading";
import { useOrganisation } from "../../context/OrganisationContext";
import { primaryColor } from "../../utils/constants";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { WebsiteAnalyticsChart, BrandGMBChart } from "./Chart";
import "./dashboard.css";
import PageHeading from "../../shared-components/PageHeading";
import { Hammer } from "../ui/icon";

const bookingFilter = {
  datefrom: moment().subtract(7, "days").format("YYYY-MM-DD"),
  dateto: moment().format("YYYY-MM-DD"),
  startDate: moment().subtract(7, "days").format("YYYY-MM-DD"),
  endDate: moment().format("YYYY-MM-DD"),
  duration: "week",
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
  const { selectedOrg } = useOrganisation();
  const [filter, setFilter] = useState(bookingFilter);
  const [focusedInput, setFocusInput] = useState<FocusedInputShape | null>(
    null
  );
  const { data, isLoading, isFetching } = useQuery<any>(["analytics", filter], {
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });
  const { isLoading: isBookingAnalyticsLoading } = useQuery<any>(
    ["bookingAnalytics", filter],
    {
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );
  const { isLoading: isRevenueAnalyticsLoading } = useQuery<any>(
    ["revenueAnalytic", filter],
    {
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  const _onFilterChange = (idx: any, value: any) => {
    setFilter((prev) => ({
      ...prev,
      [idx]: value,
    }));
  };

  if (isLoading || isFetching) return <IsLoading />;

  // if (!data && (!isLoading || !isFetching)) {
  //   return (
  //     <Container fluid className="d-flex justify-content-center display-3">
  //       <div className="d-flex flex-column align-items-center">
  //         <BiSad color={primaryColor} />
  //         <span className="text-primary display-3">Something went wrong</span>
  //       </div>
  //     </Container>
  //   );
  // }

  return (
    <>
      <div className="view-padding d-flex justify-content-between align-items-center">
        <PageHeading
          icon={<Hammer size={24} />}
          title="Dashboard"
          description="Quick glance of your platform"
        />

        <div className="crm-users">
          <div className="d-flex align-items-center justify-content-start">
            <div className="d-flex align-items-center gap-2">
              <Hammer color={primaryColor} size={19} />
              <input
                type="date"
                value={filter.startDate}
                onChange={(e) => {
                  _onFilterChange("datefrom", e.target.value);
                  _onFilterChange("startDate", e.target.value);
                }}
                className="form-control"
                style={{ width: 160 }}
              />
              <span>to</span>
              <input
                type="date"
                value={filter.endDate}
                onChange={(e) => {
                  _onFilterChange("dateto", e.target.value);
                  _onFilterChange("endDate", e.target.value);
                }}
                className="form-control"
                style={{ width: 160 }}
              />
            </div>
          </div>
        </div>
      </div>
      <hr />

      <div className="view-padding">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat( auto-fit, minmax(200px, 1fr) )",
            gap: "20px",
          }}
          className="mb-4"
        >
          {selectedOrg?.store_type?.toLowerCase() === "crm" ? (
            <div className="card hoverable w-100 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <Hammer size={16} />
                  <h5 className="mb-0 font-weight-bold ml-2">Leads</h5>
                </div>

                <div className="d-flex align-items-center">
                  <div className="flex-fill">
                    <h4 className="mb-0 font-weight-bold text-warning">
                      {data?.leads?.active || 0}
                    </h4>
                    <span className="text-muted small">Active</span>
                  </div>

                  <div
                    className="mx-3"
                    style={{
                      width: "1px",
                      backgroundColor: "#dee2e6",
                      height: "50px",
                    }}
                  ></div>

                  <div className="flex-fill">
                    <h4 className="mb-0 font-weight-bold text-info">
                      {data?.leads?.new || 0}
                    </h4>
                    <span className="text-muted small">New</span>
                  </div>

                  <div
                    className="mx-3"
                    style={{
                      width: "1px",
                      backgroundColor: "#dee2e6",
                      height: "50px",
                    }}
                  ></div>

                  <div className="flex-fill">
                    <h4 className="mb-0 font-weight-bold text-success">
                      {data?.leads?.completed || 0}
                    </h4>
                    <span className="text-muted small">Completed</span>
                  </div>
                </div>
              </div>
              <div
                className="d-flex align-items-center justify-content-between p-2 px-4 border-top pointer"
                style={{
                  backgroundColor: "#f8f9fa",
                  cursor: "pointer",
                }}
                onClick={() => history.push("/crm")}
              >
                <span
                  className="font-weight-bold text-primary"
                  style={{ fontSize: "14px" }}
                >
                  Go to CRM
                </span>
                <Hammer className="text-primary" />
              </div>
            </div>
          ) : (
            <div className="card hoverable w-100 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                  </svg>
                  <h5 className="mb-0 font-weight-bold ml-2">Orders</h5>
                </div>

                <div className="d-flex align-items-center">
                  <div className="flex-fill">
                    <h4 className="mb-0 font-weight-bold text-warning">
                      {data?.order || 0}
                    </h4>
                    <span className="text-muted small">Pending</span>
                  </div>

                  <div
                    className="mx-3"
                    style={{
                      width: "1px",
                      backgroundColor: "#dee2e6",
                      height: "50px",
                    }}
                  ></div>

                  <div className="flex-fill">
                    <h4 className="mb-0 font-weight-bold text-info">
                      {data?.orderprev || 0}
                    </h4>
                    <span className="text-muted small">New</span>
                  </div>

                  <div
                    className="mx-3"
                    style={{
                      width: "1px",
                      backgroundColor: "#dee2e6",
                      height: "50px",
                    }}
                  ></div>

                  <div className="flex-fill">
                    <h4 className="mb-0 font-weight-bold text-success">
                      {(data?.order || 0) + (data?.orderprev || 0)}
                    </h4>
                    <span className="text-muted small">Total</span>
                  </div>
                </div>
              </div>

              <div
                className="d-flex align-items-center justify-content-between p-2 px-4 border-top pointer"
                style={{
                  backgroundColor: "#f8f9fa",
                  cursor: "pointer",
                }}
                onClick={() => history.push("/orders")}
              >
                <span
                  className="font-weight-bold text-primary"
                  style={{ fontSize: "14px" }}
                >
                  Go to Orders
                </span>
                <Hammer className="text-primary" />
              </div>
            </div>
          )}

          {selectedOrg?.store_type?.toLowerCase() === "crm" && (
            <>
              {/* Customers Card for CRM */}
              <div className="card hoverable w-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <Hammer size={16} />
                    <h5 className="mb-0 font-weight-bold ml-2">Customers</h5>
                  </div>

                  <div className="d-flex align-items-center">
                    <div className="flex-fill">
                      <h4 className="mb-0 font-weight-bold text-primary">
                        {data?.customer?.customers || 0}
                      </h4>
                      <span className="text-muted small">Total</span>
                    </div>

                    <div
                      className="mx-3"
                      style={{
                        width: "1px",
                        backgroundColor: "#dee2e6",
                        height: "50px",
                      }}
                    ></div>

                    <div className="flex-fill">
                      <h4 className="mb-0 font-weight-bold text-success">
                        {data?.customer?.new || 0}
                      </h4>
                      <span className="text-muted small">New</span>
                    </div>
                  </div>
                </div>
                <div
                  className="d-flex align-items-center justify-content-between p-2 px-4 border-top pointer"
                  style={{
                    backgroundColor: "#f8f9fa",
                    cursor: "pointer",
                  }}
                  onClick={() => history.push("/users")}
                >
                  <span
                    className="font-weight-bold text-primary"
                    style={{ fontSize: "14px" }}
                  >
                    Go to Customers
                  </span>
                  <Hammer className="text-primary" />
                </div>
              </div>

              <div className="card hoverable w-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <Hammer size={16} />
                    <h5 className="mb-0 font-weight-bold ml-2">Invoices</h5>
                  </div>

                  <div className="d-flex align-items-center">
                    <div className="flex-fill">
                      <h4 className="mb-0 font-weight-bold text-warning">
                        {data?.invoices?.pending || 0}
                      </h4>
                      <span className="text-muted small">Pending</span>
                    </div>

                    <div
                      className="mx-3"
                      style={{
                        width: "1px",
                        backgroundColor: "#dee2e6",
                        height: "50px",
                      }}
                    ></div>

                    <div className="flex-fill">
                      <h4 className="mb-0 font-weight-bold text-success">
                        {data?.invoices?.completed || 0}
                      </h4>
                      <span className="text-muted small">Paid</span>
                    </div>

                    <div
                      className="mx-3"
                      style={{
                        width: "1px",
                        backgroundColor: "#dee2e6",
                        height: "50px",
                      }}
                    ></div>

                    <div className="flex-fill">
                      <h4 className="mb-0 font-weight-bold text-primary">
                        {data?.invoices?.total || 0}
                      </h4>
                      <span className="text-muted small">Total</span>
                    </div>
                  </div>
                </div>
                <div
                  className="d-flex align-items-center justify-content-between p-2 px-4 border-top pointer"
                  style={{
                    backgroundColor: "#f8f9fa",
                    cursor: "pointer",
                  }}
                  onClick={() => history.push("/invoices")}
                >
                  <span
                    className="font-weight-bold text-primary"
                    style={{ fontSize: "14px" }}
                  >
                    Go to Invoices
                  </span>
                  <Hammer className="text-primary" />
                </div>
              </div>

              {/* Issues Card for CRM */}
              <div className="card hoverable w-100 border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <Hammer size={16} />
                    <h5 className="mb-0 font-weight-bold ml-2">Issues</h5>
                  </div>

                  <div className="d-flex align-items-center">
                    <div className="flex-fill">
                      <h4 className="mb-0 font-weight-bold text-danger">
                        {data?.issues?.open || 0}
                      </h4>
                      <span className="text-muted small">Open</span>
                    </div>

                    <div
                      className="mx-3"
                      style={{
                        width: "1px",
                        backgroundColor: "#dee2e6",
                        height: "50px",
                      }}
                    ></div>

                    <div className="flex-fill">
                      <h4 className="mb-0 font-weight-bold text-success">
                        {data?.issues?.close || 0}
                      </h4>
                      <span className="text-muted small">Closed</span>
                    </div>

                    <div
                      className="mx-3"
                      style={{
                        width: "1px",
                        backgroundColor: "#dee2e6",
                        height: "50px",
                      }}
                    ></div>

                    <div className="flex-fill">
                      <h4 className="mb-0 font-weight-bold text-primary">
                        {data?.issues?.total || 0}
                      </h4>
                      <span className="text-muted small">Total</span>
                    </div>
                  </div>
                </div>
                <div
                  className="d-flex align-items-center justify-content-between p-2 px-4 border-top pointer"
                  style={{
                    backgroundColor: "#f8f9fa",
                    cursor: "pointer",
                  }}
                  onClick={() => history.push("/issues")}
                >
                  <span
                    className="font-weight-bold text-primary"
                    style={{ fontSize: "14px" }}
                  >
                    Go to Issues
                  </span>
                  <Hammer className="text-primary" />
                </div>
              </div>
            </>
          )}
        </div>

        {data?.graphData && (
          <div className="card w-100 mb-4">
            <div className="card-header bg-gradient-primary text-white">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h5 className="mb-3 font-weight-bold text-black">
                    Performance Analytics
                  </h5>
                </div>
              </div>
            </div>
            <div className="" style={{ height: 420 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={data.graphData}
                  margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
                >
                  <defs>
                    <linearGradient
                      id="leadsGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#4F46E5"
                        stopOpacity={0.6}
                      />
                    </linearGradient>
                    <linearGradient
                      id="ordersGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#7C3AED"
                        stopOpacity={0.6}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                    opacity={0.5}
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    tickFormatter={(value) => {
                      if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
                      return value.toString();
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                      fontSize: "13px",
                    }}
                    labelStyle={{ color: "#1e293b", fontWeight: "bold" }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{
                      paddingBottom: "20px",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  />

                  {selectedOrg?.store_type?.toLowerCase() === "crm" ? (
                    <>
                      {/* CRM Chart Elements - Leads as Bar, others as Lines */}
                      <Bar
                        dataKey="leads"
                        fill="url(#leadsGradient)"
                        name="🚀 Leads"
                        barSize={35}
                        radius={[6, 6, 0, 0]}
                      />
                      <Line
                        type="monotone"
                        dataKey="customers"
                        stroke="#059669"
                        strokeWidth={3}
                        dot={{
                          r: 4,
                          fill: "#059669",
                          strokeWidth: 2,
                          stroke: "#ffffff",
                        }}
                        activeDot={{
                          r: 6,
                          fill: "#059669",
                          strokeWidth: 2,
                          stroke: "#ffffff",
                        }}
                        name="👥 Customers"
                      />
                      <Line
                        type="monotone"
                        dataKey="invoices"
                        stroke="#DC2626"
                        strokeWidth={3}
                        dot={{
                          r: 4,
                          fill: "#DC2626",
                          strokeWidth: 2,
                          stroke: "#ffffff",
                        }}
                        activeDot={{
                          r: 6,
                          fill: "#DC2626",
                          strokeWidth: 2,
                          stroke: "#ffffff",
                        }}
                        name="📄 Invoices"
                      />
                      <Line
                        type="monotone"
                        dataKey="issues"
                        stroke="#EA580C"
                        strokeWidth={3}
                        dot={{
                          r: 4,
                          fill: "#EA580C",
                          strokeWidth: 2,
                          stroke: "#ffffff",
                        }}
                        activeDot={{
                          r: 6,
                          fill: "#EA580C",
                          strokeWidth: 2,
                          stroke: "#ffffff",
                        }}
                        name="❗ Issues"
                      />
                    </>
                  ) : (
                    <>
                      {/* Ecommerce Chart Elements - Orders as Bar, others as Lines */}
                      <Bar
                        dataKey="orders"
                        fill="url(#ordersGradient)"
                        name="📦 Orders"
                        barSize={35}
                        radius={[6, 6, 0, 0]}
                      />
                      <Line
                        type="monotone"
                        dataKey="customers"
                        stroke="#059669"
                        strokeWidth={3}
                        dot={{
                          r: 4,
                          fill: "#059669",
                          strokeWidth: 2,
                          stroke: "#ffffff",
                        }}
                        activeDot={{
                          r: 6,
                          fill: "#059669",
                          strokeWidth: 2,
                          stroke: "#ffffff",
                        }}
                        name="👥 Customers"
                      />
                      <Line
                        type="monotone"
                        dataKey="agents"
                        stroke="#DC2626"
                        strokeWidth={3}
                        dot={{
                          r: 4,
                          fill: "#DC2626",
                          strokeWidth: 2,
                          stroke: "#ffffff",
                        }}
                        activeDot={{
                          r: 6,
                          fill: "#DC2626",
                          strokeWidth: 2,
                          stroke: "#ffffff",
                        }}
                        name="👨‍💼 Agents"
                      />
                    </>
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

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
                <div className="social-icons">
                  <Hammer />
                  <Hammer />
                  <Hammer />
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
