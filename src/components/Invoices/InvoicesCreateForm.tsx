import { Formik, Form, Field, FieldArray } from "formik";
import { Modal } from "../ui/bootstrap-compat";
import API from "../../utils/API";
import { showMsgToast } from "../../utils/showMsgToast";
import { showErrorToast } from "../../utils/showErrorToast";
import { useState } from "react";
import AsyncSelect from "react-select/async";
import * as Yup from "yup";
import { ErrorMessage } from "formik";
import DatePicker from "../../shared-components/DatePicker";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";

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
  items: [{ item_name: "", quantity: 1, unit_price: "", total: "" }],
  addTax: false,
};

const validationSchema = Yup.object().shape({
  user_id: Yup.string().required("User is required"),
  items: Yup.array().of(
    Yup.object().shape({
      item_name: Yup.string().required("Item name is required"),
      unit_price: Yup.number()
        .typeError("Unit price must be a number")
        .required("Unit price is required"),
      quantity: Yup.number()
        .typeError("Quantity must be a number")
        .integer("Quantity must be an integer")
        .min(1, "Quantity must be at least 1")
        .required("Quantity is required"),
    })
  ),
});

const InvoicesCreateForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [selectedUser, setSelectedUser] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [itemSuggestions, setItemSuggestions] = useState<{ [key: number]: any[] }>({});
  const generateInvoiceNumber = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Async load options for user search
  const loadUserOptions = async (inputValue: string) => {
    if (!inputValue) return [];
    try {
      const res = await API.get("/users", {
        params: { q: inputValue, perPage: 10 },
      });
      return (res.data?.data || []).map((user: any) => ({
        label: user.name + (user.email ? ` (${user.email})` : ""),
        value: user.id,
      }));
    } catch {
      return [];
    }
  };


  const fetchServices = async (q: string, idx: number) => {
    if (!q) {
      setItemSuggestions((prev) => ({ ...prev, [idx]: [] }));
      return;
    }
    try {
      const res = await API.get("/services", { params: { q } });
      setItemSuggestions((prev) => ({ ...prev, [idx]: res?.data?.data || [] }));
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={() => { }}
      >
        {({ values }) => (
          <>
            <Modal
              show={showPreview}
              onHide={() => setShowPreview(false)}
              style={{ margin: "0 auto" }}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Invoice Preview</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {(() => {
                  const subtotal = values.items.reduce(
                    (sum, item) =>
                      sum + Number(item.quantity || 0) * Number(item.unit_price || 0),
                    0
                  );
                  const taxAmount =
                    values.addTax && values.tax
                      ? (subtotal * Number(values.tax)) / 100
                      : 0;
                  const total = subtotal + taxAmount;

                  return (
                    <div className="border border-gray-300 rounded-xl p-8 bg-white shadow-md max-w-full">
                      {/* Invoice Header */}
                      <div className="flex justify-between items-start">
                        <div>
                          <h2>Invoice</h2>
                          <div className="text-gray-500 text-sm mt-4">
                            <div>
                              Invoice number <span>{generateInvoiceNumber()}</span>
                            </div>
                            <div>
                              Issue date{" "}
                              <span>{new Date().toLocaleDateString("en-GB")}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="w-10 h-10 bg-yellow-200 rounded-lg flex items-center justify-center">
                            <span role="img" aria-label="logo">🧾</span>
                          </div>
                        </div>
                      </div>

                      {/* Billed To */}
                      <div className="flex justify-between mt-8 mb-4">
                        <div>
                          <div className="text-gray-500 text-sm">Billed to</div>
                          <div className="invoice-billed-to-name">
                            {selectedUser?.label || "-"}
                          </div>
                        </div>
                      </div>

                      {/* Items Table */}
                      <table className="w-full border-collapse mb-6">
                        <thead>
                          <tr className="border-b border-gray-300">
                            <th className="text-left p-2">Item</th>
                            <th className="text-right p-2">Qty</th>
                            <th className="text-right p-2">Unit price</th>
                            <th className="text-right p-2">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {values.items.map((item, idx) => (
                            <tr key={idx}>
                              <td className="text-left p-2">{item.item_name || "-"}</td>
                              <td className="text-right p-2">{item.quantity || 0}</td>
                              <td className="text-right p-2">
                                ${Number(item.unit_price || 0).toFixed(2)}
                              </td>
                              <td className="text-right p-2">
                                ${(Number(item.quantity || 0) * Number(item.unit_price || 0)).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Totals */}
                      <div className="max-w-xs ml-auto">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Subtotal</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        {values.addTax && (
                          <div className="flex justify-between text-sm mb-1">
                            <span>Tax ({values.tax || 0}%)</span>
                            <span>${taxAmount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm font-bold">
                          <span>Total</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowPreview(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        )}
      </Formik>



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
            const dd = String(today.getDate()).padStart(2, "0");
            const mm = String(today.getMonth() + 1).padStart(2, "0");
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
        {({
          values,
          isSubmitting,
          setFieldValue,
          setFieldTouched,
          touched,
          errors,
        }) => (
          <div className="flex-1 min-w-[340px] max-w-[600px]">
            <Form>
              {/* Update the download button to use current form values */}
              <div className="flex items-center justify-between mb-2 py-5">
                <h2 className="">Recipient</h2>
                <div className="flex gap-2">
                  <Button
                    onClick={(e: any) => {
                      e.preventDefault()
                      setShowPreview(true)
                    }}
                  >
                    Preview Invoice
                  </Button>
                </div>
              </div>

              <>
                {/* Invoice Preview Modal (now inside so we have access to values) */}
                <Modal
                  show={showPreview}
                  onHide={() => setShowPreview(false)}
                  style={{ margin: "0 auto" }}
                  centered
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Invoice Preview</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {(() => {
                      const subtotal = values.items.reduce(
                        (sum, item) =>
                          sum + Number(item.quantity || 0) * Number(item.unit_price || 0),
                        0
                      );
                      const taxAmount =
                        values.addTax && values.tax
                          ? (subtotal * Number(values.tax)) / 100
                          : 0;
                      const total = subtotal + taxAmount;

                      return (
                        <div className="border border-gray-300 rounded-xl p-8 bg-white shadow-md max-w-full">
                          {/* Invoice Header */}
                          <div className="flex justify-between items-start">
                            <div>
                              <h2>Invoice</h2>
                              <div className="text-gray-500 text-sm mt-4">
                                <div>
                                  Invoice number <span>{generateInvoiceNumber()}</span>
                                </div>
                                <div>
                                  Issue date{" "}
                                  <span>{new Date().toLocaleDateString("en-GB")}</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="w-10 h-10 bg-yellow-200 rounded-lg flex items-center justify-center">
                                <span role="img" aria-label="logo">🧾</span>
                              </div>
                            </div>
                          </div>

                          {/* Billed To */}
                          <div className="flex justify-between mt-8 mb-4">
                            <div>
                              <div className="text-gray-500 text-sm">Billed to</div>
                              <div className="invoice-billed-to-name">
                                {selectedUser?.label || "-"}
                              </div>
                            </div>
                          </div>

                          {/* Items Table */}
                          <table className="w-full border-collapse mb-6">
                            <thead>
                              <tr className="border-b border-gray-300">
                                <th className="text-left p-2">Item</th>
                                <th className="text-right p-2">Qty</th>
                                <th className="text-right p-2">Unit price</th>
                                <th className="text-right p-2">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {values.items.map((item, idx) => (
                                <tr key={idx}>
                                  <td className="text-left p-2">{item.item_name || "-"}</td>
                                  <td className="text-right p-2">{item.quantity || 0}</td>
                                  <td className="text-right p-2">
                                    ${Number(item.unit_price || 0).toFixed(2)}
                                  </td>
                                  <td className="text-right p-2">
                                    ${(Number(item.quantity || 0) * Number(item.unit_price || 0)).toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          {/* Totals */}
                          <div className="max-w-xs ml-auto">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Subtotal</span>
                              <span>${subtotal.toFixed(2)}</span>
                            </div>
                            {values.addTax && (
                              <div className="flex justify-between text-sm mb-1">
                                <span>Tax ({values.tax || 0}%)</span>
                                <span>${taxAmount.toFixed(2)}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-sm font-bold">
                              <span>Total</span>
                              <span>${total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button onClick={() => setShowPreview(false)}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              </>

              <div className="mb-4">
                <AsyncSelect
                  cacheOptions
                  loadOptions={loadUserOptions}
                  defaultOptions
                  value={selectedUser}
                  onChange={(option) => {
                    setSelectedUser(option);
                    setFieldValue("user_id", option ? option.value : "");
                    setFieldTouched("user_id", true, true);
                  }}
                  onBlur={() => setFieldTouched("user_id", true, true)}
                  placeholder="Search user by name or email..."
                  isClearable
                />
                {touched.user_id && errors.user_id && (
                  <div className="text-red-500 text-xs">{errors.user_id}</div>
                )}
              </div>

              <FieldArray name="items">
                {({ push, remove }) => (
                  <div>
                    <label>Items</label>
                    {values.items.map((item, idx) => (
                      <div
                        className="pb-2 pt-2"
                        key={idx}
                        style={{
                          borderBottom:
                            values.items.length !== 1
                              ? "1px solid #e7eaf3"
                              : "none",
                        }}
                      >
                        <div className="relative">
                          <Field
                            name={`items[${idx}].item_name`}
                            className="w-full py-2 px-2 border border-gray-300 rounded text-sm bg-white"
                            placeholder="Item Name"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const value = e.target.value;
                              setFieldValue(`items[${idx}].item_name`, value);
                              setFieldValue(`items[${idx}].service_id`, null);
                              fetchServices(value, idx);
                            }}
                            autoComplete="off"
                          />

                          {/* Dropdown suggestions */}
                          {itemSuggestions[idx]?.length > 0 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full max-h-40 overflow-auto">
                              {itemSuggestions[idx].map((service, sIdx) => (
                                <div
                                  key={sIdx}
                                  className="px-2 py-1 cursor-pointer hover:bg-gray-100"
                                  onClick={() => {
                                    setFieldValue(`items[${idx}].item_name`, service.name);
                                    setFieldValue(`items[${idx}].unit_price`, service.price || "");
                                    setFieldValue(`items[${idx}].service_id`, service.id);
                                    setItemSuggestions((prev) => ({ ...prev, [idx]: [] }));
                                  }}
                                >
                                  {service.name}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Error for item name */}
                        <ErrorMessage name={`items[${idx}].item_name`}>
                          {(msg) => (
                            <div className="text-red-500 text-xs">{msg}</div>
                          )}
                        </ErrorMessage>
                        <div className="flex gap-2 mb-2 mt-3">
                          <div>
                            <Field
                              name={`items[${idx}].quantity`}
                              className="flex-1 py-2 px-2 border border-gray-300 rounded text-sm bg-white"
                              placeholder="Qty"
                              type="number"
                              min="1"
                              step="1"
                            />
                            {/* Error for quantity */}
                            <ErrorMessage name={`items[${idx}].quantity`}>
                              {(msg) => (
                                <div className="text-red-500 text-xs">
                                  {msg}
                                </div>
                              )}
                            </ErrorMessage>
                          </div>

                          <div>
                            <Field
                              name={`items[${idx}].unit_price`}
                              className="flex-1 py-2 px-2 border border-gray-300 rounded text-sm bg-white"
                              placeholder="Unit Price"
                              type="number"
                              min="0"
                              step="0.01"
                            />
                            {/* Error for unit price */}
                            <ErrorMessage name={`items[${idx}].unit_price`}>
                              {(msg) => (
                                <div className="text-red-500 text-xs">
                                  {msg}
                                </div>
                              )}
                            </ErrorMessage>
                          </div>
                          <Button
                            onClick={() => remove(idx)}
                            disabled={values.items.length === 1}
                          >
                            -
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      className="mb-4 mt-2 bg-black text-white cursor-pointer"
                      onClick={() =>
                        push({
                          item_name: "",
                          quantity: 1,
                          unit_price: "",
                          total: "",
                        })
                      }
                    >
                      + Add Item
                    </Button>
                  </div>
                )}
              </FieldArray>
              {/* AddTax Checkbox */}
              <div style={{ width: "100%" }}>
                <div className="my-2 flex items-center gap-2">
                  <label className="flex items-center gap-2">
                    <Field type="checkbox" name="addTax" onChange={(e: any) => {
                      const checked = e.target.checked;
                      setFieldValue("addTax", checked);
                      if (!checked) {
                        setFieldValue("tax", "");
                      }
                    }} />
                    <p className="m-0">Add Tax %</p>
                  </label>
                </div>
                {values.addTax && (
                  <div className="mb-4 w-full">
                    <Field
                      name="tax"
                      className="w-full py-2 px-2 border border-gray-300 rounded text-sm bg-white"
                    />
                  </div>
                )}
              </div>
              <div className="border border-gray-200 rounded-lg p-2 mb-2">
                <div className="flex items-center justify-between w-full">
                  <label className="text-gray-500 mb-0">Subtotal</label>
                  {values.items.reduce(
                    (sum, item) =>
                      sum + Number(item.quantity) * Number(item.unit_price),
                    0
                  )}
                </div>
                {values?.tax && <div className="flex items-center justify-between w-full">
                  <label className="text-gray-500 mb-0">Tax %</label>
                  {(() => {
                    const subtotal = values.items.reduce(
                      (sum, item) =>
                        sum + Number(item.quantity) * Number(item.unit_price),
                      0
                    );
                    return values.tax ? (subtotal * Number(values.tax)) / 100 : 0;
                  })()}
                </div>}

                <div className="flex items-center justify-between w-full">
                  <label className="text-gray-500 mb-0">Total</label>
                  {(() => {
                    const subtotal = values.items.reduce(
                      (sum, item) =>
                        sum + Number(item.quantity) * Number(item.unit_price),
                      0
                    );
                    const taxAmount = values.tax ? (subtotal * Number(values.tax)) / 100 : 0;
                    return subtotal + taxAmount;
                  })()}

                </div>
              </div>
              <div className="mb-4">
                <DatePicker
                  label="Due Date"
                  name="due_date"
                  setFieldValue={setFieldValue}
                  pickerType="date"
                  error={touched.due_date && errors.due_date ? errors.due_date : undefined}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Field
                  name="description"
                  as="textarea"
                  className="w-full py-2 px-2 border border-gray-300 rounded text-sm bg-white"
                />
              </div>
              <div className="mb-4 flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Invoice"}
                </Button>
              </div>
            </Form>
          </div>
        )}
      </Formik>

    </>
  );
};

export default InvoicesCreateForm;
