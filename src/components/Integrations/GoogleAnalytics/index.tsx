import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import googleAnalyticsService, {
  GoogleAnalyticsConnectorStatus,
  GoogleAnalyticsAccount,
  GoogleAnalyticsProperty,
  GoogleAnalyticsReport,
  GoogleAnalyticsRealTimeData,
  GoogleAnalyticsAudienceData,
} from "../../../services/googleAnalyticsService";
import { useOrganisation } from "../../../context/OrganisationContext";
import { showMsgToast } from "../../../utils/showMsgToast";
// import "./google-analytics.css";
import { Hammer } from "../../ui/icon";

const GoogleAnalytics = () => {
  const { selectedOrg: organisation } = useOrganisation();
  const [status, setStatus] = useState<GoogleAnalyticsConnectorStatus | null>(
    null
  );
  const [accounts, setAccounts] = useState<GoogleAnalyticsAccount[]>([]);
  const [properties, setProperties] = useState<GoogleAnalyticsProperty[]>([]);
  const [propertyList, setPropertyList] = useState<GoogleAnalyticsProperty[]>(
    []
  );
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [reports, setReports] = useState<GoogleAnalyticsReport | null>(null);
  const [realTimeData, setRealTimeData] =
    useState<GoogleAnalyticsRealTimeData | null>(null);
  const [audienceData, setAudienceData] =
    useState<GoogleAnalyticsAudienceData | null>(null);
  const [countryData, setCountryData] = useState<GoogleAnalyticsReport | null>(
    null
  );
  const [pageData, setPageData] = useState<GoogleAnalyticsReport | null>(null);
  const [deviceData, setDeviceData] = useState<GoogleAnalyticsReport | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (organisation?.id) {
      loadStatus();
    }
  }, [organisation?.id]);

  useEffect(() => {
    if (status?.connected && organisation?.id) {
      loadAccounts();
      // Fetch all accessible properties across all accounts to allow direct selection
      (async () => {
        try {
          const props = await googleAnalyticsService.getAllAccessibleProperties(
            organisation.id
          );
          const normalized = props.map((p: any) => ({
            ...p,
            propertyId:
              p.propertyId || (p.name ? p.name.replace("properties/", "") : ""),
          }));
          setPropertyList(normalized);
          if (!selectedProperty && normalized.length > 0) {
            const pid = normalized[0].propertyId;
            setSelectedProperty(pid);
            try {
              await googleAnalyticsService.updateSelection(organisation.id, {
                propertyId: pid,
              });
            } catch {}
          }
        } catch {}
      })();
      // Restore persisted selection if present
      const persisted = window.localStorage.getItem(
        `ga_selection_${organisation.id}`
      );
      if (persisted) {
        try {
          const parsed = JSON.parse(persisted);
          if (parsed.accountName) setSelectedAccount(parsed.accountName);
          if (parsed.propertyId) setSelectedProperty(parsed.propertyId);
        } catch {}
      }
    }
  }, [status?.connected, organisation?.id]);

  useEffect(() => {
    if (selectedAccount && organisation?.id) {
      loadProperties(selectedAccount);
      // persist selection
      try {
        const persisted = JSON.parse(
          window.localStorage.getItem(`ga_selection_${organisation.id}`) || "{}"
        );
        window.localStorage.setItem(
          `ga_selection_${organisation.id}`,
          JSON.stringify({ ...persisted, accountName: selectedAccount })
        );
      } catch {}
    }
  }, [selectedAccount, organisation?.id]);

  useEffect(() => {
    if (selectedProperty && organisation?.id) {
      loadReports();
      loadRealTimeData();
      loadAudienceData();
      loadCountryData();
      loadPageData();
      loadDeviceData();
      // persist selection
      try {
        const persisted = JSON.parse(
          window.localStorage.getItem(`ga_selection_${organisation.id}`) || "{}"
        );
        window.localStorage.setItem(
          `ga_selection_${organisation.id}`,
          JSON.stringify({ ...persisted, propertyId: selectedProperty })
        );
      } catch {}
    }
  }, [selectedProperty, organisation?.id, dateRange]);

  const loadStatus = async () => {
    if (!organisation?.id) return;

    try {
      setLoading(true);
      const statusData = await googleAnalyticsService.getStatus(
        organisation.id
      );
      setStatus(statusData);
      // Load persisted selection from backend metadata if present
      const accountFromServer = (statusData as any).selected_account;
      const propertyFromServer = (statusData as any).selected_property;
      if (accountFromServer) setSelectedAccount(accountFromServer);
      if (propertyFromServer) setSelectedProperty(propertyFromServer);
    } catch (error) {
      console.error("Failed to load Google Analytics status:", error);
      showMsgToast("Failed to load Google Analytics status");
    } finally {
      setLoading(false);
    }
  };

  const loadAccounts = async () => {
    if (!organisation?.id) return;

    try {
      setLoading(true);
      const accountsData = await googleAnalyticsService.getAccounts(
        organisation.id
      );
      setAccounts(accountsData);
      if (accountsData.length > 0 && !selectedAccount) {
        const firstAccount = accountsData[0].name;
        setSelectedAccount(firstAccount);
        try {
          await googleAnalyticsService.updateSelection(organisation.id, {
            accountName: firstAccount,
          });
        } catch {}
      }
    } catch (error) {
      console.error("Failed to load Google Analytics accounts:", error);
      showMsgToast("Failed to load Google Analytics accounts");
    } finally {
      setLoading(false);
    }
  };

  const loadProperties = async (accountName: string) => {
    if (!organisation?.id) return;

    try {
      setLoading(true);
      const propertiesData = await googleAnalyticsService.getProperties(
        organisation.id,
        accountName
      );
      const normalized = propertiesData.map((p: any) => ({
        ...p,
        propertyId:
          p.propertyId || (p.name ? p.name.replace("properties/", "") : ""),
      }));
      setProperties(normalized);
      if (normalized.length > 0 && !selectedProperty) {
        const first = normalized[0];
        const pid =
          first.propertyId ||
          (first.name ? first.name.replace("properties/", "") : "");
        setSelectedProperty(pid);
        try {
          await googleAnalyticsService.updateSelection(organisation.id, {
            propertyId: pid,
          });
        } catch {}
      }
    } catch (error) {
      console.error("Failed to load Google Analytics properties:", error);
      showMsgToast("Failed to load Google Analytics properties");
    } finally {
      setLoading(false);
    }
  };

  const loadReports = async () => {
    if (!organisation?.id || !selectedProperty) return;

    try {
      setLoading(true);
      const reportsData = await googleAnalyticsService.getReports(
        organisation.id,
        selectedProperty,
        {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          dimensions: ["date"],
          metrics: [
            "totalUsers",
            "sessions",
            "screenPageViews",
            "averageSessionDuration",
          ],
        }
      );
      setReports(reportsData);
    } catch (error) {
      console.error("Failed to load Google Analytics reports:", error);
      showMsgToast("Failed to load Google Analytics reports");
    } finally {
      setLoading(false);
    }
  };

  const loadRealTimeData = async () => {
    if (!organisation?.id || !selectedProperty) return;

    try {
      const realTimeData = await googleAnalyticsService.getRealTimeData(
        organisation.id,
        selectedProperty
      );
      setRealTimeData(realTimeData);
    } catch (error) {
      console.error("Failed to load Google Analytics real-time data:", error);
    }
  };

  const loadAudienceData = async () => {
    if (!organisation?.id || !selectedProperty) return;

    try {
      const audienceData = await googleAnalyticsService.getAudienceData(
        organisation.id,
        selectedProperty,
        {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        }
      );
      setAudienceData(audienceData);
    } catch (error) {
      console.error("Failed to load Google Analytics audience data:", error);
      showMsgToast("Failed to load Google Analytics audience data");
    }
  };

  const loadCountryData = async () => {
    if (!organisation?.id || !selectedProperty) return;

    try {
      const countryReports = await googleAnalyticsService.getReports(
        organisation.id,
        selectedProperty,
        {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          dimensions: ["country"],
          metrics: ["totalUsers", "sessions"],
        }
      );
      setCountryData(countryReports);
    } catch (error) {
      console.error("Failed to load Google Analytics country data:", error);
    }
  };

  const loadPageData = async () => {
    if (!organisation?.id || !selectedProperty) return;

    try {
      const pageReports = await googleAnalyticsService.getReports(
        organisation.id,
        selectedProperty,
        {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          dimensions: ["pageTitle", "pagePath"],
          metrics: ["screenPageViews", "totalUsers"],
        }
      );
      setPageData(pageReports);
    } catch (error) {
      console.error("Failed to load Google Analytics page data:", error);
    }
  };

  const loadDeviceData = async () => {
    if (!organisation?.id || !selectedProperty) return;

    try {
      const deviceReports = await googleAnalyticsService.getReports(
        organisation.id,
        selectedProperty,
        {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          dimensions: ["deviceCategory", "browser"],
          metrics: ["totalUsers", "sessions"],
        }
      );
      setDeviceData(deviceReports);
    } catch (error) {
      console.error("Failed to load Google Analytics device data:", error);
    }
  };

  const handleConnect = async () => {
    if (!organisation?.id) return;

    try {
      setLoading(true);
      const authData = await googleAnalyticsService.startAuth(organisation.id);

      // Open OAuth popup
      const popup = window.open(
        authData.auth_url,
        "google-analytics-oauth",
        "width=600,height=600,scrollbars=yes,resizable=yes"
      );

      // Poll for popup closure
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          loadStatus(); // Reload status after OAuth
        }
      }, 1000);
    } catch (error) {
      console.error("Failed to start Google Analytics OAuth:", error);
      showMsgToast("Failed to start Google Analytics connection");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!organisation?.id) return;

    try {
      setLoading(true);
      await googleAnalyticsService.disconnect(organisation.id);
      setStatus(null);
      setAccounts([]);
      setProperties([]);
      setSelectedAccount("");
      setSelectedProperty("");
      setReports(null);
      setRealTimeData(null);
      setAudienceData(null);
      setCountryData(null);
      setPageData(null);
      setDeviceData(null);
      showMsgToast("Google Analytics disconnected successfully");
    } catch (error) {
      console.error("Failed to disconnect Google Analytics:", error);
      showMsgToast("Failed to disconnect Google Analytics");
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary metrics from real data
  const getSummaryMetrics = () => {
    if (!reports?.rows || reports.rows.length === 0) {
      return [
        {
          label: "Total Users",
          value: "0",
          change: "",
          icon: <Hammer />,
        },
        {
          label: "Sessions",
          value: "0",
          change: "",
          icon: <Hammer />,
        },
        {
          label: "Page Views",
          value: "0",
          change: "",
          icon: <Hammer />,
        },
        {
          label: "Active Users",
          value: realTimeData?.rows?.[0]?.metricValues?.[0]?.value || "0",
          change: "",
          icon: <Hammer />,
        },
      ];
    }

    // Calculate totals from report data
    let totalUsers = 0;
    let totalSessions = 0;
    let totalPageViews = 0;

    reports.rows.forEach((row) => {
      totalUsers += parseInt(row.metricValues[0]?.value || "0");
      totalSessions += parseInt(row.metricValues[1]?.value || "0");
      totalPageViews += parseInt(row.metricValues[2]?.value || "0");
    });

    const activeUsers =
      realTimeData?.rows?.[0]?.metricValues?.[0]?.value || "0";

    return [
      {
        label: "Total Users",
        value: totalUsers.toLocaleString(),
        change: "",
        icon: <Hammer />,
      },
      {
        label: "Sessions",
        value: totalSessions.toLocaleString(),
        change: "",
        icon: <Hammer />,
      },
      {
        label: "Page Views",
        value: totalPageViews.toLocaleString(),
        change: "",
        icon: <Hammer />,
      },
      {
        label: "Active Users",
        value: activeUsers,
        change: "",
        icon: <Hammer />,
      },
    ];
  };

  // Format chart data for line chart
  const getChartData = () => {
    if (!reports?.rows || reports.rows.length === 0) {
      return [];
    }

    return reports.rows.map((row) => ({
      date: row.dimensionValues[0]?.value || "Unknown",
      totalUsers: parseInt(row.metricValues[0]?.value || "0"),
      sessions: parseInt(row.metricValues[1]?.value || "0"),
      pageViews: parseInt(row.metricValues[2]?.value || "0"),
      avgSessionDuration: parseFloat(row.metricValues[3]?.value || "0"),
    }));
  };

  // Get world map data from country data
  const getWorldMapData = () => {
    if (!countryData?.rows || countryData.rows.length === 0) {
      return [];
    }

    // Convert country names to country codes
    const countryCodeMap: Record<string, string> = {
      "United States": "us",
      China: "cn",
      India: "in",
      Russia: "ru",
      Brazil: "br",
      Canada: "ca",
      Germany: "de",
      "United Kingdom": "gb",
      France: "fr",
      Japan: "jp",
      Australia: "au",
      Mexico: "mx",
      Italy: "it",
      Spain: "es",
      Netherlands: "nl",
    };

    // Get max value for normalization
    const maxUsers = Math.max(
      ...countryData.rows.map((row) =>
        parseInt(row.metricValues[0]?.value || "0")
      )
    );

    return countryData.rows
      .map((row) => {
        const countryName = row.dimensionValues[0]?.value || "Unknown";
        const users = parseInt(row.metricValues[0]?.value || "0");

        return {
          country: countryCodeMap[countryName] || "us",
          value: Math.round((users / maxUsers) * 100), // Normalize to 0-100 range
        };
      })
      .filter((item) => item.country !== "us" || item.value > 0); // Remove default fallback unless it has data
  };

  // Get device data for insights
  const getDeviceData = () => {
    if (!deviceData?.rows || deviceData.rows.length === 0) {
      return [];
    }

    const deviceCategories = deviceData.rows.reduce((acc, row) => {
      const device = row.dimensionValues[0]?.value || "Unknown";
      const users = parseInt(row.metricValues[0]?.value || "0");

      if (!acc[device]) {
        acc[device] = 0;
      }
      acc[device] += users;

      return acc;
    }, {} as Record<string, number>);

    return Object.entries(deviceCategories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  // Get age data from audience data (fallback for now)
  const getAgeData = () => [];

  // Get top countries data
  const getTopCountriesData = () => {
    if (!countryData?.rows || countryData.rows.length === 0) {
      return [];
    }

    return countryData.rows
      .map((row) => ({
        country: row.dimensionValues[0]?.value || "Unknown",
        users: parseInt(row.metricValues[0]?.value || "0"),
      }))
      .sort((a, b) => b.users - a.users)
      .slice(0, 10);
  };

  // Get top pages from page data
  const getTopPages = () => {
    if (pageData?.rows && pageData.rows.length > 0) {
      return pageData.rows
        .map((row) => ({
          title: row.dimensionValues[0]?.value || "Unknown",
          path: row.dimensionValues[1]?.value || "/",
          pageViews: parseInt(row.metricValues[0]?.value || "0"),
          users: parseInt(row.metricValues[1]?.value || "0"),
        }))
        .sort((a, b) => b.pageViews - a.pageViews)
        .slice(0, 8);
    }

    // Fallback to real-time data
    if (!realTimeData?.rows || realTimeData.rows.length === 0) {
      return [];
    }

    return realTimeData.rows
      .map((row) => ({
        title: row.dimensionValues[0]?.value || "Unknown",
        path: row.dimensionValues[1]?.value || "/",
        pageViews: parseInt(row.metricValues[0]?.value || "0"),
        users: parseInt(row.metricValues[0]?.value || "0"),
      }))
      .sort((a, b) => b.pageViews - a.pageViews)
      .slice(0, 8);
  };

  if (!organisation?.id) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-warning">
          <i className="fas fa-exclamation-triangle me-2"></i>
          No organisation selected
        </div>
      </div>
    );
  }

  if (!status?.connected) {
    return (
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="mb-2 font-weight-bold">Google Analytics</h4>
            <p className="text-muted">
              Connect your Google Analytics account to view detailed analytics
              data
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleConnect}
            disabled={loading}
          >
            {loading ? (
              <i className="fas fa-spinner fa-spin me-2"></i>
            ) : (
              <Hammer className="h-4 w-4 me-2" />
            )}
            Connect Google Analytics
          </button>
        </div>
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>
          <strong>Google Analytics:</strong> Connect your Google Analytics
          account to access the dashboard and view detailed analytics data
          including page views, active users, demographic audience, and more.
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <div>
          <h4 className="mb-2 font-weight-bold">Google Analytics Dashboard</h4>
          <p className="text-muted">Track and analyze your website traffic</p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => {
              if (selectedProperty && organisation?.id) {
                loadReports();
                loadRealTimeData();
                loadAudienceData();
                loadCountryData();
                loadPageData();
                loadDeviceData();
              }
            }}
            disabled={loading}
            title="Refresh Data"
          >
            <Hammer className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleDisconnect}
            disabled={loading}
          >
            <Hammer className="h-4 w-4 me-1" />
            Disconnect
          </button>
        </div>
      </div>

      {/* Property Selection */}
      {(accounts.length > 0 || propertyList.length > 0) && (
        <div className="row mb-4">
          {accounts.length > 0 && (
            <div className="col-md-6">
              <label className="form-label">Account</label>
              <select
                className="form-control"
                value={selectedAccount}
                onChange={async (e) => {
                  const val = e.target.value;
                  setSelectedAccount(val);
                  if (organisation?.id) {
                    try {
                      await googleAnalyticsService.updateSelection(
                        organisation.id,
                        {
                          accountName: val,
                        }
                      );
                    } catch {}
                  }
                }}
              >
                {accounts.map((account) => (
                  <option key={account.name} value={account.name}>
                    {account.displayName}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="col-md-6">
            <label className="form-label">Property</label>
            <select
              className="form-control"
              value={selectedProperty}
              onChange={async (e) => {
                const val = e.target.value;
                setSelectedProperty(val);
                if (organisation?.id) {
                  try {
                    await googleAnalyticsService.updateSelection(
                      organisation.id,
                      {
                        propertyId: val,
                      }
                    );
                  } catch {}
                }
              }}
            >
              {(propertyList.length ? propertyList : properties).map(
                (property) => (
                  <option key={property.propertyId} value={property.propertyId}>
                    {property.displayName}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      )}

      {/* Date Range */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="d-flex align-items-center gap-3">
            <label className="form-label mb-0">Date Range:</label>
            <input
              type="date"
              className="form-control"
              style={{ width: 150 }}
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
              }
            />
            <span>to</span>
            <input
              type="date"
              className="form-control"
              style={{ width: 150 }}
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
              }
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row text-center mb-4">
        {loading && (
          <div className="col-12 text-center mb-3">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading analytics data...</p>
          </div>
        )}
        {getSummaryMetrics().map((item, i) => (
          <div className="col-6 col-md-3 mb-3 g-card" key={i}>
            <div className="card card-g border-0">
              <div className="global-card">
                <span className="pb-2 d-block">{item.icon}</span>
                <h1 className="mb-0 font-weight-bold pb-2">{item.value}</h1>
                <small className="text-muted g-card-heading">
                  {item.label}
                </small>
                <div
                  className={`mt-2 weight-600 small ${
                    item.change.includes("-") ? "text-danger" : "text-green"
                  }`}
                >
                  {item.change}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="row mb-4">
        {/* Traffic Overview Chart */}
        <div className="col-md-8 mb-4">
          <div className="global-card h-100 border-0">
            <div className="d-flex justify-content-between mb-3">
              <div>
                <h6 className="font-weight-bold pb-0 mb-0 g-card-heading">
                  Traffic Overview
                </h6>
                <small>
                  See insights on how your website traffic has grown over time
                </small>
              </div>
            </div>
            <div style={{ height: 300 }} className="pt-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="totalUsers"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ fill: "#8884d8", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sessions"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={{ fill: "#82ca9d", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pageViews"
                    stroke="#ffc658"
                    strokeWidth={2}
                    dot={{ fill: "#ffc658", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Real-time Activity */}
        <div className="col-md-4 mb-4">
          <div className="card card-g mb-3 border-0">
            <div className="global-card">
              <h6 className="font-weight-bold pb-3 g-card-heading">
                Real-time Activity
              </h6>
              <div className="text-center mb-3">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {realTimeData?.rows?.reduce(
                    (total, row) =>
                      total + parseInt(row.metricValues?.[0]?.value || "0"),
                    0
                  ) || "0"}
                </div>
                <p className="text-gray-500">Active Users</p>
              </div>
              <div>
                <h6 className="font-weight-bold mb-2">Top Pages</h6>
                <div className="space-y-2">
                  {getTopPages()
                    .slice(0, 5)
                    .map((page, index) => (
                      <div
                        key={index}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <span className="text-sm truncate">{page.title}</span>
                        <span className="badge badge-secondary">
                          {page.pageViews}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* World Map and Demographics */}
      <div className="row mb-4">
        <div className="col-md-8 mb-4">
          <div className="global-card h-100 border-0">
            <div className="d-flex justify-content-between mb-3">
              <div>
                <h6 className="font-weight-bold pb-0 mb-0 g-card-heading">
                  Demographic Audience
                </h6>
                <small>
                  See insights on how your audience is distributed globally
                </small>
              </div>
            </div>
            <div style={{ height: 300 }} className="g-map pt-3">
              <div className="card card-g border-0 p-3">
                <div className="global-card">
                  <h6 className="font-weight-bold mb-3 g-card-heading">
                    Top Countries (simplified)
                  </h6>
                  <div className="space-y-2">
                    {getTopCountriesData()
                      .slice(0, 8)
                      .map((c, i) => (
                        <div key={i} className="d-flex justify-content-between">
                          <span>{c.country}</span>
                          <span className="badge badge-primary">{c.users}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card card-g border-0">
            <div className="global-card">
              <h6 className="font-weight-bold pb-3 g-card-heading">
                Audience by Age
              </h6>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={getAgeData()} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    fill="#7e56da"
                    barSize={10}
                    radius={[0, 10, 10, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Top Countries and Pages */}
      <div className="row mb-4">
        <div className="col-md-6 mb-4">
          <div className="card card-g h-100 border-0">
            <div className="global-card">
              <h6 className="font-weight-bold mb-3 g-card-heading">
                Top Countries
              </h6>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={getTopCountriesData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="country" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card card-g h-100 border-0">
            <div className="global-card">
              <h6 className="font-weight-bold mb-3 g-card-heading">
                Top Pages
              </h6>
              <div className="space-y-2">
                {getTopPages().map((page, index) => (
                  <div
                    key={index}
                    className="d-flex justify-content-between align-items-center p-2 border-bottom"
                  >
                    <div>
                      <div className="font-weight-bold">{page.title}</div>
                      <small className="text-muted">{page.path}</small>
                    </div>
                    <div className="text-right">
                      <span className="badge badge-primary">
                        {page.pageViews} views
                      </span>
                      <br />
                      <small className="text-muted">{page.users} users</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleAnalytics;
