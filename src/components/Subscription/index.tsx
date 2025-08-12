import React, { useState, useEffect, useCallback, useMemo } from "react";
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




import ReactTable from "../../shared-components/ReactTable";
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
      const sortedData = (res.data?.data?.data || []).sort((a: any, b: any) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      // Map API data into table-friendly format
      const formatted = sortedData.map((item: any) => ({
        id: item.id,
        customer: `${item.user?.name || ""} (${item.user?.email || ""})`,
        plan_name: item.name,
        status: item.status,
        amount: item.billing_cycle_amount,
        currency: item.billing_cycle_currency,
        interval: item.billing_cycle,
        // next_billing_date: item.next_billing_date,
      }));

      setSubscriptions(formatted);
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


  const columns = useMemo(
    () => [
      {
        Header: "Customer",
        accessor: "customer", // name + email in one cell
      },
      {
        Header: "Plan Name",
        accessor: "plan_name",
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Amount",
        accessor: "amount",
      },
      {
        Header: "Currency",
        accessor: "currency",
      },
      {
        Header: "Interval",
        accessor: "interval",
      },
      // {
      //   Header: "Next Billing Date",
      //   accessor: "next_billing_date",
      // },
    ],
    []
  );


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
        if (showForm) {
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
        }
        if (!loggedInUser?.stripe_account_id) {
          return (
            <div className="view-padding">
              <div className="flex flex-col items-center text-center">
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
                  <div className="text-white flex items-center">
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
              className="flex justify-center"
              style={{ marginTop: "100px", marginBottom: "100px" }}
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className={`flex items-center justify-center mb-3 w-20 h-20 bg-[#f8f9fa] rounded-full border-2 border-[${primaryColor}20]`}
                >
                  <Hammer size={35} color={primaryColor} />
                </div>
                <h5 className="text-muted mb-2 font-medium">
                  Loading subscriptions...
                </h5>
                <div
                  className="spinner-border !text-[#0B64FE]"
                  role="status"
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
              className="flex justify-center my-[60px]"
            >
              <div
                className="flex flex-col items-center text-center max-w-[500px]"
              >
                {/* Icon Stack */}
                <div className="relative mb-4">
                  <div
                    className={`flex items-center justify-center w-[120px] h-[120px] bg-[#f8f9fa] rounded-[50%] border-2 border-[${primaryColor}20]`}
                  >
                    <Play size={50} color={primaryColor} />
                  </div>
                  <div
                    className="absolute flex items-center justify-center w-[35px] h-[35px] rounded-full -bottom-[5px] -right-[5px] border-[3px] border-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <RefreshCw size={18} color="white" />

                  </div>
                </div>

                {/* Title */}
                <h3
                  className="mb-3 text-[#2c3e50] font-semibold text-2xl"
                >
                  No subscriptions yet
                </h3>

                {/* Description */}
                <p
                  className="text-muted mb-4 text-base max-w-[400px]"
                >
                  Create recurring billing plans for your customers. Set up
                  automatic payments and manage subscription lifecycles with
                  ease.
                </p>

                {/* Features List */}
                <div
                  className="flex flex-col items-start mb-4 text-sm"
                >
                  <div className="flex items-center mb-2 text-muted">
                    <Hammer size={14} color={primaryColor} className="mr-2" />
                    <span>Automated recurring billing</span>

                  </div>
                  <div className="flex items-center mb-2 text-muted">
                    <Hammer size={14} color={primaryColor} className="mr-2" />
                    <span>Flexible pricing plans</span>
                  </div>
                  <div className="flex items-center mb-2 text-muted">
                    <Hammer size={14} color={primaryColor} className="mr-2" />
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
                      className="btn btn-link p-0 no-underline text-inherit font-inherit"
                      style={{ color: primaryColor }}
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
            <div className="card">
              <Container fluid className="h-100 p-0 ">
                <div className="mt-3" />
                <ReactTable
                  data={subscriptions}
                  columns={columns}
                  showSearch={false}
                  showRecords={false}
                  filter={{
                    role: "customer",
                    q: "",
                    page: null,
                    perPage: 25,
                    disabled: "",
                  }}
                  deletePermissionReq="delete_user"
                />
              </Container>
            </div>
          );
        }

      })()}
    </>
  );
};

export default SubscriptionPage;
