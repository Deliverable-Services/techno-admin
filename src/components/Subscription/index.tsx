import React, { useState, useEffect } from 'react';
import './subscription.css';
import API from '../../utils/API';
import VerifingUserLoader from '../../shared-components/VerifingUserLoader';
import useUserProfileStore from '../../hooks/useUserProfileStore';
import SubscriptionCreateForm from './SubscriptionCreateForm';
import PageHeading from '../../shared-components/PageHeading';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import { Container } from 'react-bootstrap';
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

const SubscriptionPage: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const setUser = useUserProfileStore((state) => state.setUser);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isProcessingCode, setIsProcessingCode] = useState(false);

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

    if (isProcessingCode) {
        return <div style={{ display: 'flex', justifyContent: 'center' }}> <VerifingUserLoader /> </div>;
    }


    return (
        <Container fluid className=" component-wrapper view-padding">
            <>
                <PageHeading
                    icon={<FaFileInvoiceDollar size={24} />}
                    title="Subscriptions"
                    description='Create and manage subscriptions'
                    onClick={handleCreate}
                    totalRecords={invoices?.length}
                    permissionReq="create_user"
                />
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
                                    <th>Subscription Number</th>
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                ) : (
                    <div className="invoice-form">
                        <SubscriptionCreateForm onSuccess={() => {
                            setShowForm(false);
                            fetchInvoices();
                        }} />
                        <div className="form-actions">
                            <button className="secondary-btn" onClick={() => setShowForm(false)}>Cancel</button>
                        </div>
                    </div>
                )}
            </>
        </Container>
    );
};

export default SubscriptionPage; 