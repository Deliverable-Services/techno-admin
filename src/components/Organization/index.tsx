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
import { Card, Button, Row, Col } from "react-bootstrap";



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
    fname: '',
    lname: '',
    email: '',
    phone: '',
    // Organization
    organizationName: '',
    organizationEmail: '',
    organizationSlug: '',
    storeType: storeType, // 'crm' or 'ecommerce'
    // Appearance
    primary: '#007bff',
    secondary: '#6c757d',
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
    { value: 'facebook', label: 'Facebook', icon: <img src="/assets/facebook.png" alt="fb" /> },
    { value: 'twitter', label: 'Twitter', icon: <img src="/assets/twitter.png" alt="tw" />  },
    { value: 'instagram', label: 'Instagram', icon: <img src="/assets/instagram.png" alt="insta" />  },
    { value: 'linkedin', label: 'LinkedIn', icon: <img src="/assets/linkedin.png" alt="li" />  },
    { value: 'youtube', label: 'YouTube', icon: <img src="/assets/youtube.png" alt="yt" /> },
    { value: 'website', label: 'Website', icon: <img src="/assets/website.png" alt="web" />  },
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
        <div className="d-flex justify-content-between">
          <h2 className="main-head">Organization Settings</h2>
          <input style={{ width: "300px" }}
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
          <button className="btn btn-primary btn-fixed-bottom-right" onClick={handleSave} disabled={isLoading}>
            {isLoading ? <IsLoading /> : 'Save'}
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          <div className={`tab-pane fade${activeTab === 'profile' ? ' show active' : ''}`}>
            {activeTab === 'profile' && (
              <div className="mt-5">
                <div>
                  <div className="tab-header">
                    <h4>Personal Info</h4>
                    <p>Update your photo and personal details here.</p>
                  </div>
                  <div className="right-content">
                    <div className="profile-card d-flex flex-column align-items-center">


                      <div className="border-div form-group w-100 mt-4 d-flex align-items-center">
                        <label htmlFor="fname">Name</label>
                        <div className="input-div w-100 d-flex align-items-center gap-3">
                          <input
                            type="text"
                            className="form-control"
                            id="fname"
                            name="fname"
                            value={formData.fname}
                            onChange={handleInputChange}
                            placeholder="First Name"
                          />
                          <input
                            type="text"
                            className="form-control"
                            id="lname"
                            name="lname"
                            value={formData.lname}
                            onChange={handleInputChange}
                            placeholder="Last Name"
                          />
                        </div>
                      </div>
                      <div className="border-div form-group w-100 mt-3 d-flex align-items-center">
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          className="form-control input-div"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="border-div form-group w-100 mt-3 d-flex align-items-center">
                        <label htmlFor="phone">Phone</label>
                        <input
                          type="text"
                          className="form-control input-div"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div className="update-profile-pic mt-3 form-group w-100 mt-3 d-flex align-items-start">
                        <label>
                          Your photo
                        </label>
                        <div className="d-flex gap-3">
                          <img
                            src={formData.profileImage || profile}
                            alt="Profile"
                            style={{ borderRadius: "50%", objectFit: "cover", width: 64, height: 64 }}
                          />
                          <div className="position-relative upload-container">
                            <input
                              accept="image/*"
                              className={"d-none"}
                              id="contained-button-file"
                              type="file"
                              onChange={handleImageChange}
                            />
                            <label htmlFor="contained-button-file">
                              <div className="text-center px-2 py-1" style={{ cursor: 'pointer' }}>

                                <p className="mb-0">Click to upload or drag and drop
                                  <br />
                                  SVG, PNG, JPG or GIF (max. 800x400px)
                                </p>
                              </div>
                            </label>
                          </div>
                        </div>

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
                <div className="tab-header">
                  <h4>Choose Your Organization</h4>
                  <p></p>
                </div>
                <div>
                  <div className="right-content">
                    <div className="profile-card d-flex flex-column align-items-center">
                      <div className="border-div form-group w-100 mt-4 d-flex align-items-center">
                        <label htmlFor="organizationName">Organisation Name</label>
                        <input
                          type="text"
                          className="form-control input-div"
                          id="organizationName"
                          name="organizationName"
                          value={formData.organizationName}
                          onChange={handleInputChange}
                          placeholder="Enter organisation name "
                        />
                      </div>
                      <div className="border-div form-group w-100 mt-3 d-flex align-items-center">
                        <label htmlFor="organizationEmail">Organisation Email</label>
                        <input
                          type="email"
                          className="form-control input-div"
                          id="organizationEmail"
                          name="organizationEmail"
                          value={formData.organizationEmail}
                          onChange={handleInputChange}
                          placeholder="Enter organisation email"
                        />
                      </div>
                      <div className="border-div form-group w-100 mt-3 d-flex align-items-center">
                        <label htmlFor="organizationSlug">Organisation Slug</label>
                        <input
                          type="text"
                          className="form-control input-div"
                          id="organizationSlug"
                          name="organizationSlug"
                          value={formData.organizationSlug}
                          onChange={handleInputChange}
                          placeholder="Enter organisation slug"
                        />
                      </div>
                      <div className="border-div form-group w-100 mt-3 d-flex">
                        <label htmlFor="organizationSlug">Organisation Preference</label>
                        <div className="row" style={{ gap: '30px' }}>
                          {/* CRM */}
                          <div className="position-relative" style={{ width: '250px' }}>
                            <div
                              className={`card mb-4 ${selectedOrg === "crm" ? "border-crm selected" : ""}`}
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
                              {selectedOrg === "crm" &&
                                <div className="active-dot">
                                </div>
                              }
                            </div>
                            <div className="position-relative">
                              <h5 className="card-title text-primary" style={{ fontSize: '16px' }}>CRM </h5>
                              <p style={{ fontSize: '14px' }}>Manage leads, sales, and customer relationships.</p>
                            </div>
                          </div>
                          {/* Ecommerce */}
                          <div className="position-relative" style={{ width: '250px' }}>
                            <div
                              className={`card mb-4 shadow ${selectedOrg === "ecommerce" ? "border-crm selected" : ""}`}
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
                              {selectedOrg === "ecommerce" &&
                                <div className="active-dot">
                                </div>
                              }
                            </div>
                            <div className="text-left">
                              <h5 className="card-title" style={{ fontSize: '16px' }}>Ecommerce </h5>
                              <p style={{ fontSize: '14px' }}>Control your online store, products, and orders.</p>
                            </div>
                          </div>
                        </div>
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
                <div className="tab-header">
                  <h4>Appearance</h4>
                  <p>Used to manage the organisation’s branding and color scheme.</p>
                </div>
                <div className="right-content">
                  <div className="profile-card d-flex flex-column align-items-center">
                    <div className="border-div form-group w-100 mt-4 d-flex align-items-center">
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
                      <span className="ms-3 input-color">{formData.primary}</span>
                    </div>
                    <div className="border-div form-group w-100 mt-3 d-flex align-items-center">
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
                      <span className="ms-3 input-color">{formData.secondary}</span>
                    </div>
                    <div className="border-div form-group w-100 mt-3 d-flex align-items-center">
                      <label htmlFor="language">Preferences Language</label>
                      <select className="form-control input-div" id="language" name="language" value={formData.language} onChange={handleInputChange}>
                        <option value="">Select Language</option>
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="Turkey">Turkey</option>
                      </select>
                    </div>
                    <div className="border-div form-group w-100 mt-3 d-flex align-items-center">
                      <label htmlFor="currency">Preferences Currency</label>
                      <select className="form-control input-div" id="currency" name="currency" value={formData.currency} onChange={handleInputChange}>
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
                <div className="tab-header">
                  <h4>Contact Details</h4>
                  <p>Update your website contact details here.</p>
                </div>

                <div>
                  <div className="right-content">
                    <div className="profile-card d-flex flex-column align-items-center">
                      <div className="border-div form-group w-100 mt-4 d-flex align-items-center">
                        <label htmlFor="cemail">Contact Email</label>
                        <input
                          type="email"
                          className="form-control input-div"
                          id="cemail"
                          name="cemail"
                          value={formData.cemail}
                          onChange={handleInputChange}
                          placeholder="Enter contact email"
                        />
                      </div>
                      <div className="border-div form-group w-100 mt-3 d-flex align-items-center">
                        <label htmlFor="cphone">Contact Phone</label>
                        <input
                          type="phone"
                          className="form-control input-div"
                          id="cphone"
                          name="cphone"
                          value={formData.cphone}
                          onChange={handleInputChange}
                          placeholder="Enter contact phone"
                        />
                      </div>
                      <div className="border-div form-group w-100 mt-3 d-flex align-items-center">
                        <label htmlFor="caddress">Contact Address</label>
                        <input
                          type="text"
                          className="form-control input-div"
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
                <div className="tab-header">
                  <h4>Platform Configurations</h4>
                  <p>Used for setting global business rules or platform logic.</p>
                </div>
                <div className="right-content">
                  <div className="profile-card d-flex flex-column align-items-center">
                    <div className="border-div form-group w-100 mt-4 d-flex align-items-center">
                      <label htmlFor="minOrderCart">Minimum Order Cart</label>
                      <input
                        type="number"
                        className="form-control input-div"
                        id="minOrderCart"
                        name="minOrderCart"
                        value={formData.minOrderCart}
                        onChange={handleInputChange}
                        placeholder="Enter minimum order cart value"
                      />
                    </div>
                    <div className="border-div form-group w-100 mt-3 d-flex align-items-center">
                      <label htmlFor="copyrightMsg">Copyright Message</label>
                      <input
                        type="text"
                        className="form-control input-div"
                        id="copyrightMsg"
                        name="copyrightMsg"
                        value={formData.copyrightMsg}
                        onChange={handleInputChange}
                        placeholder="Enter copyright message"
                      />
                    </div>
                    <div className="form-group w-100 mt-3">
                      <div className="d-flex">
                        <label>Social Media Links</label>
                        <div className="d-flex align-items-center justify-end mb-4">
                          <select
                            className="form-control mr-2 form-custom"
                            style={{ maxWidth: 'fit-content' }}
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
                          <button type="button" className="btn btn-primary" onClick={handleAddSocial} disabled={!selectedSocial || !socialValue}>
                            Add
                          </button>
                        </div>
                      </div>
                      <Row className="g-3 social-cards px-2">
                        {formData.socialLinks.map((link, idx) => {
                          const opt = socialOptions.find(o => o.value === link.type);
                          return (
                            <Col key={idx} xs={12} sm={6} md={4} lg={3} className="p-2">
                              <Card className="position-relative mb-3 shadow-sm border-0">
                                {/* Cross remove button */}
                                <button
                                  type="button"
                                  className="close position-absolute"
                                  style={{ top: '10px', right: '10px', zIndex: 1 }}
                                  onClick={() => handleRemoveSocial(idx)}
                                >
                                  <span aria-hidden="true">&times;</span>
                                </button>

                                <Card.Body className="d-flex align-items-center">
                                  <div className="d-flex align-items-top">
                                    <span className="d-flex icon-social-media" style={{ fontSize: 30, marginRight: 10 }}>{opt?.icon}</span>
                                    <div>
                                      <div className="font-weight-bold ">{opt?.label}</div>
                                      <div className="text-muted small" style={{ wordBreak: 'break-word' }}>{link.value}</div>
                                    </div>
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                          );
                        })}
                      </Row>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={`tab-pane fade${activeTab === 'integrations' ? ' show active' : ''}`}>
            {activeTab === 'integrations' && (
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
                        <div className="col-md-8">
                          <GoogleBusinessProfile
                            organisationId={loggedInUser?.organisation?.id}
                            className="mb-3"
                          />
                        </div>
                      </div>
                    </div>
                    {/* Google Tag Manager */}
                    <div className="form-group w-100 mt-4 d-flex align-items-center border-bottom pb-4 ">
                      <label htmlFor="gtmTagId" style={{ minWidth: 200 }} className="title-style">Google Tag Manager</label>
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
                      <label htmlFor="ga" style={{ minWidth: 200 }} className="title-style">Google Analytics</label>
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
                      <label htmlFor="quickbooks" style={{ minWidth: 200 }} className="title-style">Quickbooks</label>
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
                      <label htmlFor="xero" style={{ minWidth: 200 }} className="title-style">Xero</label>
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Organization;
