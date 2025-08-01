import React from "react";

const WebsiteTab = ({ formData, handleInputChange }) => (
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
);

export default WebsiteTab;