import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import { useOrganisation } from "../../context/OrganisationContext";
import { GoogleBusinessProfile } from "./index";
import { useQueryClient } from "react-query";
import googleAnalyticsService, {
  GoogleAnalyticsConnectorStatus,
} from "../../services/googleAnalyticsService";
import { showMsgToast } from "../../utils/showMsgToast";
import PageHeading from "../../shared-components/PageHeading";
import {
  HiCog,
  HiExternalLink,
  HiCheckCircle,
  HiXCircle,
  HiRefresh,
  HiSparkles,
} from "react-icons/hi";
import "./IntegrationsPage.css";

const IntegrationsPage: React.FC = () => {
  const { selectedOrg } = useOrganisation();
  const queryClient = useQueryClient();
  const [googleAnalyticsStatus, setGoogleAnalyticsStatus] =
    useState<GoogleAnalyticsConnectorStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    gtmTagId: "",
  });

  // Function to refresh connection status
  const handleConnectionChange = () => {
    queryClient.invalidateQueries(["google-business-connection-status"]);
    queryClient.invalidateQueries(["google-business-status"]);
    queryClient.invalidateQueries(["google-analytics-status"]);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
          connected: !!formData.gtmTagId,
          isManual: true,
          formField: {
            value: formData.gtmTagId,
            placeholder: "GTM-XXXXXXX",
            onChange: handleInputChange,
            name: "gtmTagId",
          },
          features: [
            "Tag management",
            "Event tracking",
            "Conversion tracking",
            "Marketing pixels",
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
    categoryColor: string
  ) => (
    <Card
      key={integration.name}
      className="h-100 global-card integration-card border-0 shadow-sm"
    >
      <Card.Body className="p-4">
        {/* Header */}
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div className="d-flex align-items-center gap-3">
            <div className="integration-icon">{integration.icon}</div>
            <div>
              <h5 className="mb-1 font-weight-bold">{integration.name}</h5>
              <div className="d-flex align-items-center gap-2">
                {integration.connected ? (
                  <Badge
                    variant="success"
                    className="d-flex align-items-center gap-1"
                  >
                    <HiCheckCircle size={14} />
                    Connected
                  </Badge>
                ) : integration.comingSoon ? (
                  <Badge
                    variant="secondary"
                    className="d-flex align-items-center gap-1"
                  >
                    <HiSparkles size={14} />
                    Coming Soon
                  </Badge>
                ) : (
                  <Badge
                    variant="outline-secondary"
                    className="d-flex align-items-center gap-1"
                  >
                    <HiXCircle size={14} />
                    Not Connected
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {integration.loading && (
            <HiRefresh className="text-primary animate-spin" size={20} />
          )}
        </div>

        {/* Description */}
        <p className="text-muted mb-3" style={{ fontSize: "14px" }}>
          {integration.description}
        </p>

        {/* Features */}
        <div className="mb-4">
          <small className="text-muted font-weight-bold mb-2 d-block">
            KEY FEATURES
          </small>
          <div className="row">
            {integration.features
              ?.slice(0, 4)
              .map((feature: string, index: number) => (
                <div key={index} className="col-6 mb-1">
                  <small className="text-muted d-flex align-items-center">
                    <i
                      className="fas fa-check text-success mr-1"
                      style={{ fontSize: "10px" }}
                    ></i>
                    {feature}
                  </small>
                </div>
              ))}
          </div>
        </div>

        {/* Action Area */}
        <div className="mt-auto">
          {integration.comingSoon ? (
            <Button variant="outline-secondary" disabled className="w-100">
              <HiSparkles size={16} className="mr-2" />
              Coming Soon
            </Button>
          ) : integration.isManual ? (
            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder={integration.formField.placeholder}
                value={integration.formField.value}
                onChange={integration.formField.onChange}
                name={integration.formField.name}
              />
              <Button variant="primary" size="sm">
                Save
              </Button>
            </div>
          ) : integration.isComponent ? (
            <div>{integration.component}</div>
          ) : integration.connected ? (
            <div className="d-flex gap-2">
              <Button
                variant="outline-primary"
                size="sm"
                className="flex-grow-1"
              >
                <HiExternalLink size={16} className="mr-1" />
                Manage
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={integration.onDisconnect}
                disabled={integration.loading}
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              className="w-100"
              onClick={integration.onConnect}
              disabled={integration.loading}
            >
              {integration.loading ? (
                <>
                  <HiRefresh className="animate-spin mr-2" size={16} />
                  Connecting...
                </>
              ) : (
                <>
                  <HiExternalLink size={16} className="mr-2" />
                  Connect {integration.name}
                </>
              )}
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Container fluid className="py-4">
        {/* Page Header */}
        <div className="view-padding">
          <PageHeading
            icon={<HiCog size={24} />}
            title="Integrations"
            description="Connect your favorite tools and services to streamline your workflow"
          />
        </div>
        <hr />

        <div className="px-4">
          {/* Stats Overview */}
          <Row className="mb-5">
            <Col md={3}>
              <Card className="global-card border-0 text-center h-100">
                <Card.Body className="py-4">
                  <div className="text-primary mb-2">
                    <HiCheckCircle size={32} />
                  </div>
                  <h4 className="mb-1">
                    {integrationCategories.reduce(
                      (acc, cat) =>
                        acc +
                        cat.integrations.filter((int) => int.connected).length,
                      0
                    )}
                  </h4>
                  <small className="text-muted font-weight-bold">
                    CONNECTED
                  </small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="global-card border-0 text-center h-100">
                <Card.Body className="py-4">
                  <div className="text-warning mb-2">
                    <HiSparkles size={32} />
                  </div>
                  <h4 className="mb-1">
                    {integrationCategories.reduce(
                      (acc, cat) =>
                        acc +
                        cat.integrations.filter((int) => int.comingSoon).length,
                      0
                    )}
                  </h4>
                  <small className="text-muted font-weight-bold">
                    COMING SOON
                  </small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="global-card border-0 text-center h-100">
                <Card.Body className="py-4">
                  <div className="text-info mb-2">
                    <HiCog size={32} />
                  </div>
                  <h4 className="mb-1">
                    {integrationCategories.reduce(
                      (acc, cat) => acc + cat.integrations.length,
                      0
                    )}
                  </h4>
                  <small className="text-muted font-weight-bold">
                    TOTAL AVAILABLE
                  </small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="global-card border-0 text-center h-100">
                <Card.Body className="py-4">
                  <div className="text-success mb-2">
                    <HiRefresh size={32} />
                  </div>
                  <h4 className="mb-1">Auto</h4>
                  <small className="text-muted font-weight-bold">
                    SYNC ENABLED
                  </small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Integration Categories */}
          {integrationCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-5">
              <div className="d-flex align-items-center mb-4">
                <div className="mr-3">
                  <div
                    className={`bg-${category.color} rounded-circle d-flex align-items-center justify-content-center`}
                    style={{ width: "48px", height: "48px" }}
                  >
                    <HiCog size={24} className="text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="mb-1 font-weight-bold">{category.title}</h4>
                  <p className="text-muted mb-0">{category.description}</p>
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

          {/* Help Section */}
          <Card className="global-card border-0 bg-light">
            <Card.Body className="text-center py-5">
              <HiSparkles size={48} className="text-primary mb-3" />
              <h5 className="mb-3">Need Help with Integrations?</h5>
              <p className="text-muted mb-4">
                Our team is here to help you connect your tools and get the most
                out of your integrations.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Button variant="outline-primary">
                  <i className="fas fa-book mr-2"></i>
                  View Documentation
                </Button>
                <Button variant="primary">
                  <i className="fas fa-headset mr-2"></i>
                  Contact Support
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default IntegrationsPage;
