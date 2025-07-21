import React from "react";
import { Button, Card, Badge, Spinner, Alert } from "react-bootstrap";
import { useGoogleBusinessIntegration } from "../../hooks/useGoogleBusinessIntegration";
import IsLoading from "../../shared-components/isLoading";
import moment from "moment";

// Extend the status type to include our new fields
interface ExtendedStatus {
  business_profiles_count?: number;
  oauth_completed?: boolean;
  fivetran_error?: string;
}

interface GoogleBusinessProfileProps {
  organisationId?: number;
  className?: string;
}

const GoogleBusinessProfile: React.FC<GoogleBusinessProfileProps> = ({
  organisationId,
  className = "",
}) => {
  const {
    isConnected,
    connectionStatus,
    hasValidToken,
    connectorName,
    connectedAt,
    lastSyncAt,
    latestSync,
    isLoading,
    isConnecting,
    connect,
    disconnect,
    isConnectingOAuth,
    isDisconnecting,
    error,
    status,
  } = useGoogleBusinessIntegration({ organisationId });

  const getStatusBadge = () => {
    if (!isConnected) {
      return <Badge variant="secondary">Not Connected</Badge>;
    }

    switch (connectionStatus) {
      case "connected":
        return <Badge variant="success">Connected</Badge>;
      case "paused":
        return <Badge variant="warning">Paused</Badge>;
      case "broken":
        return <Badge variant="danger">Connection Issues</Badge>;
      case "pending":
        return <Badge variant="info">Connecting...</Badge>;
      default:
        return <Badge variant="secondary">{connectionStatus}</Badge>;
    }
  };

  const getSyncStatusBadge = () => {
    if (!latestSync) return null;

    switch (latestSync.status) {
      case "completed":
        return (
          <Badge variant="success" className="ml-2">
            Last Sync: Success
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="danger" className="ml-2">
            Last Sync: Failed
          </Badge>
        );
      case "running":
        return (
          <Badge variant="warning" className="ml-2">
            Syncing...
          </Badge>
        );
      default:
        return (
          <Badge variant="info" className="ml-2">
            Sync: {latestSync.status}
          </Badge>
        );
    }
  };

  const renderConnectionInfo = () => {
    if (!isConnected) return null;

    return (
      <div className="mt-3">
        <small className="text-muted">
          {connectedAt && (
            <div>
              Connected: {moment(connectedAt).format("MMM D, YYYY [at] h:mm A")}
            </div>
          )}
          {lastSyncAt && <div>Last Sync: {moment(lastSyncAt).fromNow()}</div>}
          {latestSync && latestSync.records_synced > 0 && (
            <div>
              Records Synced: {latestSync.records_synced.toLocaleString()}
            </div>
          )}
          {/* Show business profiles count */}
          {status &&
            (status as ExtendedStatus)?.business_profiles_count !==
              undefined && (
              <div>
                Business Profiles:{" "}
                {(status as ExtendedStatus).business_profiles_count}
              </div>
            )}
          {/* Show OAuth completion status */}
          {status && (status as ExtendedStatus)?.oauth_completed && (
            <div className="text-success">
              <i className="fas fa-check-circle"></i> OAuth completed
              successfully
            </div>
          )}
          {/* Show Fivetran error if exists */}
          {status && (status as ExtendedStatus)?.fivetran_error && (
            <div className="text-warning">
              <i className="fas fa-exclamation-triangle"></i> Fivetran setup
              pending
            </div>
          )}
          {!hasValidToken && (
            <div className="text-warning">
              <i className="fas fa-exclamation-triangle"></i> Token expired -
              reconnection required
            </div>
          )}
        </small>
      </div>
    );
  };

  const renderActionButton = () => {
    if (isLoading) {
      return (
        <Button variant="outline-primary" disabled>
          <Spinner as="span" animation="border" size="sm" className="mr-2" />
          {isConnecting ? "Connecting..." : "Loading..."}
        </Button>
      );
    }

    if (isConnected) {
      return (
        <Button
          variant="outline-danger"
          onClick={disconnect}
          disabled={isDisconnecting}
          size="sm"
        >
          {isDisconnecting ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                className="mr-2"
              />
              Disconnecting...
            </>
          ) : (
            "Disconnect"
          )}
        </Button>
      );
    }

    return (
      <Button
        variant="success"
        onClick={connect}
        disabled={isConnectingOAuth}
        className="d-flex align-items-center justify-content-center"
        style={{ height: "38px" }}
      >
        {isConnectingOAuth ? (
          <>
            <Spinner as="span" animation="border" size="sm" className="mr-2" />
            Connecting...
          </>
        ) : (
          <>
            <i className="fab fa-google mr-2"></i>
            Connect Google Business Profile
          </>
        )}
      </Button>
    );
  };

  if (isLoading && !isConnected) {
    return (
      <Card className={className}>
        <Card.Body className="text-center">
          <IsLoading />
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h6 className="card-title mb-2">
              <i className="fab fa-google mr-2 text-primary"></i>
              Google Business Profile
            </h6>
            <div className="d-flex align-items-center">
              {getStatusBadge()}
              {getSyncStatusBadge()}
            </div>
            {renderConnectionInfo()}
          </div>
          <div className="ml-3">{renderActionButton()}</div>
        </div>

        {/* Show additional info for broken connections */}
        {connectionStatus === "broken" && (
          <Alert variant="warning" className="mt-3 mb-0">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            There's an issue with your Google Business Profile connection.
            Please reconnect to resume data synchronization.
          </Alert>
        )}

        {/* Show warning if token is invalid */}
        {isConnected && !hasValidToken && (
          <Alert variant="warning" className="mt-3 mb-0">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            Your Google access token has expired. Please reconnect to continue
            syncing data.
          </Alert>
        )}

        {/* Show error message if there's an API error */}
        {error && (error as any)?.response?.status !== 404 && (
          <Alert variant="danger" className="mt-3 mb-0">
            <i className="fas fa-exclamation-circle mr-2"></i>
            Unable to load connection status. Please try again.
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default GoogleBusinessProfile;
