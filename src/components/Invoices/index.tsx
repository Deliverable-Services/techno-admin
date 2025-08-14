import React, { useState, useEffect, useMemo, useCallback } from "react";

import InvoicesCreateForm from "./InvoicesCreateForm";
import API from "../../utils/API";
import VerifingUserLoader from "../../shared-components/VerifingUserLoader";
import useUserProfileStore from "../../hooks/useUserProfileStore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { showMsgToast } from "../../utils/showMsgToast";
import { showErrorToast } from "../../utils/showErrorToast";
import PageHeading from "../../shared-components/PageHeading";
import { Button } from "../ui/bootstrap-compat";
import ReactTable from "../../shared-components/ReactTable";
import { Cell } from "react-table";
import { Hammer } from "../ui/icon";
import { primaryColor } from "../../utils/constants";
import { ReceiptText } from 'lucide-react';


interface Invoice {
  id: string;
  recipient: string;
  price: number;
  status: string;
  subtotal: string;
  currency: string;
  tax: string;
  total: string;
  paid_at: string;
  invoice_number: string;
}

const InvoicePage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const setUser = useUserProfileStore((state) => state.setUser);
  const loggedInUser = useUserProfileStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isProcessingCode, setIsProcessingCode] = useState(false);

  const [downloadingInvoices, setDownloadingInvoices] = useState<{
    [key: string]: boolean;
  }>({});

  const handleCreate = () => {
    setShowForm(true);
  };

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/invoices");
      const sortedData = (res.data || []).sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      setInvoices(sortedData);
    } catch (err) {
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "Invoice Number",
        accessor: "invoice_number", //accessor is the "key" in the data
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Currency",
        accessor: "currency",
      },
      {
        Header: "Total",
        accessor: "total",
      },
      {
        Header: "SubTotal",
        accessor: "subtotal",
      },
      {
        Header: "Actions",
        Cell: (data: Cell) => {
          return (
            <button
              className="bg-gray-100 text-gray-800 border-0 rounded px-4 py-2 font-medium cursor-pointer text-base ml-2"
              onClick={() => downloadInvoicePDF(data?.row?.values as any)}
              disabled={downloadingInvoices[data?.row?.values?.id]}
              style={{
                fontSize: "12px",
                padding: "4px 8px",
                textWrap: "nowrap",
                marginLeft: "-10px",
              }}
            >
              {downloadingInvoices[data?.row?.values?.id]
                ? "Generating..."
                : "Download PDF"}
            </button>
          );
        },
      },
    ],
    [downloadingInvoices]
  );

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
          fetchInvoices();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsProcessingCode(false);
      }
    },
    [fetchInvoices, setUser]
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      handleCode(code);
    }
  }, [handleCode]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // Function to download invoice as PDF
  const downloadInvoicePDF = async (invoice: Invoice) => {
    setDownloadingInvoices((prev) => ({ ...prev, [invoice.id]: true }));
    try {
      const doc = new jsPDF();

      // Header
      doc.setFontSize(24);
      doc.text("INVOICE", 20, 30);

      // Invoice details
      doc.setFontSize(12);
      doc.text(`Invoice Number: ${invoice.invoice_number}`, 20, 50);
      doc.text(`Status: ${invoice.status}`, 20, 60);
      doc.text(`Currency: ${invoice.currency}`, 20, 70);

      // Company logo placeholder
      doc.setFillColor(255, 224, 102);
      doc.rect(150, 20, 40, 40, "F");
      doc.setFontSize(20);
      doc.text("🧾", 165, 45);

      // Bill to section
      doc.setFontSize(14);
      doc.text("Bill To:", 20, 90);
      doc.setFontSize(12);
      doc.text(invoice.recipient || "N/A", 20, 100);

      // Summary table
      autoTable(doc, {
        head: [["Description", "Amount"]],
        body: [
          ["Subtotal", `$${invoice.subtotal}`],
          ["Tax", `$${invoice.tax}`],
          ["Total", `$${invoice.total}`],
        ],
        startY: 120,
        styles: {
          fontSize: 10,
          cellPadding: 5,
        },
        headStyles: {
          fillColor: [66, 66, 66],
          textColor: 255,
          fontStyle: "bold",
        },
      });

      // Payment info
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      if (invoice.paid_at) {
        doc.setFontSize(12);
        doc.text(`Paid At: ${invoice.paid_at}`, 20, finalY);
      }

      // Download the PDF
      doc.save(`invoice-${invoice.invoice_number}.pdf`);
      showMsgToast("Invoice PDF downloaded successfully");
    } catch (error) {
      showErrorToast("Failed to generate PDF");
      console.error("PDF generation error:", error);
    } finally {
      setDownloadingInvoices((prev) => ({ ...prev, [invoice.id]: false }));
    }
  };

  if (isProcessingCode) {
    return (
      <div className="flex justify-center">
        <VerifingUserLoader />
      </div>
    );
  }

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

  return (
    <>
      <div className="view-padding">
        <PageHeading
          icon={<ReceiptText size={24} />}
          title="Invoices"
          description="Raise invoices to your customers with one click"
          onClick={!showForm ? _onCreateClick : undefined}
          btnText="Create Invoice"
          permissionReq="create_bookingslot"
        />
      </div>
      <hr />
      {(() => {
        if (showForm) {
          return (
            <div>
              <InvoicesCreateForm
                onSuccess={() => {
                  setShowForm(false);
                  fetchInvoices();
                }}
              />
            </div>
          )
        }
        if (!loggedInUser?.stripe_account_id) {
          return (
            <div className="view-padding">
              <div className="flex flex-col items-center text-center">
                <Hammer size={80} color={primaryColor} className="mb-4" />
                <h3 className="mb-3">Get started with Billings</h3>
                <p className="text-muted mb-4 max-w-[400px]">
                  To start using billing you need to create your Stripe account
                  by clicking on Create Stripe button below
                </p>
                <Button
                  variant="primary"
                  onClick={handleCreateStripeAccount}
                  size="lg"
                  className="bg-gray-800 text-white border-0 rounded px-4 py-2 font-medium cursor-pointer text-base transition-colors hover:bg-gray-600"
                  style={{
                    backgroundColor: primaryColor,
                    borderColor: primaryColor,
                    padding: "12px 30px",
                    fontSize: "16px",
                    fontWeight: "600",
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
            <div className="text-center my-20">
              <p>Loading...</p>
            </div>
          );
        }

        if (!invoices.length) {
          return (
            <div className="text-center my-20">
              <h4 className="text-xl mb-0">Send your first invoice</h4>
              <p className="text-xl text-gray-500 mb-4">
                This is where you can see invoice and their associated status
              </p>
              <Button
                onClick={handleCreate}
              >
                + Create invoice
              </Button>
            </div>
          );
        }

        if (!showForm) {
          return (
            <div className="card">
              <ReactTable
                data={invoices}
                columns={columns}
                showSearch={false}
                showRecords={false}
                isSelectable={false}
                filter={{
                  role: "customer",
                  q: "",
                  page: null,
                  perPage: 25,
                  disabled: "",
                }}
                deletePermissionReq="delete_user"
              />
            </div>
          );
        }
      })()}
    </>
  );
};

export default InvoicePage;
