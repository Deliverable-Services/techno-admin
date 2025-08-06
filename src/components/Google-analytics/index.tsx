import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import WorldMap from "react-world-map";
import { GiShadowFollower } from "react-icons/gi";
import { RiUserFollowFill } from "react-icons/ri";
import { IoStatsChart } from "react-icons/io5";
import { MdAllInclusive } from "react-icons/md";
import "./google-analytics.css";

const chartData1 = [
    { value: 10 },
    { value: 90 },
    { value: 30 },
    { value: 0 },
    { value: 100 }
];

const chartData2 = [
    { value: 10 },
    { value: 30 },
    { value: 50 },
    { value: 70 },
    { value: 90 }
];

const chartData3 = [
    { value: 65 },
    { value: 10 },
    { value: 68 },
    { value: 20 },
    { value: 90 }
];

const cards = [
    {
        title: "Top Country",
        value: "45.5%",
        main: "Indonesia",
        chartData: chartData1,
        others: [
            { name: "United States", percent: "15.5%", color: "#FFA726" },
            { name: "China", percent: "12.6%", color: "#EF5350" }
        ]
    },
    {
        title: "Top Country",
        value: "76.8%",
        main: "Nganjuk",
        chartData: chartData2,
        others: [
            { name: "Surabaya", percent: "38.6%", color: "#FFA726" },
            { name: "Yogyakarta", percent: "28.4%", color: "#EF5350" }
        ]
    },
    {
        title: "Top Country",
        value: "76.8%",
        main: "English",
        chartData: chartData3,
        others: [
            { name: "Indonesia", percent: "40.0%", color: "#FFA726" },
            { name: "Russian", percent: "4.8%", color: "#EF5350" }
        ]
    }
];


const COLORS = ["#7e56da", "#3ac9a7"];
const GENDER_DATA = [
    { name: "Women", value: 70 },
    { name: "Men", value: 30 }
];

const AGE_DATA = [
    { name: "13-17", value: 60 },
    { name: "18-24", value: 120 },
    { name: "25-34", value: 100 },
    { name: "35-44", value: 40 },
    { name: "45-54", value: 30 },
    { name: "55-64", value: 20 },
    { name: "65+", value: 10 }
];

const HEATMAP_GRID = Array(7).fill(0).map((_, i) =>
    Array(12).fill(0).map(() => Math.floor(Math.random() * 4))
);

const GoogleAnalytics = () => {
    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                <h4 className="mb-2 font-weight-bold">Analytics</h4>
                <div>
                    <button className="btn btn-light btn-sm mr-2">7 Days</button>
                    <button className="btn btn-light btn-sm mr-2 text-primary bg-muted">1 Month</button>
                    <button className="btn btn-light btn-sm mr-2">3 Months</button>
                    <input type="date" className="form-control form-control-sm d-inline-block rounded-8px" style={{ width: 150 }} />
                </div>
            </div>

            <div className="row text-center mb-4">
                {[{ label: "Total Posts", value: "260", change: "+26.84%", icon: <MdAllInclusive /> },
                { label: "Followers", value: "2,648", change: "+26.32%", icon: <GiShadowFollower /> },
                { label: "Following", value: "768", change: "-0.86%", icon: <RiUserFollowFill /> },
                { label: "Engagement", value: "82.6%", change: "+8.64%", icon: <IoStatsChart /> }
                ].map((item, i) => (
                    <div className="col-6 col-md-3 mb-3 g-card" key={i}>
                        <div className="card  border-0">
                            <div className="global-card">
                                <span className="pb-2 d-block ">{item.icon}</span>
                                <h1 className="mb-0 font-weight-bold pb-2">{item.value}</h1>
                                <small className="text-muted g-card-heading">{item.label}</small>
                                <div className={`mt-2 weight-600 small ${item.change.includes("-") ? "text-danger" : "text-green"}`}>{item.change}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row mb-4">
                <div className="col-md-8 mb-4">
                    <div className="global-card h-100 border-0">
                        <div className="">
                            <div className="d-flex justify-content-between mb-2">
                                <div>
                                    <h6 className="font-weight-bold pb-0 mb-0 g-card-heading">Demographic Audience</h6>
                                    <small>See insights on how your profile has grown and changed over time</small>
                                </div>


                                <select className="form-control form-control-sm" style={{ width: 120 }}>
                                    <option>All Gender</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                            </div>
                            <div style={{ height: 300 }} className="g-map pt-3">
                                <WorldMap
                                    color="red" // Base color
                                    valuePrefix="Audience: "
                                    size="responsive"
                                    selected="in"
                                    data={[
                                        { country: "in", value: 20 }, // India
                                        { country: "us", value: 10 }, // USA
                                        { country: "cn", value: 15 }, // China
                                        { country: "ru", value: 8 },  // Russia
                                        { country: "br", value: 5 },  // Brazil
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 mb-4">
                    <div className="card  mb-3 border-0">
                        <div className="global-card">
                            <h6 className="font-weight-bold pb-3 g-card-heading">Audience Online Activity</h6>
                            <div className="d-flex flex-wrap" style={{ gap: 4 }}>
                                {HEATMAP_GRID.flat().map((val, i) => (
                                    <div key={i} style={{
                                        width: 16,
                                        height: 16,
                                        backgroundColor: [`#eee`, `#c5b4f0`, `#8d6fe6`, `#6a42d9`][val],
                                        borderRadius: 3
                                    }}></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="card  border-0">
                        <div className="global-card">
                            <h6 className="font-weight-bold pb-3 g-card-heading">Statistic By Gender</h6>
                            <ResponsiveContainer width="100%" height={150}>
                                <PieChart>
                                    <Pie
                                        data={GENDER_DATA}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={30}
                                        outerRadius={60}
                                        label={({ name }) => name}
                                    >
                                        {GENDER_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mb-4">
                {cards.map((card, idx) => (
                    <div className="col-md-4 mb-3" key={idx}>
                        <div className="card h-100 border-0 shadow-sm">
                            <div className="country-card p-3">
                                <h6 className="font-weight-bold  mb-2 g-card-heading">{card.title}</h6>
                                <div className="d-flex align-items-center justify-content-between mb-1">
                                    <h1 className="font-weight-bold mb-0">{card.value}</h1>
                                    <div className="chart-wrapper-new">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={card.chartData}>
                                                <Tooltip contentStyle={{ display: "none" }} cursor={false} />
                                                <Line
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke="#00C49F"
                                                    strokeWidth={2}
                                                    dot={false}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center mb-3 gap-3">
                                    <div className="dot red"></div>
                                    <span className="text-danger ms-1">{card.main}</span>
                                </div>
                                {card.others.map((o, i) => (
                                    <div
                                        className="d-flex justify-content-between align-items-center mb-1"
                                        key={i}
                                    >
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="dot me-2" style={{ backgroundColor: o.color }}></div>
                                            <span>{o.name}</span>
                                        </div>
                                        <span className="fw-bold">{o.percent}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card  border-0">
                <div className="global-card">
                    <h6 className="font-weight-bold">Audience by Age</h6>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={AGE_DATA} layout="vertical">
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" />
                            <Tooltip />
                            <Bar dataKey="value" fill="#7e56da" barSize={10} radius={[0, 10, 10, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default GoogleAnalytics;
