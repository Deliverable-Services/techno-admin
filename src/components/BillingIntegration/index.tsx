import React from "react";

interface IBillingTypes {
  title?: string;
  buttonText?: string;
  buttonLink?: string;
  icon?: string;
  description?: string;
}

const BillingIntegration = ({
  icon = "/assets/billing.png",
  title = "Easily create invoices, subscriptions for each of your customers",
  description = "Click on the below button to create your Stripe connect account which will let you raise invoices, or subscription to receive payments with ease.",
  buttonText = "Get Started",
  buttonLink = "/",
}: IBillingTypes) => {
  return (
    <div className="container text-center py-5">
      <div className="d-flex flex-column align-items-center justify-content-center border rounded p-5 shadow-sm bg-white rounded-border">
        {/* Billing logo from public/assets */}
        <img
          src={icon}
          alt="Billing Logo"
          style={{ width: 100, height: 100 }}
          className="mb-4"
        />

        {/* Title */}
        <h4 className="font-weight-bold mb-3">{title}</h4>

        {/* Description */}
        <p className="text-muted mb-4" style={{ maxWidth: 600 }}>
          {description}
        </p>

        {/* Get Started button */}
        <a href={buttonLink}>
          <button className="btn btn-primary px-4 py-2">{buttonText}</button>
        </a>
      </div>
    </div>
  );
};

export default BillingIntegration;
