import { useField } from "formik";
import moment from "moment";
import React, { useState } from "react";
import { Form } from "../components/ui/bootstrap-compat";
import { DefaultInputHeight } from "../utils/constants";

interface Props {
  label?: string;
  name: string;
  error?: string;
  pickerType?: string;
  disablePastDates?: boolean;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
}

const DatePicker: React.FC<Props> = ({
  label,
  name,
  error,
  disablePastDates = false,
  pickerType = "datetime-local",
  setFieldValue,
  ...props
}) => {
  const [field] = useField({ ...props, name });
  const [value, setValue] = useState(
    moment(field.value).format("YYYY-MM-DDTHH:mm")
  );
  const handleChange = (e: any) => {
    setFieldValue(name, moment(e.target.value).format("YYYY-MM-DD HH:mm:ss"));
    setValue(e.target.value);
  };
  return (
    <div className="w-100">
      <Form.Group>
        {label ? <Form.Label htmlFor={field.name}>{label}</Form.Label> : null}
        {
          <Form.Control
            id={field.name}
            value={value}
            onChange={handleChange}
            type={pickerType}
            style={{
              height: DefaultInputHeight,
            }}
            min={
              disablePastDates
                ? moment().format(pickerType === "date" ? "YYYY-MM-DD" : "YYYY-MM-DDTHH:mm")
                : undefined
            }
          />
        }
        {error && <Form.Text className="text-danger">{error}</Form.Text>}
      </Form.Group>
    </div>
  );
};

export default DatePicker;
