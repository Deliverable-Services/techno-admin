import React, { useState } from "react";
import { Container, Row, Col, Card, Tabs, Tab } from "react-bootstrap";
import { useGoogleBusinessIntegration } from "../../hooks/useGoogleBusinessIntegration";
import useUserProfileStore from "../../hooks/useUserProfileStore";
import BackButton from "../../shared-components/BackButton";
import BusinessProfileTab from "./BusinessProfileTab";
import ReviewsTab from "./ReviewsTab";
import ImagesTab from "./ImagesTab";
import { GoogleBusinessProfile } from "../Integrations";
import IsLoading from "../../shared-components/isLoading";

const GoogleBusinessDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const loggedInUser = useUserProfileStore((state) => state.user);
  const organisationId = loggedInUser?.organisation?.id;

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

  // If not connected, show the connection interface
  if (!isConnected || connectionStatus !== "connected") {
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
                <h3 className="mb-3">Connect Your Google Business Profile</h3>
                <p className="text-muted mb-4">
                  Connect your Google Business Profile to view and manage your
                  business information, reviews, and images all from one
                  dashboard.
                </p>

                <GoogleBusinessProfile
                  organisationId={organisationId}
                  className="mb-4"
                />

                <div className="mt-4 text-muted small">
                  <p className="mb-2">
                    <i className="fas fa-shield-alt me-2"></i>
                    Secure connection powered by Google OAuth 2.0
                  </p>
                  <p className="mb-0">
                    <i className="fas fa-sync me-2"></i>
                    Automatic data synchronization every hour
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
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center">
          <BackButton title="Back" />
          <h1 className="ml-3 mb-0">Google Business Profile Dashboard</h1>
        </div>

        <div className="d-flex align-items-center">
          <GoogleBusinessProfile
            organisationId={organisationId}
            className="mb-0"
          />
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
              <div className="p-4">
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
