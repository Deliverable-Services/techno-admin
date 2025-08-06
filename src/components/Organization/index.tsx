import React, { useState } from "react";
import "./organization.css"; // Optional custom styles
import ProfileTab from "./ProfileTab";
import OrganizationTab from "./OrganisationTab";
import AppearanceTab from "./AppearanceTab";
import WebsiteTab from "./WebsiteTab";
import PlatformTab from "./PlatformTab";
import IntegrationsTab from "./IntegrationTab";
import CustomConfigTab from "./CustomConfigTab";
import DomainTab from "./DomainTab";
import PageHeading from "../../shared-components/PageHeading";
import { GrOrganization } from "react-icons/gr";

const tabs = [
  { key: "profile", label: "Profile" },
  { key: "organization", label: "Organization" },
  { key: "domains", label: "Domains" },
  { key: "appearance", label: "Appearance" },
  { key: "website", label: "Website Details" },
  { key: "platform", label: "Platform Configurations" },
  { key: "configurations", label: "Temp: Custom Config" },
  { key: "integrations", label: "Integrations" },
];

const Organization: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("organization");

  return (
    <div className="card">
      <div>
        <div className="organization-main p-5">
          <div className="d-flex justify-content-between">
            <PageHeading title="Organization Settings" icon={<GrOrganization />} />
          </div>
          <div className="d-flex g-4 align-items-center mb-4 mx-auto">
            {/* Bootstrap Nav Tabs with map */}
            <ul className="nav nav-tabs m-0 my-4 w-auto mr-4">
              {tabs.map((tab) => (
                <li className="nav-item" key={tab.key}>
                  <button
                    className={`nav-link${
                      activeTab === tab.key ? " active" : ""
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            <div
              className={`tab-pane fade${
                activeTab === "profile" ? " show active" : ""
              }`}
            >
              {activeTab === "profile" && <ProfileTab />}
            </div>
            <div
              className={`tab-pane fade${
                activeTab === "organization" ? " show active" : ""
              }`}
            >
              {activeTab === "organization" && <OrganizationTab />}
            </div>
            <div
              className={`tab-pane fade${
                activeTab === "domains" ? " show active" : ""
              }`}
            >
              {activeTab === "domains" && <DomainTab />}
            </div>
            <div
              className={`tab-pane fade${
                activeTab === "appearance" ? " show active" : ""
              }`}
            >
              {activeTab === "appearance" && <AppearanceTab />}
            </div>
            <div
              className={`tab-pane fade${
                activeTab === "website" ? " show active" : ""
              }`}
            >
              {activeTab === "website" && <WebsiteTab />}
            </div>
            <div
              className={`tab-pane fade${
                activeTab === "platform" ? " show active" : ""
              }`}
            >
              {activeTab === "platform" && <PlatformTab />}
            </div>
            <div
              className={`tab-pane fade${
                activeTab === "configurations" ? " show active" : ""
              }`}
            >
              {activeTab === "configurations" && <CustomConfigTab />}
            </div>
            <div
              className={`tab-pane fade${
                activeTab === "integrations" ? " show active" : ""
              }`}
            >
              {activeTab === "integrations" && <IntegrationsTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Organization;
