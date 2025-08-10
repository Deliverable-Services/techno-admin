import React from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useHistory } from "react-router-dom";
import { useGoogleBusinessIntegration } from "./useGoogleBusinessIntegration";
import useUserProfileStore from "../../hooks/useUserProfileStore";

const IntegrationsWidget: React.FC = () => {
  const history = useHistory();
  const loggedInUser = useUserProfileStore((state) => state.user);

  const {
    isConnected: isGoogleConnected,
    connectionStatus: googleStatus,
    isLoading: isGoogleLoading,
  } = useGoogleBusinessIntegration({
    organisationId: loggedInUser?.organisations?.[0]?.id,
  });

  const getStatusBadge = (status: string, isConnected: boolean) => {
    if (isConnected && status === "connected") {
      return (
        <Badge bg="success" className="ml-2">
          Connected
        </Badge>
      );
    }
    if (isConnected && status === "broken") {
      return (
        <Badge bg="warning" className="ml-2">
          Issue
        </Badge>
      );
    }
    return (
      <Badge bg="secondary" className="ml-2">
        Not Connected
      </Badge>
    );
  };

  const connectedCount = isGoogleConnected ? 1 : 0;
  const totalIntegrations = 1; // Will increase as we add more integrations

  return (
    <Card className="h-100">
      <CardContent>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h6 className="card-title mb-2">
              <i className="fas fa-plug mr-2 text-primary"></i>
              Data Integrations
            </h6>
            <div className="d-flex align-items-center mb-3">
              <span className="h4 mb-0 text-primary">{connectedCount}</span>
              <span className="text-muted ml-1">
                / {totalIntegrations} connected
              </span>
            </div>
          </div>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => history.push("/integrations")}
          >
            Manage
          </Button>
        </div>

        <div className="mt-3">
          <div className="d-flex justify-content-between align-items-center py-2">
            <div className="d-flex align-items-center">
              <i className="fab fa-google text-primary mr-2"></i>
              <span className="small">Google Business Profile</span>
            </div>
            {isGoogleLoading ? (
              <Spinner size="sm" className="text-muted" />
            ) : (
              getStatusBadge(googleStatus, isGoogleConnected)
            )}
          </div>

          {/* Future integrations can be added here */}
          <div className="d-flex justify-content-between align-items-center py-2 text-muted">
            <div className="d-flex align-items-center">
              <i className="fab fa-facebook text-muted mr-2"></i>
              <span className="small">Facebook Ads</span>
            </div>
            <Badge bg="light">Coming Soon</Badge>
          </div>

          <div className="d-flex justify-content-between align-items-center py-2 text-muted">
            <div className="d-flex align-items-center">
              <i className="fab fa-google text-muted mr-2"></i>
              <span className="small">Google Ads</span>
            </div>
            <Badge bg="light">Coming Soon</Badge>
          </div>
        </div>

        {connectedCount === 0 && (
          <div className="text-center mt-3 pt-3 border-top">
            <small className="text-muted">
              Connect your first data source to start syncing
            </small>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IntegrationsWidget;
