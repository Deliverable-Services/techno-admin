import React, { useState } from "react";
import { GoogleBusinessProfile } from "../Integrations";
import useUserProfileStore from "../../hooks/useUserProfileStore";
import { useQueryClient } from "react-query";

const IntegrationsTab = () => {
  const loggedInUser = useUserProfileStore((state) => state.user);
  const queryClient = useQueryClient();

  // Function to refresh connection status
  const handleConnectionChange = () => {
    // Invalidate the connection status cache to force refresh
    queryClient.invalidateQueries(["google-business-connection-status"]);
    queryClient.invalidateQueries(["google-business-status"]);
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
          {/* Google Analytics */}
          <div className="form-group w-100 mt-3 d-flex align-items-center border-bottom pb-4">
            <label
              htmlFor="ga"
              style={{ minWidth: 200 }}
              className="title-style"
            >
              Google Analytics
            </label>
            <input
              type="text"
              className="form-control"
              id="ga"
              name="ga"
              value=""
              disabled
              placeholder="Coming Soon"
              style={{ maxWidth: 300 }}
            />
            <span className="custom-badge-coming-soon ml-3">Coming Soon</span>
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
