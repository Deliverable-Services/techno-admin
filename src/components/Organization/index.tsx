// components/Organization.tsx

import React, { useState } from "react";
import "./organization.css"; // Optional custom styles

const Organization: React.FC = () => {
  const [selectedOrg, setSelectedOrg] = useState<"crm" | "ecommerce">("crm"); // Default is CRM

  const handleSelect = (org: "crm" | "ecommerce") => {
    setSelectedOrg(org);
    console.log("Selected:", org);
    // Add logic to save selection or navigate
  };

  return (
    <div className="container mt-5 organization-main">
      <h2 className="text-center mb-5">Choose Your Organization</h2>
      <div className="row justify-content-center mt-5">
        {/* CRM */}
        <div className="col-md-5">
          <div
            className={`card mb-4 shadow ${
              selectedOrg === "crm" ? "border-primary selected" : ""
            }`}
            onClick={() => handleSelect("crm")}
            style={{ cursor: "pointer" }}
          >
            <img
              src="https://miro.medium.com/v2/resize:fit:1400/1*TR-8mgpp0_X5P0ZbB6XYfQ.jpeg" // Your image path
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
        <div className="col-md-5">
          <div
            className={`card mb-4 shadow ${
              selectedOrg === "ecommerce" ? "border-success selected" : ""
            }`}
            onClick={() => handleSelect("ecommerce")}
            style={{ cursor: "pointer" }}
          >
            <img
              src="https://s3.envato.com/files/101016168/2a.UCM-CRM-dashboard-desktop.png" // Your image path
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
     <div className="text-right mt-3">
     <button className="btn btn-primary cursor-pointer organize-switch">Save</button>
     </div>
    </div>
  );
};

export default Organization;
