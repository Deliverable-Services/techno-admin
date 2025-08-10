import React, { useState } from "react";
import "./organization.css"; // Optional custom styles
import ProfileTab from "./ProfileTab";
import OrganizationTab from "./OrganisationTab";
import AppearanceTab from "./AppearanceTab";
import WebsiteTab from "./WebsiteTab";
import PlatformTab from "./PlatformTab";
import CustomConfigTab from "./CustomConfigTab";
import DomainTab from "./DomainTab";
import PageHeading from "../../shared-components/PageHeading";
import { GrOrganization } from "react-icons/gr";
import { Nav } from "react-bootstrap";

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
    <>
      {/* Header Section */}
      <div className="view-padding d-flex justify-content-between align-items-center">
        <PageHeading
          icon={<GrOrganization size={24} />}
          title="Organization Settings"
          description="Configure and manage your organization preferences"
          permissionReq="create_lead"
        />
      </div>
      <hr />

      <div className="px-4 py-4">
        <Nav
          className="nav-tabs global-navs w-100"
          variant="tabs"
          activeKey={activeTab}
          onSelect={(selectedKey) =>
            setActiveTab(selectedKey || "organization")
          }
        >
          {tabs.map((tab) => (
            <Nav.Item key={tab.key}>
              <Nav.Link eventKey={tab.key}>{tab.label}</Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        <div className="mt-4 mx-2">
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "organization" && <OrganizationTab />}
          {activeTab === "domains" && <DomainTab />}
          {activeTab === "appearance" && <AppearanceTab />}
          {activeTab === "website" && <WebsiteTab />}
          {activeTab === "platform" && <PlatformTab />}
          {activeTab === "configurations" && <CustomConfigTab />}
        </div>
      </div>
    </>
  );
};

export default Organization;
