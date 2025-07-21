import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import useUserProfileStore from "../../hooks/useUserProfileStore";
import { GoogleBusinessProfile } from "./index";
import BackButton from "../../shared-components/BackButton";

const IntegrationsPage: React.FC = () => {
  const loggedInUser = useUserProfileStore((state) => state.user);

  return (
    <Container fluid className="py-4">
      <div className="d-flex align-items-center mb-4">
        <BackButton title="Back" />
        <h1 className="ml-3 mb-0">Data Integrations</h1>
      </div>

      <Row>
        <Col lg={8} xl={6}>
          <Card className="mb-4">
            <Card.Body>
              <h5 className="card-title mb-3">
                <i className="fas fa-plug mr-2 text-primary"></i>
                Available Integrations
              </h5>
              <p className="text-muted">
                Connect your external data sources to automatically sync
                information into your dashboard. All data is processed securely
                through Fivetran's enterprise-grade infrastructure.
              </p>
            </Card.Body>
          </Card>

          {/* Google Business Profile Integration */}
          <GoogleBusinessProfile
            organisationId={loggedInUser?.organisation?.id}
            className="mb-4"
          />

          {/* Placeholder for Future Integrations */}
          <Card className="mb-4">
            <Card.Body className="text-center py-5">
              <i className="fas fa-plus-circle fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">More Integrations Coming Soon</h5>
              <p className="text-muted mb-0">
                We're working on adding more data sources like Facebook Ads,
                Google Ads, Salesforce, and more. Stay tuned!
              </p>
            </Card.Body>
          </Card>
        </Col>

        {/* Info Sidebar */}
        <Col lg={4} xl={6}>
          <Card className="bg-light">
            <Card.Body>
              <h6 className="card-title">
                <i className="fas fa-info-circle mr-2"></i>
                About Data Integrations
              </h6>
              <div className="small text-muted">
                <div className="mb-3">
                  <strong>Secure & Reliable</strong>
                  <p className="mb-0">
                    All integrations are powered by Fivetran, ensuring
                    enterprise-grade security and 99.9% uptime for your data
                    syncing.
                  </p>
                </div>

                <div className="mb-3">
                  <strong>Automatic Syncing</strong>
                  <p className="mb-0">
                    Once connected, your data will automatically sync at regular
                    intervals. No manual exports or imports needed.
                  </p>
                </div>

                <div className="mb-3">
                  <strong>Real-time Dashboard</strong>
                  <p className="mb-0">
                    View all your connected data sources and their sync status
                    from your main dashboard.
                  </p>
                </div>

                <div>
                  <strong>Need Help?</strong>
                  <p className="mb-0">
                    Contact our support team if you need assistance setting up
                    any integration or have questions about your data.
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default IntegrationsPage;
