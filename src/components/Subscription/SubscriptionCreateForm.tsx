import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { Button } from "../ui/bootstrap-compat";
import API from "../../utils/API";
import { showMsgToast } from "../../utils/showMsgToast";
import { showErrorToast } from "../../utils/showErrorToast";
import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import * as Yup from "yup";
import useUserProfileStore from "../../hooks/useUserProfileStore";
import { Switch } from "../ui/switch";

const initialValues = {
  user_id: "",
  name: "",
  billing_cycle: "monthly",
  billing_cycle_amount: 0,
  billing_cycle_currency: "USD",
  items: [
    { item_name: "", quantity: 1, unit_price: "", total: 0, item_type: "service" },
  ],
};

const validationSchema = Yup.object().shape({
  user_id: Yup.string().required("User is required"),
  name: Yup.string().required("Subscription name is required"),
  billing_cycle: Yup.string().required("Billing cycle is required"),
  billing_cycle_currency: Yup.string().required("Currency is required"),
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
      item_type: Yup.string().required("Item type is required"),
    })
  ),
});

const SubscriptionCreateForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [selectedUser, setSelectedUser] = useState<{ label: string; value: string } | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const loggedInUser = useUserProfileStore((state) => state.user);
  const [activeTab, setActiveTab] = useState('SUBSCRIPTION')
  const [itemSuggestions, setItemSuggestions] = useState<{ [key: number]: any[] }>({});
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await API.get("/users", { params: { perPage: 40 } });
        const options = (res.data?.data || []).map((user: any) => ({
          label: user.name + (user.email ? ` (${user.email})` : ""),
          value: user.id,
        }));
        setAllUsers(options);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAllUsers();
  }, []);



  const loadUserOptions = async (inputValue: string) => {
    try {
      const res = await API.get("/users", {
        params: { q: inputValue || "", perPage: 10 }, // empty string fetches all
      });
      return (res.data?.data || []).map((user: any) => ({
        label: user.name + (user.email ? ` (${user.email})` : ""),
        value: user.id,
      }));
    } catch (error) {
      console.error(error);
      return [];
    }
  };


  const fetchServices = async (searchText: string, idx: number) => {
    try {
      const res = await API.get("/services", {
        params: { q: searchText || "", perPage: 20 },
      });

      const services = (res.data?.data || []).map((srv: any) => ({
        id: srv.id,
        name: srv.name,
        price: srv.price || "",
      }));

      const customOption = { id: "__custom__", name: "Custom Item", price: "" };

      setItemSuggestions((prev) => ({
        ...prev,
        [idx]: [customOption, ...services],
      }));
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, resetForm, }) => {
        try {
          const items = values.items.map((item) => ({
            ...item,
            total: Number(item.quantity) * Number(item.unit_price),
          }));

          const billing_cycle_amount = items.reduce((sum, item) => sum + item.total, 0);

          const payload = {
            ...values,
            user_id: selectedUser?.value || "",
            billing_cycle_amount,
            items,
          };

          await API.post("/subscriptions", payload);

          showMsgToast("Subscription created successfully");
          resetForm();
          setSelectedUser(null);
          if (onSuccess) onSuccess();
        } catch (err: any) {
          showErrorToast(err?.message || "Failed to create subscription");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, isSubmitting, setFieldValue, touched, errors }) => (
        <div className={` ${!showDrawer ? 'max-w-lg mx-auto' : 'max-w-full ml-14'}  px-7 `}>
          <Form>
            <div className="flex flex-row-reverse items-start justify-between py-5">

              {showDrawer &&
                <div className="w-[43%] mb-2">
                  <div className="flex items-center gap-3 cursor-pointer mb-3 px-3 py-1.5 rounded-lg bg-[#fafafc] w-fit">
                    <p className={`font-sans font-medium text-base px-4 py-0.5
                         ${activeTab === 'SUBSCRIPTION' ? "text-[#2E2E2E] bg-[#e6e7e8] rounded-sm" : 'text-[#959595]'}`}
                      onClick={() => setActiveTab('SUBSCRIPTION')}>Subscription</p>

                    <p className={`font-sans font-medium text-base px-4 py-0.5
                        ${activeTab === 'EMAIL' ? "text-[#2E2E2E] bg-[#e6e7e8] rounded-sm" : 'text-[#959595]'}`}
                      onClick={() => setActiveTab('EMAIL')}>Email</p>
                  </div>
                  <div
                    className='h-auto py-2.5 px-4 rounded-xl shadow-sm  bg-white border'
                  >
                    <div>
                      <div className="mt-2 mb-4">
                        <h2 className="text-lg font-bold">{`${activeTab === 'SUBSCRIPTION' ? "Subscription" : 'Email'}`} </h2>
                      </div>
                      {activeTab === 'SUBSCRIPTION' && (() => {

                        const subtotal = values.items.reduce(
                          (sum, item) => sum + Number(item.quantity || 0) * Number(item.unit_price || 0),
                          0
                        );

                        return (
                          <div>
                            {/* Header */}
                            <div className="mb-4">
                              <p>Subscription number: -</p>
                              <p>Issue date: {new Date().toLocaleDateString("en-GB")}</p>
                            </div>

                            {/* Billed To */}
                            <div className="mb-4 flex justify-between items-center">
                              <div>
                                <p className="text-gray-500">From</p>
                                <p>{loggedInUser?.primary_organisation?.name}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Billed to:</p>
                                {/* <p>{selectedUser?.label || "-"}</p> */}
                                <p>{selectedUser?.label?.replace(/\s*\(.*?\)/, "")}</p>
                                <p className="text-gray-600">
                                  {selectedUser?.label?.match(/\(([^)]+)\)/)?.[1]}
                                </p>
                              </div>
                            </div>

                            {/* Items Table */}
                            <table className="w-full border-collapse mb-4">
                              <thead>
                                <tr className="border-b pb-3">
                                  <th className="text-left p-2">Item</th>
                                  <th className="text-right p-2">Qty</th>
                                  <th className="text-right p-2">Price</th>
                                  <th className="text-right p-2">Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {values.items.map((item, idx) => (
                                  <tr key={idx}>
                                    <td className="p-2">{item.item_name || "-"}</td>
                                    <td className="p-2 text-right">{item.quantity || 0}</td>
                                    <td className="p-2 text-right">${Number(item.unit_price || 0).toFixed(2)}</td>
                                    <td className="p-2 text-right">
                                      ${(Number(item.quantity || 0) * Number(item.unit_price || 0)).toFixed(2)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>

                            {/* Totals */}
                            <div className="border-t pt-2">
                              <div className="flex justify-between my-2">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between font-bold mb-2">
                                <span>Total</span>
                                {/* <span>${total.toFixed(2)}</span> */}
                              </div>
                            </div>
                          </div>
                        )
                      })()
                      }

                      {activeTab === 'EMAIL' && (() => {
                        const subtotal = values.items.reduce(
                          (sum, item) => sum + Number(item.quantity || 0) * Number(item.unit_price || 0),
                          0
                        );

                        return (
                          <div className="my-3">
                            <p className="mb-10 font-sans font-medium text-lg">You have received a new Subscription from {loggedInUser?.primary_organisation?.name}</p>
                            <p className="mb-4 font-sans font-medium text-sm">Hi {loggedInUser?.primary_organisation?.name},</p>
                            <p className="mb-4 font-sans font-medium text-sm">You have received a new Subscription from {loggedInUser?.primary_organisation?.name}. To see subscription details, see the attached PDF. To make a payment, click on the button below.</p>
                            <table className="w-full border-collapse mb-4">
                              <thead>
                                <tr className="border-b pb-3">
                                  <th className="text-left p-2">Item</th>
                                  <th className="text-right p-2">Qty</th>
                                  <th className="text-right p-2">Price</th>
                                  <th className="text-right p-2">Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {values.items.map((item, idx) => (
                                  <tr key={idx}>
                                    <td className="p-2">{item.item_name || "-"}</td>
                                    <td className="p-2 text-right">{item.quantity || 0}</td>
                                    <td className="p-2 text-right">${Number(item.unit_price || 0).toFixed(2)}</td>
                                    <td className="p-2 text-right">
                                      ${(Number(item.quantity || 0) * Number(item.unit_price || 0)).toFixed(2)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>

                            <Button className="mt-4" type="button">Pay Subscription</Button>
                          </div>
                        )
                      })()
                      }

                    </div>
                  </div>
                </div>

              }

              <div className={`${showDrawer ? 'w-1/2' : 'w-full'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="">Recipient</h2>
                  <div className="flex gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={showDrawer}
                        onCheckedChange={(checked) => setShowDrawer(checked)}
                      />
                      <label className="text-sm font-medium">Preview Subscription</label>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <AsyncSelect
                    // cacheOptions
                    loadOptions={loadUserOptions}
                    defaultOptions={allUsers}
                    value={selectedUser}
                    onChange={(option) => {
                      setSelectedUser(option);
                      setFieldValue("user_id", option ? option.value : "");
                    }}
                    placeholder="Search user by name or email..."
                    isClearable
                  />
                  {touched.user_id && errors.user_id && (
                    <div className="error-message">{errors.user_id}</div>
                  )}
                </div>


                {/* Subscription Name */}
                <div className="form-group">
                  <label className="form-label">Subscription Name</label>
                  <Field name="name" className="form-control" />
                  <ErrorMessage name="name" component="div" className="error-message" />
                </div>

                {/* Billing Period */}
                <div className="form-group w-full">
                  <label className="form-label">Billing Cycle</label>
                  <Field as="select" name="billing_cycle" className="form-control">
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </Field>
                </div>

                {/* Currency */}
                {/* <div className="form-group w-full">
              <label className="form-label">Currency</label>
              <Field as="select" name="billing_cycle_currency" className="form-control">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </Field>
            </div> */}

                {/* Items */}
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

                            {itemSuggestions[idx]?.length > 0 && (
                              <div className="absolute z-10 bg-white border border-gray-300 !border-t-0 rounded w-full max-h-40 overflow-auto">
                                {itemSuggestions[idx].map((service, sIdx) => (
                                  <div
                                    key={sIdx}
                                    className="px-2 py-1 font-sans font-normal text-base cursor-pointer hover:bg-gray-100"
                                    onClick={() => {
                                      if (service.id === "__custom__") {
                                        setFieldValue(`items[${idx}].service_id`, null);
                                        setItemSuggestions((prev) => ({ ...prev, [idx]: [] }));
                                      } else {
                                        setFieldValue(`items[${idx}].item_name`, service.name);
                                        setFieldValue(`items[${idx}].unit_price`, service.price);
                                        setFieldValue(`items[${idx}].service_id`, service.id);
                                        setItemSuggestions((prev) => ({ ...prev, [idx]: [] }));
                                      }
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
                              <div className="flex gap-1 border rounded-md">
                                <span className="inline-flex items-center pl-2  text-sm">
                                  $
                                </span>
                                <Field
                                  name={`items[${idx}].unit_price`}
                                  className="form-control pl-0 !border-0 !focus:shadow-none !focus:ring-0"
                                  placeholder="Unit Price"
                                  type="number"
                                  min="0"
                                  step="1"
                                />

                              </div>
                              <ErrorMessage
                                name={`items[${idx}].unit_price`}
                                component="div"
                                className="text-red-500 text-xs"
                              />
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
                            item_type: "service"
                          })
                        }
                      >
                        + Add Item
                      </Button>
                    </div>
                  )}
                </FieldArray>
                <div className="flex justify-end my-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="primary-btn"
                  >
                    {isSubmitting ? "Saving..." : "Save Subscription"}
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default SubscriptionCreateForm;
