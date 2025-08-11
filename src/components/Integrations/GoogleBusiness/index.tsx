import React, { useState } from "react";
import { Container, Row, Col, Card, Tabs, Tab, Button } from "../../ui/bootstrap-compat";
import { useGoogleBusinessIntegration } from "../useGoogleBusinessIntegration";
import useUserProfileStore from "../../../hooks/useUserProfileStore";
import BackButton from "../../../shared-components/BackButton";
import BusinessProfileTab from "./BusinessProfileTab";
import ReviewsTab from "./ReviewsTab";
import ImagesTab from "./ImagesTab";
import IsLoading from "../../../shared-components/isLoading";

const GoogleBusinessDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const loggedInUser = useUserProfileStore((state) => state.user);

  // Use same organization ID logic as sidebar
  const organisationId = loggedInUser?.organisations?.[0]?.id;

  const { isConnected, isLoading, connectionStatus } =
    useGoogleBusinessIntegration({
      organisationId,
    });

  if (isLoading) {
    return (
      <Container fluid className="py-4">
        <IsLoading />
      </Container>
    );
  }

  // If not connected, redirect to settings
  // Use same logic as sidebar - accept connected, pending, or oauth_completed status
  const isDashboardAccessible =
    isConnected ||
    connectionStatus === "connected" ||
    connectionStatus === "pending";

  if (!isDashboardAccessible) {
    return (
      <Container fluid className="py-4">
        <div className="d-flex align-items-center mb-4">
          <BackButton title="Back" />
          <h1 className="ml-3 mb-0">Google Business Profile</h1>
        </div>

        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="text-center py-5">
              <Card.Body>
                <i className="fab fa-google fa-4x text-muted mb-4"></i>
                <h3 className="mb-3">Google Business Profile Not Connected</h3>
                <p className="text-muted mb-4">
                  Please connect your Google Business Profile from Settings to
                  access this dashboard.
                </p>

                <Button
                  variant="primary"
                  onClick={() => (window.location.href = "/organization")}
                  size="lg"
                >
                  <i className="fas fa-cog me-2"></i>
                  Go to Settings
                </Button>

                <div className="mt-4 text-muted small">
                  <p className="mb-0">
                    Navigate to Settings → Integrations → Google My Business to
                    connect your profile.
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className=" mb-4">
        <div className="d-flex align-items-center justify-content-between py-3">
          <BackButton title="Back" />
          <h1 className="ml-3 mb-0">Google Business Profile Dashboard</h1>
          <div className="d-flex align-items-center">
            <div className="text-muted small g-badage">
              <i className="fas fa-check-circle text-success me-2"></i>
              Connected to Google Business Profile
              <span className="ms-2 badge bg-secondary">
                {connectionStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Data Notice */}
      <div className="alert alert-info mb-4" role="alert">
        <div className="d-flex align-items-center">
          <i className="fas fa-info-circle me-2"></i>
          <div>
            <strong>Demo Data:</strong> You are viewing sample Google Business
            Profile data. Once your real Google Business Profile API is fully
            configured, this data will be replaced with your actual business
            information, reviews, and images.
          </div>
        </div>
      </div>

      <Card>
        <Card.Body className="p-0">
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k || "profile")}
            className="border-bottom px-3"
          >
            <Tab
              eventKey="profile"
              title={
                <span>
                  <i className="fas fa-store me-2"></i>
                  Business Profile
                </span>
              }
            >
              <div className="px-4 pt-0 mt-0">
                <BusinessProfileTab organisationId={organisationId} />
              </div>
            </Tab>

            <Tab
              eventKey="reviews"
              title={
                <span>
                  <i className="fas fa-star me-2"></i>
                  Reviews & Replies
                </span>
              }
            >
              <div className="p-4">
                <ReviewsTab organisationId={organisationId} />
              </div>
            </Tab>

            <Tab
              eventKey="images"
              title={
                <span>
                  <i className="fas fa-images me-2"></i>
                  Images
                </span>
              }
            >
              <div className="p-4">
                <ImagesTab organisationId={organisationId} />
              </div>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default GoogleBusinessDashboard;
