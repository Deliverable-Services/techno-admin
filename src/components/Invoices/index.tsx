import React, { useState, useEffect } from 'react';
import './invoice.css';
import InvoicesCreateForm from "./InvoicesCreateForm";
import API from '../../utils/API';
import StripeContent from './StripeContent';
import VerifingUserLoader from '../../shared-components/VerifingUserLoader';
import useUserProfileStore from '../../hooks/useUserProfileStore';

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

    console.log("Invoices fetched:", loggedInUser?.stripe_account_id);

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
                                    <th>Invoice number</th>
                                    <th>Currency</th>
                                    <th>Total</th>
                                    <th>Subtotal</th>
                                    <th>Tax</th>
                                    <th>Paid At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((inv) => (
                                    <tr key={inv.id}>
                                        <td>{inv.invoice_number}</td>
                                        <td><span className="status-open">{inv.status}</span></td>
                                        <td>{inv.id}</td>
                                        <td>{inv.currency}</td>
                                        <td>${inv.total}</td>
                                        <td>${inv.subtotal}</td>
                                        <td>{inv.tax}</td>
                                        <td>{inv.paid_at}</td>
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