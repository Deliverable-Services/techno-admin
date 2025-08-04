import { Formik, Form, Field, FieldArray } from "formik";
import { Button, Modal } from "react-bootstrap";
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

const InvoicesCreateForm = ({ onSuccess }: { onSuccess?: () => void }) => {
    const [selectedUser, setSelectedUser] = useState<{ label: string; value: string } | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    // const [isDownloading, setIsDownloading] = useState(false);

    const generateInvoiceNumber = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    // Function to generate and download PDF
    // const downloadInvoicePDF = (values: any) => {
    //     setIsDownloading(true);
    //     try {
    //         const doc = new jsPDF();
    //         const invoiceNumber = generateInvoiceNumber();
    //         const today = new Date();
    //         const invoiceDate = today.toLocaleDateString('en-GB');

    //         // Calculate totals
    //         const items = values.items.map((item: any) => ({
    //             ...item,
    //             total: Number(item.quantity) * Number(item.unit_price),
    //         }));
    //         const subtotal = items.reduce((sum: number, item: any) => sum + item.total, 0);
    //         const tax = values.tax ? Number(values.tax) : 0;
    //         const total = subtotal + tax;

    //         // Header
    //         doc.setFontSize(24);
    //         doc.text('INVOICE', 20, 30);

    //         // Invoice details
    //         doc.setFontSize(12);
    //         doc.text(`Invoice Number: ${invoiceNumber}`, 20, 50);
    //         doc.text(`Date: ${invoiceDate}`, 20, 60);
    //         doc.text(`Due Date: ${values.due_date || 'N/A'}`, 20, 70);

    //         // Company logo placeholder
    //         doc.setFillColor(255, 224, 102);
    //         doc.rect(150, 20, 40, 40, 'F');
    //         doc.setFontSize(20);
    //         doc.text('🧾', 165, 45);

    //         // Bill to section
    //         doc.setFontSize(14);
    //         doc.text('Bill To:', 20, 90);
    //         doc.setFontSize(12);
    //         doc.text(selectedUser?.label || 'N/A', 20, 100);

    //         // Items table
    //         const tableData = items.map((item: any) => [
    //             item.item_name || 'N/A',
    //             item.quantity.toString(),
    //             `$${item.unit_price || 0}`,
    //             `$${item.total.toFixed(2)}`
    //         ]);

    //         autoTable(doc, {
    //             head: [['Description', 'Qty', 'Unit Price', 'Amount']],
    //             body: tableData,
    //             startY: 120,
    //             styles: {
    //                 fontSize: 10,
    //                 cellPadding: 5,
    //             },
    //             headStyles: {
    //                 fillColor: [66, 66, 66],
    //                 textColor: 255,
    //                 fontStyle: 'bold',
    //             },
    //         });

    //         // Totals section
    //         const finalY = (doc as any).lastAutoTable.finalY + 10;
    //         doc.setFontSize(12);
    //         doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 140, finalY);
    //         doc.text(`Tax: $${tax.toFixed(2)}`, 140, finalY + 10);
    //         doc.setFontSize(14);
    //         doc.setFont(undefined, 'bold');
    //         doc.text(`Total: $${total.toFixed(2)}`, 140, finalY + 20);

    //         // Description
    //         if (values.description) {
    //             doc.setFontSize(12);
    //             doc.setFont(undefined, 'normal');
    //             doc.text('Description:', 20, finalY + 40);
    //             doc.setFontSize(10);
    //             const splitDescription = doc.splitTextToSize(values.description, 170);
    //             doc.text(splitDescription, 20, finalY + 50);
    //         }

    //         // Download the PDF
    //         doc.save(`invoice-${invoiceNumber}.pdf`);
    //         showMsgToast("Invoice PDF downloaded successfully");
    //     } catch (error) {
    //         showErrorToast("Failed to generate PDF");
    //         console.error('PDF generation error:', error);
    //     } finally {
    //         setIsDownloading(false);
    //     }
    // };

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

            {/* Invoice Preview Modal */}
            <Modal
                show={showPreview}
                onHide={() => setShowPreview(false)}
                className="invoice-preview-modal"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Invoice Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div
                        className="invoice-preview">
                        <div className="invoice-header">
                            <div>
                                <h2>Invoice</h2>
                                <div className="invoice-header-details">
                                    <div>Invoice number <span>{generateInvoiceNumber()}</span></div>
                                    <div>Issue date <span>{new Date().toLocaleDateString('en-GB')}</span></div>
                                    <div>Due date <span>{'-'}</span></div>
                                </div>
                            </div>
                            <div>
                                {/* Placeholder for logo */}
                                <div className="invoice-logo">
                                    <span role="img" aria-label="logo">🧾</span>
                                </div>
                            </div>
                        </div>
                        <div className="invoice-billed-to">
                            <div>
                                <div className="invoice-billed-to-label">Billed to</div>
                                <div className="invoice-billed-to-name">{selectedUser?.label || '-'}</div>
                                <div className="invoice-billed-to-email">{selectedUser ? '' : '-'}</div>
                            </div>
                        </div>
                        <div className="invoice-total">
                            ${0} due {new Date().toLocaleDateString('en-GB')}
                        </div>
                        <table className="invoice-table">
                            <thead>
                                <tr className="invoice-table-header" >
                                    <th className="invoice-table-header-cell-left">Description</th>
                                    <th className="invoice-table-header-cell">Qty</th>
                                    <th className="invoice-table-header-cell">Unit price</th>
                                    <th className="invoice-table-header-cell">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="invoice-table-cell-left">-</td>
                                    <td className="invoice-table-cell">-</td>
                                    <td className="invoice-table-cell">-</td>
                                    <td className="invoice-table-cell">-</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="invoice-summary-download">
                            <div className="invoice-summary-item-download">
                                <span>Subtotal</span>
                                <span>${0}</span>
                            </div>
                            <div className="invoice-summary-item-download">
                                <span>Tax</span>
                                <span>${0}</span>
                            </div>
                            <div className="invoice-summary-item-download">
                                <span>Total</span>
                                <span>${0}</span>
                            </div>
                            <div className="invoice-summary-item-download">
                                <span>Amount due</span>
                                <span>${0}</span>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPreview(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

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
                                <div className="recipient-actions">
                                    <Button className="primary-btn"
                                        onClick={() => setShowPreview(true)}
                                    >
                                        Preview Invoice
                                    </Button>
                                </div>
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
                                {isSubmitting ? "Saving..." : "Save Invoice"}
                            </Button>
                        </Form>
                    </div>
                )}
            </Formik>
        </>
    );
};

export default InvoicesCreateForm; 