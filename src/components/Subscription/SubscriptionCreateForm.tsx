import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { Button } from "../ui/bootstrap-compat";
import API from "../../utils/API";
import { showMsgToast } from "../../utils/showMsgToast";
import { showErrorToast } from "../../utils/showErrorToast";
import { useState } from "react";
import AsyncSelect from "react-select/async";
import * as Yup from "yup";

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
            billing_cycle_amount, // send as number
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
        <div className="flex-[1_1_350px] min-w-[340px] max-w-[600px]">
          <Form>
            {/* Recipient */}
            <div className="my-4">
              <h2 >Recipient</h2>

            </div>
            <div className="form-group">
              <AsyncSelect
                cacheOptions
                loadOptions={loadUserOptions}
                defaultOptions
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
                <div >
                  <div className="flex items-center justify-between">
                    <label className="form-label">Items</label>
                    <Button
                      className="primary-btn"
                      onClick={() =>
                        push({
                          item_name: "",
                          quantity: 1,
                          unit_price: "",
                          total: 0,
                          item_type: "service",
                        })
                      }
                    >
                      + Item
                    </Button>
                  </div>
                  {values.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="py-2.5 "
                    // style={{
                    //   borderBottom:
                    //     values.items.length !== 1 ? "1px solid #e7eaf3" : "none",
                    // }}
                    >
                      {/* Item Name */}
                      <Field
                        name={`items[${idx}].item_name`}
                        className="form-control"
                        placeholder="Item Name"
                      />
                      <ErrorMessage
                        name={`items[${idx}].item_name`}
                        component="div"
                        className="error-message"
                      />

                      <div
                        className="my-2"
                      >
                        {/* Quantity */}
                        <div className="flex my-2 gap-3 mb-3 w-full">
                          <div>
                            <Field
                              name={`items[${idx}].quantity`}
                              className="form-control"
                              placeholder="Qty"
                              type="number"
                              min="1"
                              step="1"
                            />
                            <ErrorMessage
                              name={`items[${idx}].quantity`}
                              component="div"
                              className="text-red-500 text-xs"
                            />
                          </div>

                          {/* Unit Price */}
                          <div>
                            <Field
                              name={`items[${idx}].unit_price`}
                              className="form-control"
                              placeholder="Unit Price"
                              type="number"
                              min="0"
                              step="0.01"
                            />
                            <ErrorMessage
                              name={`items[${idx}].unit_price`}
                              component="div"
                              className="text-red-500 text-xs"
                            />
                          </div>
                        </div>

                        {/* Item Type */}
                        {/* <div>
                          <Field
                            as="select"
                            name={`items[${idx}].item_type`}
                            className="form-control"
                          >
                            <option value="service">Service</option>
                            <option value="company">Company</option>
                          </Field>
                          <ErrorMessage
                            name={`items[${idx}].item_type`}
                            component="div"
                            className="text-red-500 text-xs"
                          />
                        </div> */}
                        <div className="mt-3 flex justify-end">
                          <Button
                            variant="danger"

                            onClick={() => remove(idx)}
                            disabled={values.items.length === 1}
                          >
                            -
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

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
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default SubscriptionCreateForm;
