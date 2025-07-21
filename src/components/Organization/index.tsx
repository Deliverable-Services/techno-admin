// components/Organization.tsx

import React, { useState } from "react";
import "./organization.css"; // Optional custom styles
import API from "../../utils/API";
import useTokenStore from "../../hooks/useTokenStore";
import IsLoading from "../../shared-components/isLoading";
import { useMsgToastStore } from "../../shared-components/MsgToast/useMsgToastStore";
import useUserProfileStore from "../../hooks/useUserProfileStore";
import { GoogleBusinessProfile } from "../Integrations";
import profile from "../../assets/profile.svg";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaGlobe } from 'react-icons/fa';

const Organization: React.FC = () => {
  const loggedInUser = useUserProfileStore((state) => state.user);
  let storeType = loggedInUser?.organisation?.store_type.toLowerCase() || "crm"; // Default to CRM if not set
  const [selectedOrg, setSelectedOrg] = useState(storeType);
  const token = useTokenStore((state) => state.accessToken);
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useMsgToastStore((state) => state.showToast);
  const [activeTab, setActiveTab] = useState<string>('organization');
  // Tab definitions for mapping
  const tabs = [
    { key: 'profile', label: 'Profile' },
    { key: 'organization', label: 'Organization' },
    { key: 'appearance', label: 'Appearance' },
    { key: 'website', label: 'Website Details' },
    { key: 'platform', label: 'Platform Configurations' },
    { key: 'integrations', label: 'Integrations' },
  ];

  // Centralized form state for all tabs
  const [formData, setFormData] = useState({
    // Profile
    profileImage: null as string | null,
    name: '',
    email: '',
    phone: '',
    // Organization
    organizationName: '',
    organizationEmail: '',
    organizationSlug: '',
    storeType: storeType, // 'crm' or 'ecommerce'
    // Appearance
    primary: '',
    secondary: '',
    language: '',
    currency: '',
    // Website
    cemail: '',
    cphone: '',
    caddress: '',
    // Platform
    minOrderCart: '',
    copyrightMsg: '',
    socialLinks: [] as Array<{ type: string; value: string }>,
    // Integrations
    gtmTagId: '',
  });

  const handleSelect = (org: "crm" | "ecommerce") => {
    setSelectedOrg(org);
  };

  // Update all input handlers to use formData
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // For organization card selection, update selectedOrg as well
    if (name === 'storeType') setSelectedOrg(value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, profileImage: URL.createObjectURL(e.target.files[0]) }));
    }
  };

  // Social links logic
  const [selectedSocial, setSelectedSocial] = useState('');
  const [socialValue, setSocialValue] = useState('');
  const socialOptions = [
    { value: 'facebook', label: 'Facebook', icon: <FaFacebook /> },
    { value: 'twitter', label: 'Twitter', icon: <FaTwitter /> },
    { value: 'instagram', label: 'Instagram', icon: <FaInstagram /> },
    { value: 'linkedin', label: 'LinkedIn', icon: <FaLinkedin /> },
    { value: 'youtube', label: 'YouTube', icon: <FaYoutube /> },
    { value: 'website', label: 'Website', icon: <FaGlobe /> },
  ];
  const handleAddSocial = () => {
    if (selectedSocial && socialValue) {
      setFormData(prev => ({
        ...prev,
        socialLinks: [...prev.socialLinks, { type: selectedSocial, value: socialValue }],
      }));
      setSelectedSocial('');
      setSocialValue('');
    }
  };
  const handleRemoveSocial = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== idx),
    }));
  };

  // Save handler: only send organization card selection for now
  const handleSave = async () => {
    setIsLoading(true);
    try {
      const storeType = selectedOrg === 'crm' ? 'CRM' : 'ECOMMERCE';
      await API.put(
        'organisation/store-type',
        { store_type: storeType },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            'Content-Type': 'application/json',
          },
        }
      );
      setIsLoading(false);
      showToast({ message: 'Organization type updated successfully!' });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

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
        {/* Save Button on top */}
        <div className="d-flex justify-content-between align-items-center mb-4 mx-auto px-5" style={{ maxWidth: '1040px' }}>
          {/* Bootstrap Nav Tabs with map */}
          <ul className="nav nav-tabs">
            {tabs.map(tab => (
              <li className="nav-item" key={tab.key}>
                <button
                  className={`nav-link${activeTab === tab.key ? ' active' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
          <button className="btn btn-primary" onClick={handleSave} disabled={isLoading}>
            {isLoading ? <IsLoading /> : 'Save'}
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content px-5" style={{ maxWidth: '1040px', margin: 'auto' }}>
          <div className={`tab-pane fade${activeTab === 'profile' ? ' show active' : ''}`}>
            {activeTab === 'profile' && (
              <div className="mt-5">
                <div>
                  <div className="right-content">
                    <div className="profile-card d-flex flex-column align-items-center">
                      <div className="mx-auto" style={{ height: 100, width: 100 }}>
                        <img
                          src={formData.profileImage || profile}
                          alt="Profile"
                          style={{ borderRadius: "50%", objectFit: "cover", width: 100, height: 100 }}
                        />
                      </div>
                      <div className="update-profile-pic mt-3">
                        <input
                          accept="image/*"
                          className={"d-none"}
                          id="contained-button-file"
                          type="file"
                          onChange={handleImageChange}
                        />
                        <label htmlFor="contained-button-file">
                          <div className="d-flex bg-primary text-white align-items-center px-2 py-1 rounded" style={{ cursor: 'pointer' }}>
                            <span style={{ fontSize: 18, marginRight: 8 }}>⬆️</span>
                            <p className="mb-0 ml-2">Change Profile Picture</p>
                          </div>
                        </label>
                      </div>
                      <div className="form-group w-100 mt-4 d-flex align-items-center">
                        <label htmlFor="name">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your name"
                        />
                      </div>
                      <div className="form-group w-100 mt-3 d-flex align-items-center">
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="form-group w-100 mt-3 d-flex align-items-center">
                        <label htmlFor="phone">Phone</label>
                        <input
                          type="text"
                          className="form-control"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={`tab-pane fade${activeTab === 'organization' ? ' show active' : ''}`}>
            {activeTab === 'organization' && (
              <>
                <h2 className="mb-5">Choose Your Organization</h2>
                <div>
                  <div className="right-content">
                    <div className="profile-card d-flex flex-column align-items-center">
                      <div className="form-group w-100 mt-4 d-flex align-items-center">
                        <label htmlFor="organizationName">Organisation Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="organizationName"
                          name="organizationName"
                          value={formData.organizationName}
                          onChange={handleInputChange}
                          placeholder="Enter organisation name "
                        />
                      </div>
                      <div className="form-group w-100 mt-3 d-flex align-items-center">
                        <label htmlFor="organizationEmail">Organisation Email</label>
                        <input
                          type="email"
                          className="form-control"
                          id="organizationEmail"
                          name="organizationEmail"
                          value={formData.organizationEmail}
                          onChange={handleInputChange}
                          placeholder="Enter organisation email"
                        />
                      </div>
                      <div className="form-group w-100 mt-3 d-flex align-items-center">
                        <label htmlFor="organizationSlug">Organisation Slug</label>
                        <input
                          type="text"
                          className="form-control"
                          id="organizationSlug"
                          name="organizationSlug"
                          value={formData.organizationSlug}
                          onChange={handleInputChange}
                          placeholder="Enter organisation slug"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row justify-content-center mt-5">
                  {/* CRM */}
                  <div className="col-md-6">
                    <div
                      className={`card mb-4 shadow ${selectedOrg === "crm" ? "border-primary selected" : ""}`}
                      onClick={() => {
                        setSelectedOrg("crm");
                        setFormData(prev => ({ ...prev, storeType: 'crm' }));
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src="https://miro.medium.com/v2/resize:fit:1400/1*TR-8mgpp0_X5P0ZbB6XYfQ.jpeg"
                        className="card-img-top"
                        alt="CRM"
                      />
                      <div className="card-body text-center">
                        <h5 className="card-title text-primary">CRM </h5>
                        <p>Manage leads, sales, and customer relationships.</p>
                      </div>
                    </div>
                  </div>
                  {/* Ecommerce */}
                  <div className="col-md-6">
                    <div
                      className={`card mb-4 shadow ${selectedOrg === "ecommerce" ? "border-success selected" : ""}`}
                      onClick={() => {
                        setSelectedOrg("ecommerce");
                        setFormData(prev => ({ ...prev, storeType: 'ecommerce' }));
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src="https://s3.envato.com/files/101016168/2a.UCM-CRM-dashboard-desktop.png"
                        className="card-img-top"
                        alt="Ecommerce"
                      />
                      <div className="card-body text-center">
                        <h5 className="card-title">Ecommerce </h5>
                        <p>Control your online store, products, and orders.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className={`tab-pane fade${activeTab === 'appearance' ? ' show active' : ''}`}>
            {activeTab === 'appearance' && (
              <div>
                <h2 className="mb-2">Appearance</h2>
                <p className="mb-5">Used to manage the organisation’s branding and color scheme.</p>
                <div className="right-content">
                  <div className="profile-card d-flex flex-column align-items-center">
                    <div className="form-group w-100 mt-4 d-flex align-items-center">
                      <label htmlFor="primary">Brand Primary Color</label>
                      <input
                        type="color"
                        className="form-control color"
                        id="primary"
                        name="primary"
                        value={formData.primary}
                        onChange={handleInputChange}
                        placeholder="Enter organisation name "
                      />
                    </div>
                    <div className="form-group w-100 mt-3 d-flex align-items-center">
                      <label htmlFor="secondary">Brand Secondary Color</label>
                      <input
                        type="color"
                        className="form-control color"
                        id="secondary"
                        name="secondary"
                        value={formData.secondary}
                        onChange={handleInputChange}
                        placeholder="Enter organisation email"
                      />
                    </div>
                    <div className="form-group w-100 mt-3 d-flex align-items-center">
                      <label htmlFor="language">Preferences Language</label>
                      <select className="form-control" id="language" name="language" value={formData.language} onChange={handleInputChange}>
                        <option value="">Select Language</option>
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="Turkey">Turkey</option>
                      </select>
                    </div>
                    <div className="form-group w-100 mt-3 d-flex align-items-center">
                      <label htmlFor="currency">Preferences Currency</label>
                      <select className="form-control" id="currency" name="currency" value={formData.currency} onChange={handleInputChange}>
                        <option value="">Select Currency</option>
                        <option value="IN">IN</option>
                        <option value="US">US</option>
                        <option value="EURO">EURO</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={`tab-pane fade${activeTab === 'website' ? ' show active' : ''}`}>
            {activeTab === 'website' && (
              <>
                <h2 className="mb-5">Contact Details</h2>
                <div>
                  <div className="right-content">
                    <div className="profile-card d-flex flex-column align-items-center">
                      <div className="form-group w-100 mt-4 d-flex align-items-center">
                        <label htmlFor="cemail">Contact Email</label>
                        <input
                          type="email"
                          className="form-control"
                          id="cemail"
                          name="cemail"
                          value={formData.cemail}
                          onChange={handleInputChange}
                          placeholder="Enter contact email"
                        />
                      </div>
                      <div className="form-group w-100 mt-3 d-flex align-items-center">
                        <label htmlFor="cphone">Contact Phone</label>
                        <input
                          type="phone"
                          className="form-control"
                          id="cphone"
                          name="cphone"
                          value={formData.cphone}
                          onChange={handleInputChange}
                          placeholder="Enter contact phone"
                        />
                      </div>
                      <div className="form-group w-100 mt-3 d-flex align-items-center">
                        <label htmlFor="caddress">Contact Address</label>
                        <input
                          type="text"
                          className="form-control"
                          id="caddress"
                          name="caddress"
                          value={formData.caddress}
                          onChange={handleInputChange}
                          placeholder="Enter contact address"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className={`tab-pane fade${activeTab === 'platform' ? ' show active' : ''}`}>
            {activeTab === 'platform' && (
              <div>
                <h2 className="mb-2">Platform Configurations</h2>
                <p className="mb-5">Used for setting global business rules or platform logic.</p>
                <div className="right-content">
                  <div className="profile-card d-flex flex-column align-items-center">
                    <div className="form-group w-100 mt-4 d-flex align-items-center">
                      <label htmlFor="minOrderCart">Minimum Order Cart</label>
                      <input
                        type="number"
                        className="form-control"
                        id="minOrderCart"
                        name="minOrderCart"
                        value={formData.minOrderCart}
                        onChange={handleInputChange}
                        placeholder="Enter minimum order cart value"
                      />
                    </div>
                    <div className="form-group w-100 mt-3 d-flex align-items-center">
                      <label htmlFor="copyrightMsg">Copyright Message</label>
                      <input
                        type="text"
                        className="form-control"
                        id="copyrightMsg"
                        name="copyrightMsg"
                        value={formData.copyrightMsg}
                        onChange={handleInputChange}
                        placeholder="Enter copyright message"
                      />
                    </div>
                    <div className="form-group w-100 mt-3">
                      <label>Social Media Links</label>
                      <div className="d-flex align-items-center mb-2">
                        <select
                          className="form-control mr-2"
                          style={{ maxWidth: 180 }}
                          value={selectedSocial}
                          onChange={e => setSelectedSocial(e.target.value)}
                        >
                          <option value="">Select Social Platform</option>
                          {socialOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          className="form-control mr-2"
                          style={{ maxWidth: 300 }}
                          placeholder="Enter link or username"
                          value={socialValue}
                          onChange={e => setSocialValue(e.target.value)}
                          disabled={!selectedSocial}
                        />
                        <button type="button" className="btn btn-success" onClick={handleAddSocial} disabled={!selectedSocial || !socialValue}>
                          Add
                        </button>
                      </div>
                      {/* List of added social links */}
                      <ul className="list-group">
                        {formData.socialLinks.map((link, idx) => {
                          const opt = socialOptions.find(o => o.value === link.type);
                          return (
                            <li key={idx} className="list-group-item d-flex align-items-center justify-content-between">
                              <span className="d-flex align-items-center">
                                <span style={{ fontSize: 20, marginRight: 8 }}>{opt?.icon}</span>
                                <span className="font-weight-bold mr-2">{opt?.label}:</span>
                                <span>{link.value}</span>
                              </span>
                              <button type="button" className="btn btn-sm btn-danger" onClick={() => handleRemoveSocial(idx)}>
                                Remove
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={`tab-pane fade${activeTab === 'integrations' ? ' show active' : ''}`}>
            {activeTab === 'integrations' && (
              <div>
                <h2 className="mb-2">Integrations</h2>
                <p className="mb-5">This will have third-party platform integration options.</p>
                <div className="right-content">

                  <div className="profile-card d-flex flex-column align-items-center">
                    <div className="mt-5">
                      <h4 className="mb-4">Data Integrations</h4>
                      <div className="row justify-content-start">
                        <div className="col-md-8">
                          <GoogleBusinessProfile
                            organisationId={loggedInUser?.organisation?.id}
                            className="mb-3"
                          />
                        </div>
                      </div>
                    </div>
                    {/* Google Tag Manager */}
                    <div className="form-group w-100 mt-4 d-flex align-items-center">
                      <label htmlFor="gtmTagId" style={{ minWidth: 200 }}>Google Tag Manager</label>
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
                    <div className="form-group w-100 mt-3 d-flex align-items-center">
                      <label htmlFor="ga" style={{ minWidth: 200 }}>Google Analytics</label>
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
                      <span className="badge badge-warning ml-2">Coming Soon</span>
                    </div>
                    {/* Quickbooks */}
                    <div className="form-group w-100 mt-3 d-flex align-items-center">
                      <label htmlFor="quickbooks" style={{ minWidth: 200 }}>Quickbooks</label>
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
                      <span className="badge badge-warning ml-2">Coming Soon</span>
                    </div>
                    {/* Xero */}
                    <div className="form-group w-100 mt-3 d-flex align-items-center">
                      <label htmlFor="xero" style={{ minWidth: 200 }}>Xero</label>
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
                      <span className="badge badge-warning ml-2">Coming Soon</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Organization;
