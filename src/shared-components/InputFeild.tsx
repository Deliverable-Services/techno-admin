import React, { ChangeEvent, ElementType, InputHTMLAttributes } from "react";
import { useField } from "formik";
import { Form } from "react-bootstrap";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    name: string;
    as?: ElementType<any> | undefined;
    error?: string
    isFile?: boolean,
    setFieldValue?: (field: string, value: any, shouldValidate?: boolean | undefined) => void
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
    ...props
}) => {

    const [field] = useField(props);
    // <Form.File
    //     label="Choose File"
    //     custom {...field} {...props} id={field.name}
    // /> :

    return (

        <Form.Group>
            {
                label ?
                    <Form.Label htmlFor={field.name}>{label}</Form.Label>
                    : null
            }
            {
                isFile ?

                    <Form.File
                        id="custom-file"
                        label="Choose file"
                        custom
                        onChange={(e: ChangeEvent) => {
                            const input = (e.currentTarget as HTMLInputElement).files
                            if (input && setFieldValue) {
                                setFieldValue(field.name, input[0])
                            }
                        }}
                    /> :
                    <Form.Control {...field} {...props} id={field.name} as={as} />

            }
            {
                error &&
                <Form.Text className="text-danger">
                    {error}
                </Form.Text>
            }
        </Form.Group>


    );
};