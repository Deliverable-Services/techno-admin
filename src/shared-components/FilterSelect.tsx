import React from 'react'
import { Form } from 'react-bootstrap'

interface Props {
    onFilterChange: (idx: string, value: any) => void;
    label: string;
    currentValue: string;
    idx: string;
    data: Array<any>;
    valueSelector?: string;
    nameSelector?: string;
    defaultSelectTitle?: string;
    isDefaultDisabled?: boolean

}

const FilterSelect = ({ onFilterChange, defaultSelectTitle = "All", isDefaultDisabled = false, label, currentValue, idx, data, valueSelector = "id", nameSelector = "name" }: Props) => {
    return (
        <Form.Group>
            <Form.Label className="text-muted font-weight-bold">{label}</Form.Label>
            <Form.Control as="select" value={currentValue} id={idx} onChange={e => onFilterChange(idx, e.target.value)}
                style={{
                    width: "200px",
                    fontSize: 14
                }}

            >
                <option value="" disabled={isDefaultDisabled}>{defaultSelectTitle}</option>
                {
                    data && data.map(item => (
                        <option value={item[valueSelector]}>{item[nameSelector]}</option>
                    ))
                }
            </Form.Control>
        </Form.Group>
    )
}

export default FilterSelect
