import React, { useState } from "react";
import ProfileTab from "./ProfileTab";
import OrganizationTab from "./OrganisationTab";
import AppearanceTab from "./AppearanceTab";
import WebsiteTab from "./WebsiteTab";
import PlatformTab from "./PlatformTab";
import CustomConfigTab from "./CustomConfigTab";
import DomainTab from "./DomainTab";
import PageHeading from "../../shared-components/PageHeading";
import { Hammer } from "../ui/icon";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";

const tabs = [
  { key: "profile", label: "Profile", content: <ProfileTab /> },
  { key: "organization", label: "Organization", content: <OrganizationTab /> },
  { key: "domains", label: "Domains", content: <DomainTab /> },
  { key: "appearance", label: "Appearance", content: <AppearanceTab /> },
  { key: "website", label: "Website", content: <WebsiteTab /> },
  { key: "platform", label: "Platform", content: <PlatformTab /> },
  {
    key: "configurations",
    label: "Configurations",
    content: <CustomConfigTab />,
  },
];

const Organization: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("organization");

  return (
    <>
      {/* Header Section */}
      <div className="view-padding d-flex justify-content-between align-items-center">
        <PageHeading
          icon={<Hammer size={24} />}
          title="Organization Settings"
          description="Configure and manage your organization preferences"
          permissionReq="create_lead"
        />
      </div>
      <hr />

      <div className="px-4 py-4">
        <Tabs defaultValue={activeTab}>
          <TabsList className="mb-2">
            {tabs.map((tab) => (
              <TabsTrigger value={tab.key}>{tab.label}</TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent value={tab.key}>{tab.content}</TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  );
};

export default Organization;
