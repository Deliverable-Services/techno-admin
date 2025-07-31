import React, { useState } from "react";

import "./organization.css"; // Optional custom styles
import { useMsgToastStore } from "../../shared-components/MsgToast/useMsgToastStore";
import useUserProfileStore from "../../hooks/useUserProfileStore";

import ProfileTab from "./ProfileTab";
import OrganizationTab from "./OrganisationTab";
import AppearanceTab from "./AppearanceTab";
import WebsiteTab from "./WebsiteTab";
import PlatformTab from "./PlatformTab";
import IntegrationsTab from "./IntegrationTab";

const Organization: React.FC = () => {
  const loggedInUser = useUserProfileStore((state) => state.user);
  const [selectedStoreType, setSelectedStoreType] = useState(
    loggedInUser?.organisations[0]?.store_type.toLowerCase() || "crm"
  );
  const showToast = useMsgToastStore((state) => state.showToast);
  const [activeTab, setActiveTab] = useState<string>("organization");
  // Tab definitions for mapping
  const tabs = [
    { key: "profile", label: "Profile" },
    { key: "organization", label: "Organization" },
    { key: "appearance", label: "Appearance" },
    { key: "website", label: "Website Details" },
    { key: "platform", label: "Platform Configurations" },
    { key: "integrations", label: "Integrations" },
  ];

  // Centralized form state for all tabs
  const [formData, setFormData] = useState({
    // Profile
    profileImage: null as string | null,
    fname: "",
    lname: "",
    email: "",
    phone: "",
    // Organization
    organizationName: "",
    organizationEmail: "",
    organizationSlug: "",
    storeType: selectedStoreType, // 'crm' or 'ecommerce'
    // Appearance
    primary: "#007bff",
    secondary: "#6c757d",
    language: "",
    currency: "",
    // Website
    cemail: "",
    cphone: "",
    caddress: "",
    // Platform
    minOrderCart: "",
    copyrightMsg: "",
    socialLinks: [] as Array<{ type: string; value: string }>,
    // Integrations
    gtmTagId: "",
  });

  const handleSelect = (org: "crm" | "ecommerce") => {
    setSelectedStoreType(org);
  };

  // Update all input handlers to use formData
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // For organization card selection, update selectedStoreType as well
    if (name === "storeType") setSelectedStoreType(value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        profileImage: URL.createObjectURL(e.target.files[0]),
      }));
    }
  };

  // Social links logic
  const [selectedSocial, setSelectedSocial] = useState("");
  const [socialValue, setSocialValue] = useState("");
  const socialOptions = [
    {
      value: "facebook",
      label: "Facebook",
      icon: <img src="/assets/facebook.png" alt="fb" />,
    },
    {
      value: "twitter",
      label: "Twitter",
      icon: <img src="/assets/twitter.png" alt="tw" />,
    },
    {
      value: "instagram",
      label: "Instagram",
      icon: <img src="/assets/instagram.png" alt="insta" />,
    },
    {
      value: "linkedin",
      label: "LinkedIn",
      icon: <img src="/assets/linkedin.png" alt="li" />,
    },
    {
      value: "youtube",
      label: "YouTube",
      icon: <img src="/assets/youtube.png" alt="yt" />,
    },
    {
      value: "website",
      label: "Website",
      icon: <img src="/assets/website.png" alt="web" />,
    },
  ];
  const handleAddSocial = () => {
    if (selectedSocial && socialValue) {
      setFormData((prev) => ({
        ...prev,
        socialLinks: [
          ...prev.socialLinks,
          { type: selectedSocial, value: socialValue },
        ],
      }));
      setSelectedSocial("");
      setSocialValue("");
    }
  };
  const handleRemoveSocial = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== idx),
    }));
  };

  // Save handler: only send organization card selection for now
  // const handleSave = async () => {
  //   setIsLoading(true);
  //   try {
  //     const storeType = selectedStoreType === "crm" ? "CRM" : "ECOMMERCE";
  //     await API.put(
  //       "organisation/store-type",
  //       { store_type: storeType },
  //       {
  //         headers: {
  //           Authorization: token ? `Bearer ${token}` : undefined,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     setIsLoading(false);
  //     showToast({ message: "Organization type updated successfully!" });
  //     setTimeout(() => {
  //       window.location.reload();
  //     }, 2000);
  //   } catch (error) {
  //     setIsLoading(false);
  //     console.error(error);
  //   }
  // };

  // Remove all individual states for these fields
  // const [profileImage, setProfileImage] = useState<string | null>(null);
  // const [form, setForm] = useState({ name: '', email: '', phone: '' });

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setProfileImage(URL.createObjectURL(e.target.files[0]));
  //   }
  // };

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setForm({ ...form, [e.target.name]: e.target.value });
  // };

  // const handleProfileSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log('Profile form submitted:', form, profileImage);
  //   alert('Profile form submitted! Check console for values.');
  // };

  // Platform Configurations state
  // const [minOrderCart, setMinOrderCart] = useState('');
  // const [copyrightMsg, setCopyrightMsg] = useState('');
  // const [socialLinks, setSocialLinks] = useState<Array<{ type: string; value: string }>>([]);
  // const [selectedSocial, setSelectedSocial] = useState('');
  // const [socialValue, setSocialValue] = useState('');

  // const handleAddSocial = () => {
  //   if (selectedSocial && socialValue) {
  //     setSocialLinks([...socialLinks, { type: selectedSocial, value: socialValue }]);
  //     setSelectedSocial('');
  //     setSocialValue('');
  //   }
  // };

  // const handleRemoveSocial = (idx: number) => {
  //   setSocialLinks(socialLinks.filter((_, i) => i !== idx));
  // };

  // Integrations state
  // const [gtmTagId, setGtmTagId] = useState('');

  return (
    <div>
      <div className="organization-main">
        <div className="d-flex justify-content-between">
          <h2 className="main-head">Organization Settings</h2>
          <input
            style={{ width: "300px" }}
            type="search"
            className="form-control"
            name="search"
            placeholder="Search"
          />
        </div>
        {/* Save Button on top */}
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
          {/* <button
            className="btn btn-primary btn-fixed-bottom-right"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? <IsLoading /> : "Saveq"}
          </button> */}
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
            {activeTab === "organization" && (
              <OrganizationTab
              // organisationOptions={organisationOptions}
              // setSelectedOrg={setSelectedOrg}
              // selectedStoreType={selectedStoreType}
              // setSelectedStoreType={setSelectedStoreType}
              // setFormData={setFormData}
              />
            )}
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
            {activeTab === "website" && (
              <WebsiteTab
                formData={formData}
                handleInputChange={handleInputChange}
              />
            )}
          </div>
          <div
            className={`tab-pane fade${
              activeTab === "platform" ? " show active" : ""
            }`}
          >
            {activeTab === "platform" && (
              <PlatformTab
                formData={formData}
                handleInputChange={handleInputChange}
                selectedSocial={selectedSocial}
                setSelectedSocial={setSelectedSocial}
                socialValue={socialValue}
                setSocialValue={setSocialValue}
                socialOptions={socialOptions}
                handleAddSocial={handleAddSocial}
                handleRemoveSocial={handleRemoveSocial}
              />
            )}
          </div>
          <div
            className={`tab-pane fade${
              activeTab === "integrations" ? " show active" : ""
            }`}
          >
            {activeTab === "integrations" && (
              <IntegrationsTab
                loggedInUser={loggedInUser}
                formData={formData}
                handleInputChange={handleInputChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Organization;
