import React, { useState, useEffect } from 'react';
import './invoice.css';
import InvoicesCreateForm from "./InvoicesCreateForm";
import API from '../../utils/API';
import StripeContent from './StripeContent';
import VerifingUserLoader from '../../shared-components/VerifingUserLoader';
import useUserProfileStore from '../../hooks/useUserProfileStore';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { showMsgToast } from '../../utils/showMsgToast';
import { showErrorToast } from '../../utils/showErrorToast';

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
    const [downloadingInvoices, setDownloadingInvoices] = useState<{ [key: string]: boolean }>({});

    const handleCreate = () => {
        setShowForm(true);
    };

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const res = await API.get('/invoices');
            setInvoices(res.data || []);
        } catch (err) {
            setInvoices([]);
        } finally {
            setLoading(false);
        }
    }

    const handleCode = async (code: string) => {
        setIsProcessingCode(true);
        try {
            const response = await API.post('stripe/callback', { code });

            if (response.status === 200) {
                const currentUser = useUserProfileStore.getState().user;
                setUser({
                    ...currentUser,
                    stripe_account_id: response.data.stripe_account_id
                });

                const url = new URL(window.location.href);
                url.searchParams.delete('code');
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
        const code = urlParams.get('code');
        if (code) {
            handleCode(code);
        }
    }, []);

    useEffect(() => {
        fetchInvoices();
    }, []);

    // Function to download invoice as PDF
    const downloadInvoicePDF = async (invoice: Invoice) => {
        setDownloadingInvoices(prev => ({ ...prev, [invoice.id]: true }));
        try {
            const doc = new jsPDF();

            // Header
            doc.setFontSize(24);
            doc.text('INVOICE', 20, 30);

            // Invoice details
            doc.setFontSize(12);
            doc.text(`Invoice Number: ${invoice.invoice_number}`, 20, 50);
            doc.text(`Status: ${invoice.status}`, 20, 60);
            doc.text(`Currency: ${invoice.currency}`, 20, 70);

            // Company logo placeholder
            doc.setFillColor(255, 224, 102);
            doc.rect(150, 20, 40, 40, 'F');
            doc.setFontSize(20);
            doc.text('🧾', 165, 45);

            // Bill to section
            doc.setFontSize(14);
            doc.text('Bill To:', 20, 90);
            doc.setFontSize(12);
            doc.text(invoice.recipient || 'N/A', 20, 100);

            // Summary table
            autoTable(doc, {
                head: [['Description', 'Amount']],
                body: [
                    ['Subtotal', `$${invoice.subtotal}`],
                    ['Tax', `$${invoice.tax}`],
                    ['Total', `$${invoice.total}`],
                ],
                startY: 120,
                styles: {
                    fontSize: 10,
                    cellPadding: 5,
                },
                headStyles: {
                    fillColor: [66, 66, 66],
                    textColor: 255,
                    fontStyle: 'bold',
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
            console.error('PDF generation error:', error);
        } finally {
            setDownloadingInvoices(prev => ({ ...prev, [invoice.id]: false }));
        }
    };

    if (isProcessingCode) {
        return <div style={{ display: 'flex', justifyContent: 'center' }}> <VerifingUserLoader /> </div>;
    }

    // Only show invoice UI if Stripe account is connected
    if (!loggedInUser?.stripe_account_id) {
        return (
            <div style={{ marginTop: '30px' }}>
                <StripeContent />
            </div>
        );
    }

    return (
        <div className="invoice-container">
            <>
                {invoices.length > 0 && !showForm && <div className="invoice-header">
                    <h2>Invoices</h2>
                    {!showForm &&
                        <button className="primary-btn" onClick={handleCreate}>+ Create Invoice</button>}
                </div>
                }
                {!showForm ? (
                    loading ? (
                        <div className="invoice-empty"><p>Loading...</p></div>
                    ) : invoices.length === 0 ? (
                        <div className="invoice-empty">
                            <h4>Send your first invoice</h4>
                            <p>This is where you can see invoice and their associated status</p>
                            <button className="primary-btn" onClick={handleCreate}>+ Create invoice</button>
                        </div>
                    ) : (
                        <table className="invoice-table">
                            <thead>
                                <tr>
                                    <th>Invoice Number</th>
                                    <th>Status</th>
                                    <th>Currency</th>
                                    <th>Total</th>
                                    <th>Subtotal</th>
                                    <th>Tax</th>
                                    <th>Paid At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((inv) => (
                                    <tr key={inv.id}>
                                        <td>{inv.invoice_number}</td>
                                        <td><span className="status-open">{inv.status}</span></td>
                                        <td>{inv.currency}</td>
                                        <td>${inv.total}</td>
                                        <td>${inv.subtotal}</td>
                                        <td>{inv.tax}</td>
                                        <td>{inv.paid_at}</td>
                                        <td>
                                            <button
                                                className="secondary-btn"
                                                onClick={() => downloadInvoicePDF(inv)}
                                                disabled={downloadingInvoices[inv.id]}
                                                style={{ fontSize: '12px', padding: '4px 8px' }}
                                            >
                                                {downloadingInvoices[inv.id] ? "Generating..." : "Download PDF"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                ) : (
                    <div className="invoice-form">
                        <InvoicesCreateForm onSuccess={() => {
                            setShowForm(false);
                            fetchInvoices();
                        }} />
                        <div className="form-actions">
                            <button className="secondary-btn" onClick={() => setShowForm(false)}>Cancel</button>
                        </div>
                    </div>
                )}
            </>
        </div>
    );
};

export default InvoicePage; 