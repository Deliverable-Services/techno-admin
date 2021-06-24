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

const ChartBar = () => {
  return (
    <ResponsiveContainer>
      <BarChart width={"100%"} height={300} data={data}>
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis
          dataKey="name"
          tickLine={false}
          padding={{ left: 20, right: 20 }}
        />
        <YAxis axisLine={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="data1" fill={primaryColor} />
        <Bar dataKey="data2" fill={secondaryColor} />
      </BarChart>
    </ResponsiveContainer>
  );
};
export { ChartLine, ChartArea, ChartBar };
