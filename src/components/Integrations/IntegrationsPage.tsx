import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col } from "../ui/grid";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useOrganisation } from "../../context/OrganisationContext";
import { GoogleBusinessProfile } from "./index";
import { useQuery, useQueryClient } from "react-query";
import googleAnalyticsService, {
  GoogleAnalyticsConnectorStatus,
} from "../../services/googleAnalyticsService";
import { showMsgToast } from "../../utils/showMsgToast";
import PageHeading from "../../shared-components/PageHeading";
<Radio className="animate-spin mr-2" size={16} />;
import {
  Rotate3d,
  Cable,
  Gem,
  OctagonX,
  SquareChartGantt,
  Radio,
  BanknoteArrowUp,
  Grid2x2Check,
  RefreshCcw,
  ChartLine,
  LoaderCircle,
} from "lucide-react";

import { handleApiError } from "../../hooks/handleApiErrors";
import API from "../../utils/API";
import { AxiosError } from "axios";
import { useHistory } from "react-router-dom";

interface FormDataInterface {
  googleAnalyticsId?: string;
  gtmTagId?: string;
  yandexMetricsId?: string;
}

const key = "configuration";

// Update existing config
const updateConfig = async (config) => {
  const formdata = new FormData();
  Object.entries(config).forEach(([k, v]) => {
    if (k !== "id") formdata.append(k, String(v));
  });
  return API.post(`configuration/${config.id}`, formdata, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Create new config
const createConfig = async (config) => {
  const formdata = new FormData();
  Object.entries(config).forEach(([k, v]) => {
    formdata.append(k, String(v));
  });
  return API.post(`configuration`, formdata, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const IntegrationsPage: React.FC = () => {
  const history = useHistory();
  const queryClient = useQueryClient();
  const { selectedOrg } = useOrganisation();
  const [googleAnalyticsStatus, setGoogleAnalyticsStatus] =
    useState<GoogleAnalyticsConnectorStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState<FormDataInterface | null>(null);

  const analyticsKeys = ["googleAnalyticsId", "gtmTagId", "yandexMetricsId"];
  const { data: configData, isLoading } = useQuery(
    [`${key}-website`, selectedOrg?.id],
    () =>
      API.get(`${key}?perPage=100&type=website&org_id=${selectedOrg?.id}`).then(
        (res) => res.data
      ),
    {
      enabled: !!selectedOrg?.id,
      onError: (error: AxiosError) => handleApiError(error, history),
    }
  );

  const configs = configData?.data || [];
  useEffect(() => {
    if (configs && configs.length > 0) {
      const initialValues: any = analyticsKeys.reduce((acc, keyName) => {
        acc[keyName] = configs.find((d) => d.key === keyName)?.value || "";
        return acc;
      }, {});
      setFormValues(initialValues);
    }
  }, [configs]);

  // Function to refresh connection status
  const handleConnectionChange = () => {
    queryClient.invalidateQueries(["google-business-connection-status"]);
    queryClient.invalidateQueries(["google-business-status"]);
    queryClient.invalidateQueries(["google-analytics-status"]);
  };

  const loadGoogleAnalyticsStatus = useCallback(async () => {
    if (!selectedOrg?.id) return;

    try {
      const status = await googleAnalyticsService.getStatus(selectedOrg.id);
      setGoogleAnalyticsStatus(status);
    } catch (error) {
      console.error("Failed to load Google Analytics status:", error);
    }
  }, [selectedOrg?.id]);

  // Load Google Analytics status
  useEffect(() => {
    const organisationId = selectedOrg?.id;
    if (organisationId) {
      loadGoogleAnalyticsStatus();
    }
  }, [selectedOrg?.id, loadGoogleAnalyticsStatus]);

  const handleGoogleAnalyticsConnect = async () => {
    if (!selectedOrg?.id) return;

    try {
      setLoading(true);
      const authData = await googleAnalyticsService.startAuth(selectedOrg.id);

      // Open OAuth popup
      const popup = window.open(
        authData.auth_url,
        "google-analytics-oauth",
        "width=600,height=600,scrollbars=yes,resizable=yes"
      );

      // Listen for postMessage from popup and also poll for closure
      const messageHandler = (event: MessageEvent) => {
        if (
          typeof event.data === "object" &&
          event.data?.source === "ga-oauth" &&
          event.data?.status === "success"
        ) {
          window.removeEventListener("message", messageHandler);
          loadGoogleAnalyticsStatus();
          handleConnectionChange();
        }
      };
      window.addEventListener("message", messageHandler);

      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          window.removeEventListener("message", messageHandler);
          loadGoogleAnalyticsStatus();
          handleConnectionChange();
        }
      }, 1000);
    } catch (error) {
      console.error("Failed to start Google Analytics OAuth:", error);
      showMsgToast("Failed to start Google Analytics connection");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAnalyticsDisconnect = async () => {
    if (!selectedOrg?.id) return;

    try {
      setLoading(true);
      await googleAnalyticsService.disconnect(selectedOrg.id);
      setGoogleAnalyticsStatus(null);
      handleConnectionChange();
      showMsgToast("Google Analytics disconnected successfully");
    } catch (error) {
      console.error("Failed to disconnect Google Analytics:", error);
      showMsgToast("Failed to disconnect Google Analytics");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (keyName, value) => {
    setFormValues((prev) => ({
      ...prev,
      [keyName]: value,
    }));
  };

  const handleSave = async (keyName: string, value: string) => {
    try {
      const existing = configs.find((c) => c.key === keyName);

      if (existing) {
        if (existing.value !== value) {
          await updateConfig({ ...existing, value: formValues[keyName] });
          showMsgToast(`${keyName} updated!`);
        } else {
          showMsgToast(`No changes for ${keyName}`);
        }
      } else {
        await createConfig({
          key: keyName,
          value: formValues[keyName],
          type: "website",
          org_id: selectedOrg.id,
        });
        showMsgToast(`${keyName} created!`);
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  // Define integration types
  interface Integration {
    name: string;
    description: string;
    icon: React.ReactNode;
    connected?: boolean;
    loading?: boolean;
    onConnect?: () => Promise<void>;
    onDisconnect?: () => Promise<void>;
    features: string[];
    isManual?: boolean;
    formField?: {
      value: string;
      placeholder: string;
      name: string;
    };
    isComponent?: boolean;
    component?: React.ReactNode;
    comingSoon?: boolean;
  }

  interface IntegrationCategory {
    title: string;
    description: string;
    color: string;
    integrations: Integration[];
  }

  // Define integration categories and items
  const integrationCategories: IntegrationCategory[] = [
    {
      title: "Analytics & Tracking",
      description: "Track user behavior and website performance",
      color: "primary",
      integrations: [
        {
          name: "Google Analytics",
          description:
            "Track website traffic, user behavior, and conversion metrics",
          icon: (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path
                d="M22.5 12.5v7.5c0 1.104-.896 2-2 2h-17c-1.104 0-2-.896-2-2v-15c0-1.104.896-2 2-2h7.5"
                fill="none"
                stroke="#FF6D01"
                strokeWidth="1.5"
              />
              <circle cx="8" cy="16" r="1.5" fill="#FF6D01" />
              <circle cx="14" cy="12" r="1.5" fill="#4285F4" />
              <circle cx="18" cy="8" r="1.5" fill="#0F9D58" />
              <path
                d="M8 16L14 12L18 8"
                stroke="#34A853"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
          connected: !!googleAnalyticsStatus?.connected,
          isManual: true,
          formField: {
            value: formValues?.googleAnalyticsId,
            placeholder: "G-XXXXXXX",
            name: "googleAnalyticsId",
          },
          loading: loading,
          onConnect: handleGoogleAnalyticsConnect,
          onDisconnect: handleGoogleAnalyticsDisconnect,
          features: [
            "Real-time analytics",
            "Audience insights",
            "Goal tracking",
            "Custom reports",
          ],
        },
        {
          name: "Google Tag Manager",
          description: "Manage tracking tags and marketing pixels without code",
          icon: (
            <i
              className="fab fa-google"
              style={{ fontSize: "40px", color: "#4285F4" }}
            ></i>
          ),
          connected: !!formValues?.gtmTagId,
          isManual: true,
          formField: {
            value: formValues?.gtmTagId,
            placeholder: "GTM-XXXXXXX",
            name: "gtmTagId",
          },
          features: [
            "Tag management",
            "Event tracking",
            "Conversion tracking",
            "Marketing pixels",
          ],
        },
        {
          name: "Yandex Metrics",
          description:
            "Find anything: webpages, images, music, goods, and more",
          icon: (
            <i
              className="fab fa-yandex"
              style={{ fontSize: "40px", color: "#4285F4" }}
            ></i>
          ),
          connected: !!formValues?.yandexMetricsId,
          isManual: true,
          formField: {
            value: formValues?.yandexMetricsId,
            placeholder: "123-XXXXXXX",
            name: "yandexMetricsId",
          },
          features: [
            "Site-Specific Searches",
            "Date-Based Sorting and Filtering",
            "Precise Word and Phrase Searching",
            "Regional and Language-Specific Searches",
          ],
        },
      ],
    },
    {
      title: "Business Management",
      description: "Manage your business presence and customer relationships",
      color: "success",
      integrations: [
        {
          name: "Google Business Profile",
          description:
            "Manage your business listing, reviews, and customer engagement",
          icon: (
            <i
              className="fab fa-google"
              style={{ fontSize: "40px", color: "#34A853" }}
            ></i>
          ),
          connected: false, // Will be determined by GoogleBusinessProfile component
          isComponent: true,
          component: (
            <GoogleBusinessProfile
              organisationId={selectedOrg?.id}
              onConnectionChange={handleConnectionChange}
            />
          ),
          features: [
            "Business listings",
            "Customer reviews",
            "Photos & posts",
            "Insights",
          ],
        },
      ],
    },
    {
      title: "Marketing & Ads",
      description:
        "Connect your marketing & ads tools for better business insights",
      color: "warning",
      integrations: [
        {
          name: "Google Ads",
          description: "Sync google ads data and leads into the platform",
          icon: (
            <i
              className="fas fa-google"
              style={{ fontSize: "40px", color: "#0077C5" }}
            ></i>
          ),
          connected: false,
          comingSoon: true,
          features: [
            "Sync Leads directly to CRM",
            "Spending reporting",
            "Coversion reporting",
          ],
        },
        {
          name: "Meta Ads",
          description: "Sync meta data and leads into the platform",
          icon: (
            <i
              className="fas fa-facebook"
              style={{ fontSize: "40px", color: "#13B5EA" }}
            ></i>
          ),
          connected: false,
          comingSoon: true,
          features: [
            "Sync Leads directly to CRM",
            "Spending reporting",
            "Coversion reporting",
          ],
        },
      ],
    },
    {
      title: "Financial & Accounting",
      description: "Connect your financial tools for better business insights",
      color: "warning",
      integrations: [
        {
          name: "QuickBooks",
          description: "Sync accounting data and financial reports",
          icon: (
            <i
              className="fas fa-calculator"
              style={{ fontSize: "40px", color: "#0077C5" }}
            ></i>
          ),
          connected: false,
          comingSoon: true,
          features: [
            "Automated bookkeeping",
            "Invoice management",
            "Financial reports",
            "Tax preparation",
          ],
        },
        {
          name: "Xero",
          description: "Cloud-based accounting and financial management",
          icon: (
            <i
              className="fas fa-chart-line"
              style={{ fontSize: "40px", color: "#13B5EA" }}
            ></i>
          ),
          connected: false,
          comingSoon: true,
          features: [
            "Real-time financial data",
            "Invoice tracking",
            "Expense management",
            "Bank reconciliation",
          ],
        },
      ],
    },
  ];

  const renderIntegrationCard = (
    integration: Integration,
    _categoryColor: string
  ) => (
    <Card
      key={integration.name}
      className="h-full shadow-sm transition-transform duration-200 ease-in-out border border-gray-200 hover:transform hover:-translate-y-1 hover:shadow-lg"
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-14 h-14 bg-blue-50 rounded-xl mb-2">
              {integration.icon}
            </div>
            <div>
              <h5 className="mb-1 font-semibold">{integration.name}</h5>
              <div className="flex items-center gap-2">
                {integration.connected ? (
                  <Badge className="flex items-center gap-1" variant="success">
                    <Cable size={14} />
                    Connected
                  </Badge>
                ) : integration.comingSoon ? (
                  <Badge
                    className="flex items-center gap-1"
                    variant="secondary"
                  >
                    <Gem size={14} />
                    Coming Soon
                  </Badge>
                ) : (
                  <Badge
                    className="flex items-center gap-1"
                    variant="secondary"
                  >
                    <OctagonX size={14} />
                    Not Connected
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {integration.loading && (
            <LoaderCircle className="text-primary animate-spin" size={20} />
          )}
        </div>

        {/* Description */}
        <p className="text-muted-foreground mb-3 text-sm">
          {integration.description}
        </p>

        {/* Features */}
        <div className="mb-4">
          <small className="text-muted-foreground font-semibold mb-2 block">
            KEY FEATURES
          </small>
          <div className="grid grid-cols-2 gap-2">
            {integration.features
              ?.slice(0, 4)
              .map((feature: string, index: number) => (
                <div key={index} className="mb-1">
                  <small className="text-muted-foreground flex items-center">
                    <i
                      className="fas fa-check text-green-500 mr-1"
                      style={{ fontSize: "10px" }}
                    />
                    {feature}
                  </small>
                </div>
              ))}
          </div>
        </div>

        {/* Action Area */}
        <div className="mt-auto">
          {integration.comingSoon ? (
            <Button variant="outline" disabled className="w-full">
              <Gem size={16} className="mr-2" />
              Coming Soon
            </Button>
          ) : integration.isManual ? (
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder={integration.formField.placeholder}
                value={formValues?.[integration.formField.name] || ""}
                onChange={(e) =>
                  handleChange(integration.formField.name, e.target.value)
                }
                name={integration.formField.name}
              />
              <Button
                variant="default"
                size="sm"
                onClick={() =>
                  handleSave(
                    integration.formField.name,
                    integration.formField.value
                  )
                }
              >
                Save
              </Button>
            </div>
          ) : integration.isComponent ? (
            <div>{integration.component}</div>
          ) : integration.connected ? (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <SquareChartGantt size={16} className="mr-1" />
                Manage
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={integration.onDisconnect}
                disabled={integration.loading}
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <Button
              variant="default"
              className="w-full"
              onClick={integration.onConnect}
              disabled={integration.loading}
            >
              {integration.loading ? (
                <>
                  <Radio className="animate-spin mr-2" size={16} />
                  Connecting...
                </>
              ) : (
                <>
                  <Cable size={16} className="mr-2" />
                  Connect {integration.name}
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Container fluid className="py-4">
        {/* Page Header */}
        <div className="view-padding">
          <PageHeading
            icon={<Rotate3d size={24} />}
            title="Integrations"
            description="Connect your favorite tools and services to streamline your workflow"
          />
        </div>
        <hr />

        <div className="px-4 pt-4">
          {/* Stats Overview */}
          <Row className="mb-5">
            <Col md={3}>
              <Card className="text-center h-full transition-transform duration-200 ease-in-out hover:scale-105">
                <CardContent className="py-4">
                  <div className="text-primary mb-2">
                    <Cable size={32} />
                  </div>
                  <h4 className="mb-1">
                    {integrationCategories.reduce(
                      (acc, cat) =>
                        acc +
                        cat.integrations.filter((int) => int.connected).length,
                      0
                    )}
                  </h4>
                  <small className="text-muted-foreground font-semibold">
                    CONNECTED
                  </small>
                </CardContent>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center h-full transition-transform duration-200 ease-in-out hover:scale-105">
                <CardContent className="py-4">
                  <div className="text-yellow-500 mb-2">
                    <BanknoteArrowUp size={32} />
                  </div>
                  <h4 className="mb-1">
                    {integrationCategories.reduce(
                      (acc, cat) =>
                        acc +
                        cat.integrations.filter((int) => int.comingSoon).length,
                      0
                    )}
                  </h4>
                  <small className="text-muted-foreground font-semibold">
                    COMING SOON
                  </small>
                </CardContent>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center h-full transition-transform duration-200 ease-in-out hover:scale-105">
                <CardContent className="py-4">
                  <div className="text-blue-500 mb-2">
                    <Grid2x2Check size={32} />
                  </div>
                  <h4 className="mb-1">
                    {integrationCategories.reduce(
                      (acc, cat) => acc + cat.integrations.length,
                      0
                    )}
                  </h4>
                  <small className="text-muted-foreground font-semibold">
                    TOTAL AVAILABLE
                  </small>
                </CardContent>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center h-full transition-transform duration-200 ease-in-out hover:scale-105">
                <CardContent className="py-4">
                  <div className="text-green-500 mb-2">
                    <RefreshCcw size={32} />
                  </div>
                  <h4 className="mb-1">Auto</h4>
                  <small className="text-muted-foreground font-semibold">
                    SYNC ENABLED
                  </small>
                </CardContent>
              </Card>
            </Col>
          </Row>

          {/* Integration Categories */}
          {integrationCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-5">
              <div className="flex items-center mb-4">
                <div className="mr-3">
                  <div className="rounded-full flex items-center justify-center bg-gray-900 w-12 h-12">
                    <ChartLine size={24} className="text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="mb-1 font-semibold">{category.title}</h4>
                  <p className="text-muted-foreground mb-0">
                    {category.description}
                  </p>
                </div>
              </div>

              <Row>
                {category.integrations.map((integration) => (
                  <Col key={integration.name} lg={6} xl={4} className="mb-4">
                    {renderIntegrationCard(integration, category.color)}
                  </Col>
                ))}
              </Row>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default IntegrationsPage;
