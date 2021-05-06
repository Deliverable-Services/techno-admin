import { Field, useField } from 'formik';
import moment from 'moment';
import React from 'react'
import { Form } from 'react-bootstrap'
import DateTime from 'react-datetime';



interface Props {
    label?: string;
    name: string;
    error?: string;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
    inputProps?: React.HTMLProps<HTMLInputElement>
}

const DatePicker: React.FC<Props> = ({
    label, name, error, setFieldValue, inputProps, ...props
}) => {
    const [field] = useField({ ...props, name });
    return (
        <div className="w-100">
            <Form.Group>
                {
                    label ?
                        <Form.Label htmlFor={field.name}>{label}</Form.Label>
                        : null
                }
                {

                    <DateTime
                        inputProps={inputProps}
                        closeOnSelect
                        onChange={(value: any) => {
                            console.log("value", value)
                            if (value)
                                setFieldValue(field.name, moment(value._d).format("YYYY-MM-DD hh:mm:ss"))
                        }}
                    />
                    // <Form.Control {...field} {...props} id={field.name} />

                }
                {
                    error &&
                    <Form.Text className="text-danger">
                        {error}
                    </Form.Text>
                }
            </Form.Group>
        </div>
    )
}

export default DatePicker
