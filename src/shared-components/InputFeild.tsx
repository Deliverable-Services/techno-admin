import React, { ChangeEvent, ElementType, InputHTMLAttributes } from "react";
import { useField } from "formik";
import { Form } from "react-bootstrap";
import TableImage from "./TableImage";
import { DefaultInputHeight } from "../utils/constants";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  name: string;
  as?: ElementType<any> | undefined;
  error?: string;
  isFile?: boolean;
  folder?: string;
  showImage?: boolean;
  setFieldValue?: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
  selectData?: Array<any>;
  selectValueKey?: any;
  selectTitleKey?: string;
  altTitleKey?: string;
  multipleImages?: boolean;
  isDisabled?: boolean;
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
  folder,
  showImage = true,
  multipleImages = false,
  isDisabled = false,
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
          <Form.Control
            type="file"
            name={field.name + "[]"}
            id="custom-file"
            onChange={(e: ChangeEvent) => {
              const input = (e.currentTarget as HTMLInputElement).files;
              if (input && setFieldValue) {
                if (!multipleImages) {
                  setFieldValue(field.name, input[0]);
                  return;
                }
                setFieldValue(field.name, input);
              }
            }}
            multiple={multipleImages}
          />
        ) : as === "select" ? (
          <Form.Control
            {...field}
            id={field.name}
            as="select"
            disabled={isDisabled}
            style={{
              height: DefaultInputHeight,
              ...props.style,
            }}
          >
            <option value="">{label}</option>
            {selectData &&
              selectData.map((data: any) => (
                <option value={data[selectValueKey || "id"]}>
                  {data[selectTitleKey || "name"] || data[altTitleKey]}
                </option>
              ))}
          </Form.Control>
        ) : (
          <Form.Control
            {...field}
            {...props}
            id={field.name}
            as={as}
            disabled={isDisabled}
            style={{
              height: DefaultInputHeight,
              ...props.style,
            }}
          />
        )}
        {error && <Form.Text className="text-danger">{error}</Form.Text>}
      </Form.Group>

      {showImage && isFile && field?.value && (
        <div className="mb-2 bg-light p-2" style={{ position: "relative" }}>
          <button
            className="h5"
            style={{
              position: "absolute",
              top: "50%",
              right: 10,
              transform: "translateY(-50%)",
            }}
            onClick={() => setFieldValue(field.name, null)}
          >
            x
          </button>
          {typeof field.value === "string" ? (
            <TableImage folder={folder} file={field.value} />
          ) : (
            <div className="table-image">
              {field.value.length !== 0 && (
                <img src={URL.createObjectURL(field.value)} alt="temp-image" />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
