import React, { useState, useEffect } from 'react';
import './invoice.css';
import InvoicesCreateForm from "./InvoicesCreateForm";
import API from '../../utils/API';

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
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

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

    useEffect(() => {
        fetchInvoices();
    }, []);


    return (
        <div className="invoice-container">
            {invoices.length > 0 && !showForm && <div className="invoice-header">
                <h2>Invoices</h2>
                {!showForm &&
                    <button className="primary-btn" onClick={handleCreate}>+ Create Invoice</button>}
            </div>}
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
        </div>
    );
};

export default InvoicePage; 