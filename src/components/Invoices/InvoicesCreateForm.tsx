import { Formik, Form, Field, FieldArray } from "formik";
import { Button } from "react-bootstrap";
import API from "../../utils/API";
import { showMsgToast } from "../../utils/showMsgToast";
import { showErrorToast } from "../../utils/showErrorToast";
import { useState } from "react";
import AsyncSelect from "react-select/async";

const initialValues = {
    user_id: "",
    invoice_number: "",
    invoice_date: "",
    description: "",
    due_date: "",
    status: "sent",
    subtotal: "",
    tax: "",
    total: "",
    items: [
        { item_name: "", quantity: 1, unit_price: "", total: "" },
    ],
};

const InvoicesCreateForm = ({ onSuccess }: { onSuccess?: () => void }) => {
    const [selectedUser, setSelectedUser] = useState<{ label: string; value: string } | null>(null);
    const generateInvoiceNumber = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    // Async load options for user search
    const loadUserOptions = async (inputValue: string) => {
        if (!inputValue) return [];
        try {
            const res = await API.get("/users", { params: { q: inputValue, perPage: 10 } });
            return (res.data?.data || []).map((user: any) => ({ label: user.name + (user.email ? ` (${user.email})` : ""), value: user.id }));
        } catch {
            return [];
        }
    };

    return (
        <>
            <h2 style={{ marginBottom: '20px' }}>Recipient</h2>
            <Formik
                initialValues={initialValues}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                    try {
                        const items = values.items.map((item) => ({
                            ...item,
                            total: Number(item.quantity) * Number(item.unit_price),
                        }));
                        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
                        const total = subtotal + (values.tax ? Number(values.tax) : 0);
                        const today = new Date();
                        const dd = String(today.getDate()).padStart(2, '0');
                        const mm = String(today.getMonth() + 1).padStart(2, '0');
                        const yyyy = today.getFullYear();
                        const invoice_date = `${dd}-${mm}-${yyyy}`;
                        const invoice_number = generateInvoiceNumber();
                        const payload = {
                            ...values,
                            user_id: selectedUser?.value || "",
                            items,
                            subtotal: subtotal.toString(),
                            total: total.toString(),
                            invoice_date,
                            invoice_number,
                            due_date: values.due_date ? values.due_date : null,
                            tax: values.tax ? values.tax : null,
                        };
                        await API.post("/invoices", payload, {
                            headers: { "Content-Type": "application/json" },
                        });
                        showMsgToast("Invoice created successfully");
                        resetForm();
                        setSelectedUser(null);
                        if (onSuccess) onSuccess();
                    } catch (err: any) {
                        showErrorToast(err?.message || "Failed to create invoice");
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({ values, isSubmitting }) => (
                    <Form>
                        <div className="form-group">
                            <AsyncSelect
                                cacheOptions
                                loadOptions={loadUserOptions}
                                defaultOptions
                                value={selectedUser}
                                onChange={setSelectedUser}
                                placeholder="Search user by name or email..."
                                isClearable
                            />
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <Field as="select" name="status" className="form-control">
                                <option value="sent">Sent</option>
                                <option value="draft">Draft</option>
                                <option value="paid">Paid</option>
                                <option value="overdue">Overdue</option>
                            </Field>
                        </div>

                        <FieldArray name="items">
                            {({ push, remove }) => (
                                <div>
                                    <label>Items</label>
                                    {values.items.map((item, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                borderBottom: values.items.length !== 1 ? '1px solid #e7eaf3' : 'none',
                                                paddingBottom: '6px',
                                                paddingTop: '10px'
                                            }}
                                        >
                                            <Field name={`items[${idx}].item_name`} className="form-control" placeholder="Item Name" />
                                            <div style={{ display: 'flex', gap: 8, marginBottom: 8, marginTop: 12 }}>
                                                <Field name={`items[${idx}].quantity`} className="form-control" placeholder="Qty" type="number" />
                                                <Field name={`items[${idx}].unit_price`} className="form-control" placeholder="Unit Price" type="number" />
                                                <Button variant="danger" onClick={() => remove(idx)} disabled={values.items.length === 1}>-</Button>
                                            </div>
                                        </div>
                                    ))}
                                    <Button className="primary-btn" style={{ marginBottom: '15px', marginTop: '10px', background: 'black !important' }} onClick={() => push({ item_name: "", quantity: 1, unit_price: "", total: "" })}>
                                        + Add Item
                                    </Button>
                                </div>
                            )}
                        </FieldArray>
                        <div className="form-group" style={{ width: '30%' }}>
                            <label>Tax %</label>
                            <Field name="tax" className="form-control" />
                        </div>

                        <div style={{ border: '1px solid #e7eaf3', borderRadius: '10px', padding: '10px', marginBottom: '10px' }}>
                            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                                <label style={{ color: "gray", marginBottom: '0' }}>Subtotal</label>
                                {values.items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unit_price)), 0)}
                            </div>
                            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                                <label style={{ color: "gray", marginBottom: '0' }}>Tax (%)</label>
                                {values.tax ? values.tax : 0}
                            </div>
                            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: "space-between", }}>
                                <label style={{ marginBottom: '0' }}>Total</label>
                                {values.items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unit_price)), 0) + (values.tax ? Number(values.tax) : 0)}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Due Date</label>
                            <Field name="due_date" className="form-control" placeholder="DD-MM-YYYY" />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <Field name="description" as="textarea" className="form-control" />
                        </div>
                        <Button type="submit" disabled={isSubmitting} className="primary-btn">
                            {isSubmitting ? "Saving..." : "Save Invoice"}
                        </Button>
                    </Form>
                )}
            </Formik>
        </>

    );
};

export default InvoicesCreateForm; 