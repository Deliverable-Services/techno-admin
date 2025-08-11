import React, { useState, useEffect, useCallback } from "react";
import API from "../../utils/API";
import VerifingUserLoader from "../../shared-components/VerifingUserLoader";
import useUserProfileStore from "../../hooks/useUserProfileStore";
import SubscriptionCreateForm from "./SubscriptionCreateForm";
import PageHeading from "../../shared-components/PageHeading";
import { Container, Button } from "../ui/bootstrap-compat";
import { showErrorToast } from "../../utils/showErrorToast";
import { primaryColor } from "../../utils/constants";
import { Plus, CalendarDays, Repeat, CreditCard, RefreshCw, Triangle } from 'lucide-react';
import { Hammer } from "../ui/icon";
import { Play } from 'lucide-react';
import { UserRoundPlus } from 'lucide-react';




interface Subscription {
  id: string;
  customer_name: string;
  plan_name: string;
  status: string;
  amount: string;
  currency: string;
  interval: string;
  next_billing_date: string;
  subscription_number: string;
}

const SubscriptionPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const loggedInUser = useUserProfileStore((state) => state.user);
  const setUser = useUserProfileStore((state) => state.setUser);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isProcessingCode, setIsProcessingCode] = useState(false);

  const handleCreate = () => {
    setShowForm(true);
  };

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/subscriptions");
      setSubscriptions(res.data || []);
    } catch (err) {
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCode = useCallback(
    async (code: string) => {
      setIsProcessingCode(true);
      try {
        const response = await API.post("stripe/callback", { code });

        if (response.status === 200) {
          const currentUser = useUserProfileStore.getState().user;
          setUser({
            ...currentUser,
            stripe_account_id: response.data.stripe_account_id,
          });

          const url = new URL(window.location.href);
          url.searchParams.delete("code");
          window.history.replaceState({}, document.title, url.pathname);
          fetchSubscriptions();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsProcessingCode(false);
      }
    },
    [fetchSubscriptions, setUser]
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      handleCode(code);
    }
  }, [handleCode]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  // Create Stripe account handler
  const handleCreateStripeAccount = async () => {
    try {
      const response = await API.get("/stripe/connect");
      if (response?.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Error creating Stripe account:", error);
      showErrorToast("Failed to create Stripe account. Please try again.");
    }
  };

  const _onCreateClick = () => {
    setShowForm(true);
  };

  if (isProcessingCode) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <VerifingUserLoader />
      </div>
    );
  }

  return (
    <>
      <div className="view-padding">
        <PageHeading
          icon={<UserRoundPlus size={24} />}
          title="Subscriptions"
          description="Raise recurring invoices to your customers with one click"
          onClick={_onCreateClick}
          btnText="Create Subscription"
          permissionReq="create_bookingslot"
        />
      </div>
      <hr />
      {(() => {
        if (!loggedInUser?.stripe_account_id) {
          return (
            <div className="view-padding">
              <div className="d-flex flex-column align-items-center text-center">
                <Hammer size={80} color={primaryColor} className="mb-4" />
                <h3 className="mb-3">Get started with Subscriptions</h3>
                <p className="text-muted mb-4" style={{ maxWidth: "400px" }}>
                  To start using subscriptions you need to create your Stripe
                  account by clicking on Create Stripe button below
                </p>
                <Button
                  variant="primary"
                  onClick={handleCreateStripeAccount}
                  size="lg"
                  className="primary-btn"
                  style={{
                    backgroundColor: primaryColor,
                    borderColor: primaryColor,
                  }}
                >
                  <div className="text-white d-flex align-items-center">
                    <Hammer className="mr-2" />
                    Create Stripe Account
                  </div>
                </Button>
              </div>
            </div>
          );
        }
        if (loading) {
          return (
            <Container
              fluid
              className="d-flex justify-content-center"
              style={{ marginTop: "100px", marginBottom: "100px" }}
            >
              <div className="d-flex flex-column align-items-center text-center">
                <div
                  className="d-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "50%",
                    border: `2px solid ${primaryColor}20`,
                  }}
                >
                  <Hammer size={35} color={primaryColor} />
                </div>
                <h5 className="text-muted mb-2" style={{ fontWeight: "500" }}>
                  Loading subscriptions...
                </h5>
                <div
                  className="spinner-border text-primary"
                  role="status"
                  style={{ color: primaryColor + " !important" }}
                >
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            </Container>
          );
        }

        if (!subscriptions.length) {
          return (
            <Container
              fluid
              className="d-flex justify-content-center"
              style={{ marginTop: "60px", marginBottom: "60px" }}
            >
              <div
                className="d-flex flex-column align-items-center text-center"
                style={{ maxWidth: "500px" }}
              >
                {/* Icon Stack */}
                <div className="position-relative mb-4">
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: "120px",
                      height: "120px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "50%",
                      border: `3px solid ${primaryColor}20`,
                    }}
                  >
                    <Play size={50} color={primaryColor} />
                  </div>
                  <div
                    className="position-absolute d-flex align-items-center justify-content-center"
                    style={{
                      width: "35px",
                      height: "35px",
                      backgroundColor: primaryColor,
                      borderRadius: "50%",
                      bottom: "-5px",
                      right: "-5px",
                      border: "3px solid white",
                    }}
                  >
                    <RefreshCw size={18} color="white" />
                    
                  </div>
                </div>

                {/* Title */}
                <h3
                  className="mb-3"
                  style={{
                    fontWeight: "600",
                    color: "#2c3e50",
                    fontSize: "24px",
                  }}
                >
                  No subscriptions yet
                </h3>

                {/* Description */}
                <p
                  className="text-muted mb-4"
                  style={{
                    fontSize: "16px",
                    lineHeight: "1.6",
                    maxWidth: "400px",
                  }}
                >
                  Create recurring billing plans for your customers. Set up
                  automatic payments and manage subscription lifecycles with
                  ease.
                </p>

                {/* Features List */}
                <div
                  className="d-flex flex-column align-items-start mb-4"
                  style={{ fontSize: "14px" }}
                >
                  <div className="d-flex align-items-center mb-2 text-muted">
                    <CalendarDays size={14} color={primaryColor} className="mr-2" />
                    <span>Automated recurring billing</span>
                    
                  </div>
                  <div className="d-flex align-items-center mb-2 text-muted">
                    <CreditCard size={14} color={primaryColor} className="mr-2" />
                    <span>Flexible pricing plans</span>
                  </div>
                  <div className="d-flex align-items-center mb-2 text-muted">
                    <Repeat size={14} color={primaryColor} className="mr-2" />
                    <span>Easy subscription management</span>
                    
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  variant="primary"
                  onClick={handleCreate}
                  size="lg"
                  className="primary-btn"
                  style={{
                    backgroundColor: primaryColor,
                    borderColor: primaryColor,
                    boxShadow: `0 4px 12px ${primaryColor}25`,
                  }}
                >
                  <div className="text-white d-flex align-items-center">
                    <Plus className="mr-2" size={14} />
                    Create your first subscription
                  </div>
                </Button>

                {/* Secondary action */}
                <div className="mt-3">
                  <small className="text-muted">
                    Need help?{" "}
                    <button
                      className="btn btn-link p-0"
                      style={{
                        color: primaryColor,
                        textDecoration: "none",
                        fontSize: "inherit",
                        fontWeight: "inherit",
                      }}
                      onClick={() => console.log("Open documentation")}
                    >
                      View documentation
                    </button>
                  </small>
                </div>
              </div>
            </Container>
          );
        }

        if (!showForm) {
          return (
            <Container fluid className="h-100 p-0">
              <table className="table-primary">
                <thead>
                  <tr>
                    <th>Subscription Number</th>
                    <th>Customer</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Currency</th>
                    <th>Interval</th>
                    <th>Next Billing</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub) => (
                    <tr key={sub.id}>
                      <td>{sub.subscription_number}</td>
                      <td>{sub.customer_name}</td>
                      <td>{sub.plan_name}</td>
                      <td>
                        <span className="status-badge">{sub.status}</span>
                      </td>
                      <td>${sub.amount}</td>
                      <td>{sub.currency}</td>
                      <td>{sub.interval}</td>
                      <td>{sub.next_billing_date}</td>
                      <td>{/* Add action buttons here if needed */}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Container>
          );
        }

        return (
          <div className="form-container">
            <SubscriptionCreateForm
              onSuccess={() => {
                setShowForm(false);
                fetchSubscriptions();
              }}
            />
          </div>
        );
      })()}
    </>
  );
};

export default SubscriptionPage;
