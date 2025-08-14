import { AxiosError } from "axios";
import moment from "moment";
import React, { useState } from "react";
type FocusedInputShape = "startDate" | "endDate" | null;

import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { handleApiError } from "../../hooks/handleApiErrors";
import IsLoading from "../../shared-components/isLoading";
import { useOrganisation } from "../../context/OrganisationContext";
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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
  LayoutGrid,
  ReceiptText,
  Triangle,
  Users,
  Bug,
  ArrowRight,
  Instagram,
  Facebook,
  Youtube,
  ShoppingCart,
  TrendingUp,
  Calendar,
} from "lucide-react";

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
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Quick glance of your platform performance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <input
            type="date"
            value={filter.startDate}
            onChange={(e) => {
              _onFilterChange("datefrom", e.target.value);
              _onFilterChange("startDate", e.target.value);
            }}
            className="flex h-9 w-40 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <span className="text-sm text-muted-foreground">to</span>
          <input
            type="date"
            value={filter.endDate}
            onChange={(e) => {
              _onFilterChange("dateto", e.target.value);
              _onFilterChange("endDate", e.target.value);
            }}
            className="flex h-9 w-40 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {selectedOrg?.store_type?.toLowerCase() === "crm" ? (
          <Card className="col-span-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Triangle className="h-4 w-4 text-orange-500" />
                Leads
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">
                    {data?.leads?.active || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">
                    {data?.leads?.new || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">New</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {data?.leads?.completed || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50">
              <Button
                variant="ghost"
                className="w-full justify-between"
                onClick={() => history.push("/crm")}
              >
                Go to CRM
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="col-span-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-purple-500" />
                Orders
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">
                    {data?.order || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">
                    {data?.orderprev || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">New</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {(data?.order || 0) + (data?.orderprev || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50">
              <Button
                variant="ghost"
                className="w-full justify-between"
                onClick={() => history.push("/orders")}
              >
                Go to Orders
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {selectedOrg?.store_type?.toLowerCase() === "crm" && (
          <>
            {/* Customers Card for CRM */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data?.customer?.customers || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{data?.customer?.new || 0} new this period
                </p>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 p-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full h-8 justify-between"
                  onClick={() => history.push("/users")}
                >
                  View customers
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Invoices</CardTitle>
                <ReceiptText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Pending
                    </span>
                    <Badge
                      variant="outline"
                      className="text-orange-600 border-orange-200"
                    >
                      {data?.invoices?.pending || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Paid</span>
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-200"
                    >
                      {data?.invoices?.completed || 0}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total</span>
                    <span className="text-lg font-bold">
                      {data?.invoices?.total || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 p-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full h-8 justify-between"
                  onClick={() => history.push("/invoices")}
                >
                  View invoices
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>

            {/* Issues Card for CRM */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Support Issues
                </CardTitle>
                <Bug className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Open</span>
                    <Badge variant="destructive">
                      {data?.issues?.open || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Closed
                    </span>
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-200"
                    >
                      {data?.issues?.close || 0}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total</span>
                    <span className="text-lg font-bold">
                      {data?.issues?.total || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 p-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full h-8 justify-between"
                  onClick={() => history.push("/issues")}
                >
                  View issues
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>
          </>
        )}
      </div>

      {/* Performance Analytics Chart */}
      {data?.graphData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
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
          </CardContent>
        </Card>
      )}

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Website Analytics Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Website Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Active Users
                </p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  New Users
                </p>
                <p className="text-2xl font-bold">500</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  All Time
                </p>
                <p className="text-2xl font-bold">5.4K</p>
              </div>
            </div>

            <div className="h-[280px] w-full">
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
          </CardContent>
        </Card>

        {/* Brand & GMB Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Brand & GMB
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Reviews
                </p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Comments
                </p>
                <p className="text-2xl font-bold">20</p>
              </div>
            </div>

            <div className="h-[280px] w-full">
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

            <div className="flex items-center justify-center gap-4 pt-4 border-t">
              <Instagram className="h-5 w-5 text-pink-500" />
              <Facebook className="h-5 w-5 text-blue-600" />
              <Youtube className="h-5 w-5 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
