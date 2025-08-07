import React, { useState, useEffect } from "react";
import { GoogleBusinessProfile } from "../Integrations";
import useUserProfileStore from "../../hooks/useUserProfileStore";
import { useQueryClient } from "react-query";
import googleAnalyticsService, {
  GoogleAnalyticsConnectorStatus,
} from "../../services/googleAnalyticsService";
import { showMsgToast } from "../../utils/showMsgToast";

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
        <p>This will have third-party platform integration options.</p>
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
          {/* Google Analytics Integration */}
          <div className="mt-5 border-div form-group w-100 mt-4 d-flex align-items-center">
            <h4 className="mb-4 title-style">Google Analytics Integration</h4>
            <div className="row justify-content-start w-100">
              <div className="col-md-12">
                <div className="alert alert-info mb-3">
                  <i className="fas fa-info-circle me-2"></i>
                  <strong>Google Analytics:</strong> Connect your Google
                  Analytics account to access the dashboard and view detailed
                  analytics data including page views, active users, demographic
                  audience, and more.
                </div>
                {/* Google Analytics Connection */}
                <div className="form-group w-100 mt-3 d-flex align-items-center border-bottom pb-4">
                  <label
                    htmlFor="google-analytics"
                    style={{ minWidth: 200 }}
                    className="title-style"
                  >
                    Google Analytics
                  </label>
                  <div
                    className="d-flex align-items-center"
                    style={{ maxWidth: 300 }}
                  >
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
                      <div className="d-flex align-items-center">
                        <span className="text-muted mr-2">
                          <i className="fas fa-times-circle"></i>
                        </span>
                        <span className="text-muted">Not Connected</span>
                        <button
                          className="btn btn-primary btn-sm ml-3"
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
                    )}
                  </div>
                </div>
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
