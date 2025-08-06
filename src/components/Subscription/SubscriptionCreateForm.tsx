import { Formik, Form, Field, FieldArray } from "formik";
import { Button } from "react-bootstrap";
import API from "../../utils/API";
import { showMsgToast } from "../../utils/showMsgToast";
import { showErrorToast } from "../../utils/showErrorToast";
import { useState } from "react";
import AsyncSelect from "react-select/async";
import * as Yup from 'yup';
import { ErrorMessage } from "formik";

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
    addTax: false, // <-- add this
    payAt: false,
    billing_period: "monthly",
    start_date: "immediately",
    end_date: "none",
    custom_billing_period: "",
    custom_start_date: "",
    custom_end_date: "",
};

const validationSchema = Yup.object().shape({
    user_id: Yup.string().required('User is required'),
    items: Yup.array().of(
        Yup.object().shape({
            item_name: Yup.string().required('Item name is required'),
            unit_price: Yup.number().typeError('Unit price must be a number').required('Unit price is required'),
            quantity: Yup.number()
                .typeError('Quantity must be a number')
                .integer('Quantity must be an integer')
                .min(1, 'Quantity must be at least 1')
                .required('Quantity is required'),
        })
    ),
});

const SubscriptionCreateForm = ({ onSuccess }: { onSuccess?: () => void }) => {
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
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
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
                {({ values, isSubmitting, setFieldValue, setFieldTouched, touched, errors }) => (
                    <div className="container-invoice">
                        <Form>
                            {/* Update the download button to use current form values */}
                            <div className="recipient-header">
                                <h2 className="recipient-heading">Recipient</h2>
                            </div>

                            <div className="form-group">
                                <AsyncSelect
                                    cacheOptions
                                    loadOptions={loadUserOptions}
                                    defaultOptions
                                    value={selectedUser}
                                    onChange={option => {
                                        setSelectedUser(option);
                                        setFieldValue('user_id', option ? option.value : '');
                                        setFieldTouched('user_id', true, true);
                                    }}
                                    onBlur={() => setFieldTouched('user_id', true, true)}
                                    placeholder="Search user by name or email..."
                                    isClearable
                                />
                                {touched.user_id && errors.user_id && (
                                    <div className="error-message">{errors.user_id}</div>
                                )}
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
                                                className="form-group-item"
                                                key={idx}
                                                style={{
                                                    borderBottom: values.items.length !== 1 ? '1px solid #e7eaf3' : 'none',
                                                }}
                                            >
                                                <Field name={`items[${idx}].item_name`} className="form-control" placeholder="Item Name" />
                                                {/* Error for item name */}
                                                <ErrorMessage name={`items[${idx}].item_name`}>{msg => <div className="error-message">{msg}</div>}</ErrorMessage>
                                                <div className="item-quantity">
                                                    <div>
                                                        <Field name={`items[${idx}].quantity`} className="form-control" placeholder="Qty" type="number" min="1" step="1" />
                                                        {/* Error for quantity */}
                                                        <ErrorMessage name={`items[${idx}].quantity`}>{msg => <div className="error-message">{msg}</div>}</ErrorMessage>
                                                    </div>

                                                    <div>
                                                        <Field name={`items[${idx}].unit_price`} className="form-control" placeholder="Unit Price" type="number" min="0" step="0.01" />
                                                        {/* Error for unit price */}
                                                        <ErrorMessage name={`items[${idx}].unit_price`}>{msg => <div className="error-message">{msg}</div>}</ErrorMessage>
                                                    </div>
                                                    <Button variant="danger" onClick={() => remove(idx)} disabled={values.items.length === 1}>-</Button>
                                                </div>
                                            </div>
                                        ))}
                                        <Button className="primary-btn wrapper-add-item" onClick={() => push({ item_name: "", quantity: 1, unit_price: "", total: "" })}>
                                            + Add Item
                                        </Button>
                                    </div>
                                )}
                            </FieldArray>
                            {/* AddTax Checkbox */}
                            <div style={{ width: '100%' }}>
                                <div className="wrapperAddTax">
                                    <label className="AddTaxCheckbox">
                                        <Field type="checkbox" name="addTax" />
                                        <p>Add Tax %</p>
                                    </label>
                                </div>
                                {values.addTax && (
                                    <div className="form-group wrapperAddTaxForm">
                                        <Field name="tax" className="form-control" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="wrapperAddTax">
                                    <label className="AddTaxCheckbox">
                                        <Field type="checkbox" name="payAt" />
                                        <p>Schedule At</p>
                                    </label>
                                </div>
                                {values.payAt && (
                                    <div>
                                        <div className="form-group wrapperAddTaxForm">
                                            <label>Billing period</label>
                                            <Field as="select" name="billing_period" className="form-control">
                                                <option value="weekly">Weekly</option>
                                                <option value="monthly">Monthly</option>
                                                <option value="quarterly">Quarterly</option>
                                                <option value="yearly">Yearly</option>
                                                <option value="custom">Custom</option>
                                            </Field>
                                        </div>

                                        {values.billing_period === "custom" && (
                                            <div className="form-group wrapperAddTaxForm">
                                                <label>Custom billing period (days)</label>
                                                <Field name="custom_billing_period" className="form-control" type="number" min="1" placeholder="Enter number of days" />
                                            </div>
                                        )}

                                        <div className="container-wrapper">
                                            <div className="form-group wrapperAddTaxForm">
                                                <label>Start date</label>
                                                <Field as="select" name="start_date" className="form-control">
                                                    <option value="immediately">Immediately</option>
                                                    <option value="next_week">Next Week</option>
                                                    <option value="next_month">Next Month</option>
                                                    <option value="custom_start">Custom Date</option>
                                                </Field>
                                            </div>
                                            <div className="form-group wrapperAddTaxForm">
                                                <label>End date</label>
                                                <Field as="select" name="end_date" className="form-control">
                                                    <option value="none">None</option>
                                                    <option value="after_3_months">After 3 Months</option>
                                                    <option value="after_6_months">After 6 Months</option>
                                                    <option value="after_1_year">After 1 Year</option>
                                                    <option value="custom_end">Custom Date</option>
                                                </Field>
                                            </div>
                                        </div>

                                        {values.start_date === "custom_start" && (
                                            <div className="form-group wrapperAddTaxForm">
                                                <label>Custom start date</label>
                                                <Field name="custom_start_date" className="form-control" type="date" />
                                            </div>
                                        )}

                                        {values.end_date === "custom_end" && (
                                            <div className="form-group wrapperAddTaxForm">
                                                <label>Custom end date</label>
                                                <Field name="custom_end_date" className="form-control" type="date" />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="invoice-summary">
                                <div className="invoice-summary-item">
                                    <label className="wrapper-summary-label">Subtotal</label>
                                    {values.items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unit_price)), 0)}
                                </div>
                                <div className="invoice-summary-item">
                                    <label className="wrapper-summary-label">Tax (%)</label>
                                    {values.tax ? values.tax : 0}
                                </div>
                                <div className="invoice-summary-item">
                                    <label className="wrapper-summary-label">Total</label>
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
                                {isSubmitting ? "Saving..." : "Save Subscription"}
                            </Button>
                        </Form>
                    </div>
                )}
            </Formik>
        </>
    );
};

export default SubscriptionCreateForm; 
