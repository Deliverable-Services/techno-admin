import API from "../utils/API";

export interface GoogleAnalyticsConnectorStatus {
  connected: boolean;
  status: string;
  connector_name?: string;
  connected_at?: string;
  last_sync_at?: string;
  has_valid_token?: boolean;
  accounts_count?: number;
  oauth_completed?: boolean;
  fivetran_error?: string | null;
  selected_account?: string;
  selected_property?: string;
  latest_sync?: {
    status: string;
    started_at: string;
    completed_at: string;
    records_synced: number;
  } | null;
}

export interface GoogleAnalyticsAccount {
  name: string;
  displayName: string;
  regionCode: string;
  deleted: boolean;
  createTime: string;
  updateTime: string;
}

export interface GoogleAnalyticsProperty {
  name: string;
  displayName: string;
  propertyId: string;
  timeZone: string;
  currencyCode: string;
  industryCategory: string;
  serviceLevel: string;
  deleteTime?: string;
  expireTime?: string;
  createTime: string;
  updateTime: string;
}

export interface GoogleAnalyticsReport {
  dimensionHeaders: Array<{ name: string }>;
  metricHeaders: Array<{ name: string; type: string }>;
  rows: Array<{
    dimensionValues: Array<{ value: string }>;
    metricValues: Array<{ value: string }>;
  }>;
  rowCount: number;
  metadata: {
    currencyCode: string;
    timeZone: string;
  };
}

export interface GoogleAnalyticsRealTimeData {
  dimensionHeaders: Array<{ name: string }>;
  metricHeaders: Array<{ name: string; type: string }>;
  rows: Array<{
    dimensionValues: Array<{ value: string }>;
    metricValues: Array<{ value: string }>;
  }>;
  rowCount: number;
  metadata: {
    currencyCode: string;
    timeZone: string;
  };
}

export interface GoogleAnalyticsAudienceData {
  dimensionHeaders: Array<{ name: string }>;
  metricHeaders: Array<{ name: string; type: string }>;
  rows: Array<{
    dimensionValues: Array<{ value: string }>;
    metricValues: Array<{ value: string }>;
  }>;
  rowCount: number;
  metadata: {
    currencyCode: string;
    timeZone: string;
  };
}

class GoogleAnalyticsService {
  /**
   * Start OAuth flow for Google Analytics
   */
  async startAuth(
    organisationId: number
  ): Promise<{ auth_url: string; state: string; connector_id: number }> {
    const response = await API.get(`/google-analytics/auth/start`, {
      params: { organisation_id: organisationId },
    });
    return response.data;
  }

  /**
   * Get Google Analytics connector status
   */
  async getStatus(
    organisationId: number
  ): Promise<GoogleAnalyticsConnectorStatus> {
    const response = await API.get(`/google-analytics/status`, {
      params: { organisation_id: organisationId },
    });
    return response.data;
  }

  /**
   * Disconnect Google Analytics
   */
  async disconnect(organisationId: number): Promise<{ message: string }> {
    const response = await API.post(`/google-analytics/disconnect`, {
      organisation_id: organisationId,
    });
    return response.data;
  }

  /**
   * Get Google Analytics accounts
   */
  async getAccounts(organisationId: number): Promise<GoogleAnalyticsAccount[]> {
    const response = await API.get(`/google-analytics/accounts`, {
      params: { organisation_id: organisationId },
    });
    return response.data;
  }

  /**
   * Get Google Analytics properties for an account
   */
  async getProperties(
    organisationId: number,
    accountName: string
  ): Promise<GoogleAnalyticsProperty[]> {
    const response = await API.get(`/google-analytics/properties`, {
      params: {
        organisation_id: organisationId,
        account_name: accountName,
      },
    });
    // Normalize propertyId for GA Admin API responses that use name like 'properties/123'
    const raw = response.data || [];
    return raw.map((p: any) => ({
      ...p,
      propertyId:
        p.propertyId ||
        (p.name ? p.name.replace("properties/", "") : p.propertyId),
    }));
  }

  async getAllAccessibleProperties(
    organisationId: number
  ): Promise<GoogleAnalyticsProperty[]> {
    const response = await API.get(`/google-analytics/properties/search`, {
      params: { organisation_id: organisationId },
    });
    const raw = response.data || [];
    return raw.map((p: any) => ({
      ...p,
      propertyId:
        p.propertyId ||
        (p.name ? p.name.replace("properties/", "") : p.propertyId),
    }));
  }

  /**
   * Get Google Analytics reports
   */
  async getReports(
    organisationId: number,
    propertyId: string,
    options?: {
      startDate?: string;
      endDate?: string;
      dimensions?: string[];
      metrics?: string[];
    }
  ): Promise<GoogleAnalyticsReport> {
    const response = await API.get(`/google-analytics/reports`, {
      params: {
        organisation_id: organisationId,
        property_id: propertyId,
        ...options,
      },
    });
    return response.data;
  }

  /**
   * Get Google Analytics real-time data
   */
  async getRealTimeData(
    organisationId: number,
    propertyId: string
  ): Promise<GoogleAnalyticsRealTimeData> {
    const response = await API.get(`/google-analytics/realtime`, {
      params: {
        organisation_id: organisationId,
        property_id: propertyId,
      },
    });
    return response.data;
  }

  /**
   * Get Google Analytics audience data
   */
  async getAudienceData(
    organisationId: number,
    propertyId: string,
    options?: {
      startDate?: string;
      endDate?: string;
    }
  ): Promise<GoogleAnalyticsAudienceData> {
    const response = await API.get(`/google-analytics/audience`, {
      params: {
        organisation_id: organisationId,
        property_id: propertyId,
        ...options,
      },
    });
    return response.data;
  }

  /**
   * Persist selected account/property for connector
   */
  async updateSelection(
    organisationId: number,
    { accountName, propertyId }: { accountName?: string; propertyId?: string }
  ): Promise<{ message: string }> {
    const response = await API.put(`/google-analytics/selection`, {
      organisation_id: organisationId,
      account_name: accountName,
      property_id: propertyId,
    });
    return response.data;
  }

  /**
   * Get default metrics for common reports
   */
  getDefaultMetrics() {
    return {
      overview: ["totalUsers", "sessions", "screenPageViews", "bounceRate"],
      traffic: [
        "totalUsers",
        "sessions",
        "screenPageViews",
        "averageSessionDuration",
      ],
      engagement: [
        "screenPageViews",
        "averageSessionDuration",
        "bounceRate",
        "engagementRate",
      ],
      conversions: [
        "conversions",
        "conversionRate",
        "totalRevenue",
        "averageOrderValue",
      ],
    };
  }

  /**
   * Get default dimensions for common reports
   */
  getDefaultDimensions() {
    return {
      time: ["date", "hour", "dayOfWeek", "month"],
      traffic: ["source", "medium", "campaign", "referrer"],
      audience: ["country", "city", "deviceCategory", "browser"],
      content: ["pageTitle", "pagePath", "landingPage", "exitPage"],
    };
  }

  /**
   * Format report data for charts
   */
  formatReportForCharts(
    report: GoogleAnalyticsReport,
    chartType: "line" | "bar" | "pie" = "line"
  ) {
    if (!report.rows || report.rows.length === 0) {
      return { labels: [], datasets: [] };
    }

    const labels = report.rows.map(
      (row) => row.dimensionValues[0]?.value || "Unknown"
    );
    const datasets = report.metricHeaders.map((header, index) => ({
      label: header.name,
      data: report.rows.map((row) =>
        parseFloat(row.metricValues[index]?.value || "0")
      ),
      borderColor: this.getChartColor(index),
      backgroundColor: this.getChartColor(index, 0.2),
      tension: 0.4,
    }));

    return { labels, datasets };
  }

  /**
   * Get chart colors
   */
  private getChartColor(index: number, alpha: number = 1): string {
    const colors = [
      `rgba(59, 130, 246, ${alpha})`, // blue
      `rgba(16, 185, 129, ${alpha})`, // green
      `rgba(245, 158, 11, ${alpha})`, // yellow
      `rgba(239, 68, 68, ${alpha})`, // red
      `rgba(139, 92, 246, ${alpha})`, // purple
      `rgba(236, 72, 153, ${alpha})`, // pink
      `rgba(14, 165, 233, ${alpha})`, // sky
      `rgba(34, 197, 94, ${alpha})`, // emerald
    ];
    return colors[index % colors.length];
  }

  /**
   * Format audience data for charts
   */
  formatAudienceDataForCharts(audienceData: GoogleAnalyticsAudienceData) {
    if (!audienceData.rows || audienceData.rows.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Group by country
    const countryData = audienceData.rows.reduce((acc, row) => {
      const country = row.dimensionValues[0]?.value || "Unknown";
      const users = parseInt(row.metricValues[0]?.value || "0");

      if (!acc[country]) {
        acc[country] = 0;
      }
      acc[country] += users;

      return acc;
    }, {} as Record<string, number>);

    const labels = Object.keys(countryData);
    const data = Object.values(countryData);

    return {
      labels,
      datasets: [
        {
          label: "Users",
          data,
          backgroundColor: labels.map((_, index) =>
            this.getChartColor(index, 0.8)
          ),
          borderColor: labels.map((_, index) => this.getChartColor(index)),
          borderWidth: 1,
        },
      ],
    };
  }

  /**
   * Format real-time data for display
   */
  formatRealTimeData(realTimeData: GoogleAnalyticsRealTimeData) {
    if (!realTimeData.rows || realTimeData.rows.length === 0) {
      return { activeUsers: 0, topPages: [] };
    }

    const activeUsers = realTimeData.rows.reduce((total, row) => {
      return total + parseInt(row.metricValues[0]?.value || "0");
    }, 0);

    const topPages = realTimeData.rows
      .map((row) => ({
        title: row.dimensionValues[0]?.value || "Unknown",
        path: row.dimensionValues[1]?.value || "/",
        activeUsers: parseInt(row.metricValues[0]?.value || "0"),
      }))
      .sort((a, b) => b.activeUsers - a.activeUsers)
      .slice(0, 10);

    return { activeUsers, topPages };
  }
}

export default new GoogleAnalyticsService();
