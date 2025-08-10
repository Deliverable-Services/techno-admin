import React, { useState } from "react";
// Replaced braft-editor with a simple textarea for now
import { useField } from "formik";
import { Container } from "react-bootstrap";
interface Props {
  label: string;
  name: string;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
}

const TextEditor = ({ name, label, setFieldValue, ...props }: Props) => {
  const [field] = useField({ name, ...props });
  const [value, setValue] = useState<string>(field.value || "");
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFieldValue(name, e.target.value);
    setValue(e.target.value);
  };
  return (
    <Container
      fluid
      className="p-0 my-2 rounded"
      style={{
        height: "400px",
        zIndex: -1,
        overflow: "hidden",
        marginTop: 10,
      }}
    >
      <span className="text-black " style={{ fontWeight: 500 }}>
        {label}
      </span>
      <div className="mx-auto">
        <textarea
          className="form-control"
          style={{ height: "300px", overflow: "auto", background: "#f0f0f0" }}
          value={value}
          onChange={handleChange}
        />
      </div>
    </Container>
  );
};

export default TextEditor;
