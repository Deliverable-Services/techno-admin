import React, { useState } from "react";
import BraftEditor from "braft-editor";
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
  const [value, setValue] = useState(
    BraftEditor.createEditorState(field.value)
  );
  const handleChange = (editorState: any) => {
    setFieldValue(name, editorState.toHTML());
    setValue(editorState);
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
        <BraftEditor
          value={value}
          onChange={handleChange}
          language="en"
          contentStyle={{ height: "300px", overflow: "auto" }}
          style={{
            height: "100%",
            zIndex: 999999,
            background: "#f0f0f0",
          }}
        />
      </div>
    </Container>
  );
};

export default TextEditor;
