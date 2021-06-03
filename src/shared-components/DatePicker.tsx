import { Field, useField } from 'formik';
import moment from 'moment';
import React from 'react'
import { Form } from 'react-bootstrap'
import DateTime from 'react-datetime';



interface Props {
    label?: string;
    name: string;
    error?: string;
}

const DatePicker: React.FC<Props> = ({
    label, name, error, ...props
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

                    // <Form.Control
                    //     type="datetime-local"
                    //     value={data && moment(data[name]).format("yyyy-MM-ddThh:mm")}
                    //     onChange={(value: any) => {
                    //         console.log("value", value)
                    //         if (value)
                    //             setFieldValue(field.name, moment(value._d).format("YYYY-MM-DD hh:mm:ss"))
                    //     }}
                    // />
                    <Form.Control {...field} {...props} id={field.name} type="datetime-local" />

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
