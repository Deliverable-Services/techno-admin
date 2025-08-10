import React, { useState, useEffect } from "react";
import { GoogleBusinessProfile } from "../Integrations";
import useUserProfileStore from "../../hooks/useUserProfileStore";
import { useQueryClient } from "react-query";
import googleAnalyticsService, {
  GoogleAnalyticsConnectorStatus,
} from "../../services/googleAnalyticsService";
import { showMsgToast } from "../../utils/showMsgToast";
import { Badge } from "react-bootstrap";

const IntegrationsTab = () => {
  const loggedInUser = useUserProfileStore((state) => state.user);
  const queryClient = useQueryClient();
  const [googleAnalyticsStatus, setGoogleAnalyticsStatus] =
    useState<GoogleAnalyticsConnectorStatus | null>(null);
  const [loading, setLoading] = useState(false);

  // Function to refresh connection status
  const handleConnectionChange = () => {
    // Invalidate the connection status cache to force refresh
    queryClient.invalidateQueries(["google-business-connection-status"]);
    queryClient.invalidateQueries(["google-business-status"]);
    queryClient.invalidateQueries(["google-analytics-status"]);
  };

  const [formData, setFormData] = useState({
    gtmTagId: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Load Google Analytics status
  useEffect(() => {
    if (loggedInUser?.organisations[0]?.id) {
      loadGoogleAnalyticsStatus();
    }
  }, [loggedInUser?.organisations[0]?.id]);

  const loadGoogleAnalyticsStatus = async () => {
    if (!loggedInUser?.organisations[0]?.id) return;

    try {
      const status = await googleAnalyticsService.getStatus(
        loggedInUser.organisations[0].id
      );
      setGoogleAnalyticsStatus(status);
    } catch (error) {
      console.error("Failed to load Google Analytics status:", error);
    }
  };

  const handleGoogleAnalyticsConnect = async () => {
    if (!loggedInUser?.organisations[0]?.id) return;

    try {
      setLoading(true);
      const authData = await googleAnalyticsService.startAuth(
        loggedInUser.organisations[0].id
      );

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
          loadGoogleAnalyticsStatus(); // Reload status after OAuth
          handleConnectionChange(); // Refresh other connections
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
    if (!loggedInUser?.organisations[0]?.id) return;

    try {
      setLoading(true);
      await googleAnalyticsService.disconnect(loggedInUser.organisations[0].id);
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

  return (
    <div>
      <div className="tab-header">
        <h4>Integrations</h4>
        <p>
          From here you can connect your third-party platforms to your account.
        </p>
      </div>

      <div className="d-flex flex-column gap-4 mt-5">
        {/* Google Analytics */}
        <div className="w-100 border-bottom pb-4">
          <div className="row justify-content-between w-100">
            <div className="col-12 col-md-4">
              <h5 className="mb-4 d-flex align-items-center gap-12">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
                Google Analytics
              </h5>

              {googleAnalyticsStatus?.connected ? (
                <Badge variant="success">Connected</Badge>
              ) : null}
            </div>
            <div className="col-12 col-md-7">
              <div className="w-100">
                <div className="d-flex align-items-center">
                  {googleAnalyticsStatus?.connected ? (
                    <div className="d-flex align-items-center">
                      <span className="text-success mr-2">
                        <i className="fas fa-check-circle"></i>
                      </span>
                      <span className="text-success font-weight-bold">
                        Connected
                      </span>
                      <button
                        className="btn btn-outline-danger btn-sm ml-3"
                        onClick={handleGoogleAnalyticsDisconnect}
                        disabled={loading}
                      >
                        {loading ? (
                          <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                          "Disconnect"
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="card w-100 border-0">
                      <div className="card-body d-flex flex-column gap-12">
                        <p>
                          Connect your Google Analytics account to access the
                          dashboard and view detailed analytics data including
                          page views, active users, demographic audience, and
                          more directly from here.
                        </p>
                        <button
                          className="btn btn-primary"
                          onClick={handleGoogleAnalyticsConnect}
                          disabled={loading}
                        >
                          {loading ? (
                            <i className="fas fa-spinner fa-spin"></i>
                          ) : (
                            "Connect"
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="right-content">
        <div className="profile-card d-flex flex-column align-items-center">
          <div className="mt-5 border-div form-group w-100 mt-4 d-flex align-items-center">
            <h4 className="mb-4 title-style">Data Integrations</h4>
            <div className="row justify-content-start w-100">
              <div className="col-md-12">
                <div className="alert alert-info mb-3">
                  <i className="fas fa-info-circle me-2"></i>
                  <strong>Google My Business:</strong> Connect your Google
                  Business Profile to access the dashboard and manage your
                  business information, reviews, and images.
                </div>
                <GoogleBusinessProfile
                  organisationId={loggedInUser?.organisations[0]?.id}
                  className="mb-3"
                  onConnectionChange={handleConnectionChange}
                />
              </div>
            </div>
          </div>

          {/* Google Tag Manager */}
          <div className="form-group w-100 mt-4 d-flex align-items-center border-bottom pb-4 ">
            <label
              htmlFor="gtmTagId"
              style={{ minWidth: 200 }}
              className="title-style"
            >
              Google Tag Manager
            </label>
            <input
              type="text"
              className="form-control"
              id="gtmTagId"
              name="gtmTagId"
              value={formData.gtmTagId}
              onChange={handleInputChange}
              placeholder="Enter GTM Tag ID"
              style={{ maxWidth: 300 }}
            />
          </div>

          {/* Quickbooks */}
          <div className="form-group w-100 mt-3 d-flex align-items-center border-bottom pb-4">
            <label
              htmlFor="quickbooks"
              style={{ minWidth: 200 }}
              className="title-style"
            >
              Quickbooks
            </label>
            <input
              type="text"
              className="form-control"
              id="quickbooks"
              name="quickbooks"
              value=""
              disabled
              placeholder="Coming Soon"
              style={{ maxWidth: 300 }}
            />
            <span className="custom-badge-coming-soon ml-3">Coming Soon</span>
          </div>
          {/* Xero */}
          <div className="form-group w-100 mt-3 d-flex align-items-center">
            <label
              htmlFor="xero"
              style={{ minWidth: 200 }}
              className="title-style"
            >
              Xero
            </label>
            <input
              type="text"
              className="form-control"
              id="xero"
              name="xero"
              value=""
              disabled
              placeholder="Coming Soon"
              style={{ maxWidth: 300 }}
            />
            <span className="custom-badge-coming-soon ml-3">Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsTab;
