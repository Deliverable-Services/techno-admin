import React, { useState } from 'react'
import BraftEditor from 'braft-editor'
import { useField } from 'formik'
import { Container } from 'react-bootstrap';
interface Props {
    label: string;
    name: string;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void,
}

const TextEditor = ({
    name, label, setFieldValue, ...props
}: Props) => {

    const [field] = useField({ name, ...props });
    const [value, setValue] = useState(BraftEditor.createEditorState(field.value))
    const handleChange = (editorState: any) => {
        setFieldValue(name, editorState.toHTML())
        setValue(editorState)
    }
    return (
        <Container fluid className="p-0"
            style={{ height: "400px", zIndex: -1 }}
        >
            <h4 className="text-black">{label}</h4>
            <div className="mx-auto">

                <BraftEditor
                    value={value}
                    onChange={handleChange}
                    language="en"
                    style={{ height: "100%", zIndex: 0 }}
                />
            </div>
        </Container>
    )
}

export default TextEditor
