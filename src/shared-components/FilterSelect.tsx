import React from "react";
import { Form } from "react-bootstrap";

interface Props {
  onFilterChange: (idx: string, value: any) => void;
  label: string;
  currentValue: string;
  idx: string;
  data: Array<any>;
  valueSelector?: string;
  nameSelector?: string;
  defaultSelectTitle?: string;
  isDefaultDisabled?: boolean;
  width?: string;
}

const FilterSelect = ({
  onFilterChange,
  width = "200px",
  defaultSelectTitle = "All",
  isDefaultDisabled = false,
  label,
  currentValue,
  idx,
  data,
  valueSelector = "id",
  nameSelector = "name",
}: Props) => {
  return (
    <Form.Group>
      <Form.Label className="text-muted">{label}</Form.Label>
      <Form.Control
        as="select"
        value={currentValue}
        id={idx}
        onChange={(e) => onFilterChange(idx, e.target.value)}
        style={{
          width,
          fontSize: 14,
        }}
      >
        <option value="" disabled={isDefaultDisabled}>
          {defaultSelectTitle}
        </option>
        {data &&
          data.map((item) => (
            <option value={item[valueSelector]}>
              {item[nameSelector] || item[valueSelector]}
            </option>
          ))}
      </Form.Control>
    </Form.Group>
  );
};

export default FilterSelect;
