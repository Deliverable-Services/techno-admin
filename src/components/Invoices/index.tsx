import React, { useState, useEffect, useMemo } from "react";
import "./invoice.css";
import InvoicesCreateForm from "./InvoicesCreateForm";
import API from "../../utils/API";
import StripeContent from "./StripeContent";
import VerifingUserLoader from "../../shared-components/VerifingUserLoader";
import useUserProfileStore from "../../hooks/useUserProfileStore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { showMsgToast } from "../../utils/showMsgToast";
import { showErrorToast } from "../../utils/showErrorToast";
import PageHeading from "../../shared-components/PageHeading";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { Container } from "react-bootstrap";
import ReactTable from "../../shared-components/ReactTable";
import { Cell } from "react-table";

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
  const [selectedRows, setSelectedRows] = useState([]);
  const [downloadingInvoices, setDownloadingInvoices] = useState<{
    [key: string]: boolean;
  }>({});

  const handleCreate = () => {
    setShowForm(true);
  };

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await API.get("/invoices");
      setInvoices(res.data || []);
    } catch (err) {
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

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
              className="secondary-btn"
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
    []
  );

  const handleCode = async (code: string) => {
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
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      handleCode(code);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, []);

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
      <div style={{ display: "flex", justifyContent: "center" }}>
        {" "}
        <VerifingUserLoader />{" "}
      </div>
    );
  }

  // Only show invoice UI if Stripe account is connected
  if (!loggedInUser?.stripe_account_id) {
    return (
      <div style={{ marginTop: "30px" }}>
        <StripeContent />
      </div>
    );
  }

  return (
    <Container fluid className=" component-wrapper view-padding">
      <>
        <PageHeading
          icon={<FaFileInvoiceDollar />}
          title="Invoices"
          onClick={handleCreate}
          totalRecords={invoices?.length}
          permissionReq="create_user"
        />
        {!showForm ? (
          loading ? (
            <div className="invoice-empty">
              <p>Loading...</p>
            </div>
          ) : invoices.length === 0 ? (
            <div className="invoice-empty">
              <h4>Send your first invoice</h4>
              <p>
                This is where you can see invoice and their associated status
              </p>
              <button className="primary-btn" onClick={handleCreate}>
                + Create invoice
              </button>
            </div>
          ) : (
            <div className="card">
              <Container fluid className="h-100 p-0 ">
                <div className="mt-3" />
                <ReactTable
                  data={invoices}
                  columns={columns}
                  showSearch={false}
                  setSelectedRows={setSelectedRows}
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
          )
        ) : (
          <div className="invoice-form">
            <InvoicesCreateForm
              onSuccess={() => {
                setShowForm(false);
                fetchInvoices();
              }}
            />
            <div className="form-actions">
              <button
                className="secondary-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </>
    </Container>
  );
};

export default InvoicePage;
