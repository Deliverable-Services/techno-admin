import React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { primaryColor, secondaryColor } from "../../utils/constants";

const data = [
  {
    name: "Data A",
    data1: 4000,
    data2: 2400,
    data3: 2400,
  },
  {
    name: "Data B",
    data1: 3000,
    data2: 1398,
    data3: 2210,
  },
  {
    name: "Data C",
    data1: 2000,
    data2: 9800,
    data3: 2290,
  },
  {
    name: "Data D",
    data1: 2780,
    data2: 3908,
    data3: 2000,
  },
];

const ChartLine = () => {
  return (
    <ResponsiveContainer>
      <LineChart
        width={"100%"}
        height={300}
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        {/* <CartesianGrid str /> */}
        <XAxis
          dataKey="name"
          tickLine={false}
          padding={{ left: 20, right: 20 }}
        />
        <YAxis tickLine={false} axisLine={false} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="data2"
          stroke={primaryColor}
          activeDot={{ r: 8 }}
        />
        {/* <Line type="monotone" dataKey="data1" stroke="#00ff00" />
                <Line type="monotone" dataKey="data3" stroke="#0000ff" /> */}
      </LineChart>
    </ResponsiveContainer>
  );
};
const BookingLineChart = ({ data, xAxisDataKey, dataKey }) => {
  return (
    <ResponsiveContainer>
      <LineChart
        width={"100%"}
        height={300}
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        {/* <CartesianGrid str /> */}
        <XAxis
          dataKey={xAxisDataKey}
          tickLine={false}
          padding={{ left: 20, right: 20 }}
        />
        <YAxis tickLine={false} axisLine={false} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={primaryColor}
          activeDot={{ r: 8 }}
        />
        {/* <Line type="monotone" dataKey="data1" stroke="#00ff00" />
                <Line type="monotone" dataKey="data3" stroke="#0000ff" /> */}
      </LineChart>
    </ResponsiveContainer>
  );
};
const RevenueLineChart = ({ data, xAxisDataKey, dataKey1, dataKey2 }) => {
  return (
    <ResponsiveContainer>
      <LineChart
        width={"100%"}
        height={300}
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        {/* <CartesianGrid str /> */}
        <XAxis
          dataKey={xAxisDataKey}
          tickLine={false}
          padding={{ left: 20, right: 20 }}
        />
        <YAxis tickLine={false} axisLine={false} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey={dataKey1}
          stroke={primaryColor}
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey={dataKey2}
          stroke={secondaryColor}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

const ChartArea = () => {
  return (
    <ResponsiveContainer>
      <AreaChart
        width={"100%"}
        height={300}
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={secondaryColor} stopOpacity={0.8} />
            <stop offset="95%" stopColor={secondaryColor} stopOpacity={0} />
          </linearGradient>
          {/* <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient> */}
        </defs>
        <XAxis
          dataKey="name"
          tickLine={false}
          padding={{ left: 20, right: 20 }}
        />
        <YAxis tickLine={false} axisLine={false} />
        {/* <CartesianGrid strokeDasharray="1 1" /> */}
        <Tooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey="data2"
          stroke={secondaryColor}
          fillOpacity={1}
          fill="url(#colorUv)"
        />
        {/* <Area type="monotone" dataKey="data2" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" /> */}
      </AreaChart>
    </ResponsiveContainer>
  );
};

const ChartBar = ({ data, xAxisDataKey, dataKey1, dataKey2 }) => {
  return (
    <ResponsiveContainer>
      <BarChart width={"100%"} height={300} data={data}>
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis
          dataKey={xAxisDataKey}
          tickLine={false}
          padding={{ left: 20, right: 20 }}
        />
        <YAxis axisLine={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey={dataKey1} fill={primaryColor} />
        <Bar dataKey={dataKey2} fill={secondaryColor} />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Website Analytics Chart with three lines
const WebsiteAnalyticsChart = ({ data, xAxisDataKey, dataKey }) => {
  return (
    <ResponsiveContainer>
      <LineChart
        width={"100%"}
        height={250}
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <XAxis
          dataKey={xAxisDataKey}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: '#666' }}
          padding={{ left: 10, right: 10 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: '#666' }}
          tickFormatter={(value) => {
            if (value >= 1000) return `${value / 1000}K`;
            return value.toString();
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        />
        <Legend
          verticalAlign="top"
          align="right"
          wrapperStyle={{ paddingBottom: '10px' }}
        />
        <Line
          type="monotone"
          dataKey="active"
          stroke="#3B82F6"
          strokeWidth={2}
          activeDot={{ r: 6, fill: '#3B82F6' }}
          dot={{ r: 3, fill: '#3B82F6' }}
        />
        <Line
          type="monotone"
          dataKey="new"
          stroke="#10B981"
          strokeWidth={2}
          activeDot={{ r: 6, fill: '#10B981' }}
          dot={{ r: 3, fill: '#10B981' }}
        />
        <Line
          type="monotone"
          dataKey="alltime"
          stroke="#F59E0B"
          strokeWidth={2}
          activeDot={{ r: 6, fill: '#F59E0B' }}
          dot={{ r: 3, fill: '#F59E0B' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

// Brand & GMB Chart with two lines
const BrandGMBChart = ({ data, xAxisDataKey, dataKey1, dataKey2 }) => {
  return (
    <ResponsiveContainer>
      <LineChart
        width={"100%"}
        height={250}
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <XAxis
          dataKey={xAxisDataKey}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: '#666' }}
          padding={{ left: 10, right: 10 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: '#666' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        />
        <Legend
          verticalAlign="top"
          align="right"
          wrapperStyle={{ paddingBottom: '10px' }}
        />
        <Line
          type="monotone"
          dataKey={dataKey1}
          stroke="#8B5CF6"
          strokeWidth={2}
          activeDot={{ r: 6, fill: '#8B5CF6' }}
          dot={{ r: 3, fill: '#8B5CF6' }}
        />
        <Line
          type="monotone"
          dataKey={dataKey2}
          stroke="#EF4444"
          strokeWidth={2}
          activeDot={{ r: 6, fill: '#EF4444' }}
          dot={{ r: 3, fill: '#EF4444' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export { ChartLine, ChartArea, ChartBar, BookingLineChart, RevenueLineChart, WebsiteAnalyticsChart, BrandGMBChart };
