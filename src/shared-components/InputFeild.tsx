import React, { ChangeEvent, ElementType, InputHTMLAttributes } from "react";
import { useField } from "formik";
import { Form } from "react-bootstrap";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  name: string;
  as?: ElementType<any> | undefined;
  error?: string;
  isFile?: boolean;
  setFieldValue?: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
  selectData?: Array<any>;
  selectValueKey?: any;
  selectTitleKey?: string;
  altTitleKey?: string;
};

// '' => false
// 'error message stuff' => true

export const InputField: React.FC<InputFieldProps> = ({
  isFile,
  error,
  label,
  as = "input",
  setFieldValue,
  size: _,
  selectData,
  selectValueKey,
  selectTitleKey,
  altTitleKey,
  ...props
}) => {
  const [field] = useField(props);
  // <Form.File
  //     label="Choose File"
  //     custom {...field} {...props} id={field.name}
  // /> :

  return (
    <div className="w-100">
      <Form.Group>
        {label ? <Form.Label htmlFor={field.name}>{label}</Form.Label> : null}
        {isFile ? (
          <Form.File
            id="custom-file"
            label="Choose file"
            custom
            onChange={(e: ChangeEvent) => {
              const input = (e.currentTarget as HTMLInputElement).files;
              if (input && setFieldValue) {
                setFieldValue(field.name, input[0]);
              }
            }}
          />
        ) : as === "select" ? (
          <Form.Control {...field} id={field.name} as="select">
            <option value="">{label}</option>
            {selectData &&
              selectData.map((data: any) => (
                <option value={data[selectValueKey || "id"]}>
                  {data[selectTitleKey || "name"] || data[altTitleKey]}
                </option>
              ))}
          </Form.Control>
        ) : (
          <Form.Control {...field} {...props} id={field.name} as={as} />
        )}
        {error && <Form.Text className="text-danger">{error}</Form.Text>}
      </Form.Group>
    </div>
  );
};
